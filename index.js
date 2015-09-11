'use strict'

var debug = require('debug')('retry-fn')
var isFn = require('is-fn')

function fnWrap (fnOrConst) {
  if (!isFn(fnOrConst)) return function () { return fnOrConst }
  return fnOrConst
}

module.exports = function retry (opts, fn, done) {
  if (typeof opts === 'function') {
    done = fn
    fn = opts
    opts = {retries: 3, timeout: 0}
  }

  if (typeof opts === 'number') {
    opts = {retries: opts, timeout: 0}
  }

  var retryCnt = 0
  var coolDown = fnWrap(opts.timeout)
  var id = (Math.random() * 1e17).toString(32)

  setTimeout(fn, 0, attempt)
  debug('starting %s', id)
  return

  function attempt (err) {
    if (err) {
      if (++retryCnt >= opts.retries) return done.call(done, err)

      debug('errored %s', id)
      return setTimeout(fn, coolDown(retryCnt), attempt)
    }

    debug('succeeded %s', id)
    return done.apply(done, Array.prototype.slice.call(arguments))
  }
}

// Factor: 100
// Seq: 100, 100, 200, 300, 500, 800, 1300
module.exports.fib = function fib (factor) {
  var sqrt5 = Math.sqrt(5)

  return function (n) {
    return factor * ((Math.pow(1 + sqrt5, n) - Math.pow(1 - sqrt5, n)) / ((1 << n) * sqrt5))
  }
}

// Factor: 100
// Seq: 100, 100, 200, 300, 500, 900, 1500
module.exports.leo = function leo (factor) {
  var sqrt5 = Math.sqrt(5)
  var phi = (1 + sqrt5) / 2
  var psi = (1 - sqrt5) / 2

  return function (n) {
    return factor * (2 / sqrt5 * (Math.pow(phi, n + 1) - Math.pow(psi, n + 1)) - 1)
  }
}

// Factor: 25
// Seq: 1, 25, 625, 15625
module.exports.exp = function exp (factor) {
  return function (n) {
    return Math.pow(factor, n)
  }
}
