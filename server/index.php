<?php
date_default_timezone_set('Europe/Rome');
require 'config.inc.php';
require 'vendor/autoload.php';

class App {
	private static $instance = null;

  public static function get() {
    if(self::$instance === null) self::$instance = new self();
    return self::$instance;
  }

  private function __construct() {}

  public function run() {
    $this->setup();

    Flight::route('GET /simulation.json', array($this, 'get_simulations'));
    Flight::route('GET /simulation/@id.json', array($this, 'get_simulation'));
    Flight::route('POST /simulation.json', array($this, 'save_simulation'));
    Flight::route('POST /simulation/@id.json', array($this, 'save_simulation'));
    Flight::route('DELETE /simulation/@id.json', array($this, 'delete_simulation'));

    // start Flight
    Flight::start();
  }

  public function get_simulations() {
    // get the db
    $db = Flight::db();

    $st = $db->query("
      SELECT
        id,
        name,
        modified
      FROM
        `" . PDO_PREFIX . "simulations`
      ");

    $st->setFetchMode(PDO::FETCH_ASSOC);

    $results = $st->fetchAll();

    foreach($results as &$result) {
      $result['modified'] = $this->date_to_timestamp($result['modified']);
    }

    Flight::response()->header('Content-Type', 'application/json; charset=utf-8');
    echo json_encode($results);
    Flight::stop();
  }

  public function get_simulation($id) {
    // get the db
    $db = Flight::db();

    $st = $db->prepare("
      SELECT
        id,
        name,
        modified,
        data
      FROM
        `" . PDO_PREFIX . "simulations`
      WHERE
        id = :id
      ");

    $st->setFetchMode(PDO::FETCH_ASSOC);

    $st->execute(array(
      ':id' => $id
    ));

    $result = $st->fetch();

    if(empty($result)) throw new Exception('invalid id');

    if(!empty($result)) {
      $result['modified'] = $this->date_to_timestamp($result['modified']);
      $data = $result['data'];
      unset($result['data']);
      $result = array_merge($result, unserialize($data));
    }

    Flight::response()->header('Content-Type', 'application/json; charset=utf-8');
    echo json_encode($result);
    Flight::stop();
  }

  public function save_simulation($id = null) {
    static $non_data_fields = array(
      'name'
    );

    $post_data = file_get_contents('php://input');
    $record = json_decode($post_data, true);
    $data = array();

    foreach($record as $key => $value) {
      if(!in_array($key, $non_data_fields)) {
        $data[$key] = $value;
      }
    }

    $data = serialize($data);

    // get the db
    $db = Flight::db();

    $params = array(
      ':name' => $record['name'],
      ':modified' => date('Y-m-d H:i:s'),
      ':data' => $data
    );


    if(!empty($id)) {
      $params[':id'] = $id;

      $st = $db->prepare("
        UPDATE `" . PDO_PREFIX . "simulations`
        SET
          name = :name,
          modified = :modified,
          data = :data
        WHERE
          id = :id
        ");
    }
    else {
      $st = $db->prepare("
        INSERT INTO `" . PDO_PREFIX . "simulations`
        (
          name,
          modified,
          data
        )
        VALUES
        (
          :name,
          :modified,
          :data
        )
        ");
    }

    $st->execute($params);

    if(empty($id)) $id = $db->lastInsertId();

    $this->get_simulation($id);
  }

  public function delete_simulation($id) {
    // get the db
    $db = Flight::db();

    $st = $db->prepare("
      DELETE FROM `" . PDO_PREFIX . "simulations`
      WHERE
        id = :id
      ");

    $result = $st->execute(array(
      ':id' => $id
    ));

    Flight::response()->header('Content-Type', 'application/json; charset=utf-8');
    echo json_encode($result);
    Flight::stop();
  }

  public function handle_exception(Exception $e) {
        // log the error
    $log_msg = sprintf("%s (%s)\nTrace: %s",
      $e->getMessage(),
      $e->getCode(),
      $e->getTraceAsString()
      );

    $this->log_error($log_msg);

        // output a generic failure
    $msg = '<h1>500 Internal Server Error</h1>';
    try {
      Flight::halt(500, $msg);
    }
    catch (Exception $e2) {
      exit($msg);
    }
  }

  private function date_to_timestamp($date) {
    return strtotime($date);
  }

  private function log_error($message) {
    static $sending_email_error = false;

    $log_msg = sprintf("%s - %s\nURI: %s\nREQUEST: %s\nSERVER: %s\n",
      date('Y-m-d H:i:s'),
      $message,
      $_SERVER['REQUEST_URI'],
      print_r($_REQUEST, true),
      print_r($_SERVER, true)
      );
    $fp = fopen(__DIR__ . '/log/error.log', 'a');
    if(is_resource($fp)) {
      fwrite($fp, $log_msg);
      fclose($fp);
    }

    if(defined('EMAIL_DEV') && !$sending_email_error) {
      $sending_email_error = true;
      try {
        error_log($message, 1, EMAIL_DEV);
      }
      catch(Exception $ex) {
        $this->handle_exception($ex);
      }
      $sending_email_error = false;
    }
  }

  private function setup() {
        // error handling
    if(!DEBUG) {
      Flight::map('error', array($this, 'handle_exception'));
    }

        // DB setup
    Flight::register('db', 'PDO', array(PDO_DSN, PDO_USERNAME, PDO_PASSWORD), function($db) {
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    });
  }
}

App::get()->run();
