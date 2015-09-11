'use strict'

const test = require('tape')

const retry = require('.')

// Test API
test('call without opts, default retries = 3', function (assert) {
  let callCtn = 0
  function fn (done) {
    callCtn++
    done(Error('try again'))
  }

  retry(fn, function (err) {
    assert.ok(err instanceof Error)
    assert.equal(callCtn, 3)
    assert.end()
  })
})

test('call with opts being object', function (assert) {
  let callCtn = 0
  function fn (done) {
    callCtn++
    done(Error('try again'))
  }

  retry({retries: 2}, fn, function (err) {
    assert.ok(err instanceof Error)
    assert.equal(callCtn, 2)
    assert.end()
  })
})

// Test attempt logic
test('retry 2 should try once, then fail', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    return cb(Error('try again'))
  }

  retry(2, fn, function (err, res) {
    assert.ok(err instanceof Error)
    assert.notOk(res)
    assert.equal(callCnt, 2)
    assert.end()
  })
})

test('retry 1 should try once, then fail', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    return cb(Error('try again'))
  }

  retry(1, fn, function (err, res) {
    assert.ok(err instanceof Error)
    assert.notOk(res)
    assert.equal(callCnt, 1)
    assert.end()
  })
})

test('retry 2 should try trice, then succeed', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    if (callCnt < 2) return cb(Error('try again'))
    return cb(null, 'success')
  }

  retry(2, fn, function (err, res) {
    assert.error(err)
    assert.equal(callCnt, 2)
    assert.equal(res, 'success')
    assert.end()
  })
})

test('retry 1, should try once, then succeed', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    if (callCnt < 1) return cb(Error('try again'))
    return cb(null, 'success')
  }

  retry(1, fn, function (err, res) {
    assert.error(err)
    assert.equal(callCnt, 1)
    assert.equal(res, 'success')
    assert.end()
  })
})

test('retry 0 should try once, then succeed', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    if (callCnt < 1) return cb(Error('try again'))
    return cb(null, 'success')
  }

  retry(0, fn, function (err, res) {
    assert.error(err)
    assert.equal(callCnt, 1)
    assert.equal(res, 'success')
    assert.end()
  })
})

test('retry -1 should try once, then succeed', function (assert) {
  let callCnt = 0
  function fn (cb) {
    callCnt++
    if (callCnt < 1) return cb(Error('try again'))
    return cb(null, 'success')
  }

  retry(-1, fn, function (err, res) {
    assert.error(err)
    assert.equal(callCnt, 1)
    assert.equal(res, 'success')
    assert.end()
  })
})

// Test timeout functions
test('Fib sequence', function (assert) {
  const f = retry.fib(100)
  assert.deepEqual(
    [f(0), f(1), f(2), f(3), f(4), f(5), f(6), f(7)],
    [0, 100, 100, 200, 300, 500, 800, 1300]
  )
  assert.end()
})

test('Leo sequence', function (assert) {
  const f = retry.leo(100)
  assert.deepEqual(
    [f(0), f(1), f(2), f(3), f(4), f(5), f(6), f(7)],
    [100, 100, 300, 500, 900, 1500, 2500, 4100]
  )
  assert.end()
})

test('Exp(25) sequence', function (assert) {
  const f = retry.exp(25)
  assert.deepEqual(
    [f(0), f(1), f(2), f(3)],
    [1, 25, 625, 15625]
  )
  assert.end()
})

// Test timeout logic
test('retry 3 by fibbonaci sequence', function (assert) {
  const startTime = process.hrtime()
  let callCnt = 0
  function fn (cb) {
    callCnt++
    return cb(Error('try again'))
  }

  retry({retries: 6, timeout: retry.fib(100)}, fn, function (err, res) {
    const elapsedTime = process.hrtime(startTime)
    assert.ok((elapsedTime[0] * 1000 + elapsedTime[1] / 1e6) > 1200)
    assert.ok(err instanceof Error)
    assert.notOk(res)
    assert.equal(callCnt, 6)
    assert.end()
  })
})
