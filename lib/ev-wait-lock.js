var AsyncLock = require('async-lock');
var lock = new AsyncLock();

function waitLock(key, fn, finalCb) {
  lock.acquire(key, fn, finalCb);
}

function failFastLock(key, fn, finalCb) {
  if (lock.isBusy(key)) {
    var err = new Error('Lock is already caught');
    // err.retriable = false;
    return finalCb(err);
  }
  lock.acquire(key, fn, finalCb);
}

module.exports.waitLock = waitLock;
module.exports.failFastLock = failFastLock;
