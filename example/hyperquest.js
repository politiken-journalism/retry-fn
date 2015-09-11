'use strict'

const hyperquest = require('hyperquest')
const retryFn = require('..')

// Bind opts to retry 3 times, with a cool down that grows proprtional to
// the fibbonaci sequence
const retry = retryFn.bind(null, {retries: 3, timeout: retryFn.fib(75)})

retry(hyperquest.bind(hyperquest, 'http://unreliable.com'), function (err, res) {
  if (err) return console.error(err)

  res.pipe(process.stdout)
})
