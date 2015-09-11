'use strict'

const unreliableFunction = function (callback) { callback(Math.random() > 0.2 ? null : Error()) }

// n being the retry counter
// Returns 1000, 3000, 9000, 27000, 60000, 60000, ...
const clampedTimeout = function (n) {
  const minTimeout = 1 * 1000
  const maxTimeout = 60 * 1000
  const factor = 3

  // n - 1 so we start at the minimum as x^0 = 1
  const timeout = minTimeout * Math.pow(factor, n - 1)

  return Math.min(timeout, maxTimeout)
}

const retry = require('..').bind(null, {retries: 3, timeout: clampedTimeout})

retry(unreliableFunction, function (err, res) {
  if (err) return console.error(err)

  console.log('passed!')
})
