/*jshint bitwise: false*/
/*jshint worker: true*/
'use strict';

/*
 * Solves a Bounded Knapsack Problem, see http://www.or.deis.unibo.it/kp/Chapter3.pdf
 */
function setBit(bits, pos) {
  var i = Math.floor(pos / 32);
  bits[i] |= 1 << pos - i * 32;
}

function getBit(bits, pos) {
  var i = Math.floor(pos / 32);
  return !!(bits[i] & (1 << pos - i * 32));
}

function copyBits(source, dest) {
  for(var i = 0; i < source.length; i++) {
    dest[i] = source[i];
  }
}

function log() {
  self.postMessage({
    action: 'log',
    args: Array.prototype.slice.call(arguments, 0)
  });
}

var lastProgress = null;
function progress(p) {
  var newProgress = Math.round(p * 100);
  if(lastProgress === null || lastProgress !== newProgress) {
    self.postMessage({
      action: 'progress',
      progress: newProgress
    });
    lastProgress = newProgress;
  }
}

function finished(solution) {
  self.postMessage({
    action: 'solution',
    solution: solution
  });
}

self.onmessage = function(e) {
  var i, j, object, object01;
  var problem = e.data;
  log('solving problem', problem);

  // transform the bounded problem into a 0/1 problem
  var objects01 = [];
  for(var index = 0; index < problem.objects.length; index++) {
    object = problem.objects[index];
    var remaining = object.max;

    if(remaining === 0) {
      remaining = Math.ceil(problem.capacity / object.weight);
    }

    var quantity = 1;
    while(remaining - quantity >= 0) {
      objects01.push({
        index: index,
        quantity: quantity
      });
      remaining -= quantity;
      quantity *= 2;
    }

    if(remaining > 0) {
      objects01.push({
        index: index,
        quantity: remaining
      });
    }
  }

  // init DP
  var bitsLength = Math.ceil(objects01.length / 32);
  var m = [];
  var s = [];
  for(i = 0; i <= problem.capacity; i++) {
    var bits = [];
    for(j = 0; j < bitsLength; j++) {
      bits.push(0);
    }
    m.push(0);
    s.push(bits);
  }

  // DP
  var totalSteps = objects01.length * m.length;
  var steps = 0;
  for(i = 0; i < objects01.length; i++) {
    object01 = objects01[i];
    object = problem.objects[object01.index];
    var weight = object.weight * object01.quantity;
    var value = object.value * object01.quantity;
    for(j = problem.capacity; j >= weight; j--) {
      var newValue = m[j - weight] + value;
      if(newValue > m[j]) {
        m[j] = newValue;
        copyBits(s[j - weight], s[j]);
        setBit(s[j], i);
      }
      steps++;
      progress(steps / totalSteps);
    }
    steps = (i + 1) * m.length;
    progress(steps / totalSteps);
  }

  // build solution
  var solution = [];
  for(i = 0; i < problem.objects.length; i++) {
    solution.push(0);
  }
  var best = s[s.length - 1];
  for(var index01 = 0; index01 < objects01.length; index01++) {
    if(getBit(best, index01)) {
      object01 = objects01[index01];
      solution[object01.index] += object01.quantity;
    }
  }

  log('solution', solution);

  finished(solution);
};
