`retry-fn`
==========

A more functional retry function

Installation
------------

```bash
npm install retry-fn
```

Example
-------

```js
var retryFn = require('retry-fn')

var retry = retryFn.bind(null, {retries: 3, timeout: retryFn.fib(75)})

retry(unreliableFunction, function (err, result) {
  // ...
})
```

Reference
---------

`retry-fn` exports a function that takes 3 arguments:

* *optional* `Number||Object`, number of times to retry or an options object.
  Defaults to {retries: 3, timeout: 0}.
   `{retries: Number, timeout: Number||Function}`:

  * `retries` number of times to retry before calling the callback with an error
  * `timeout` a function taking the retry count, returning the number of milliseconds
    before attempting again. If anything else is passed it will be wrapped in a
    function and return that value on each call. Eg. pass a Number for "equally"
    spaced retries.
* Function to attempt. Expecting the format `function(callback) { /* ... */ }`.
  If your function takes any other arguments, consider binding it or wrapping it.
  See [`example/hyperquest.js`](example/hyperquest.js)
* Callback which is called on success or when all retries have been exhausted.

Comes with three timeout functions builtin:

* `retry.fib(factor)`, returns a function for generating the Fibonacci sequence.
  With `factor=100`: 100, 100, 200, 300, 500, 800, 1300
* `retry.leo(factor)`, returns a function for generating the Leonardo sequence.
  With `factor=100`: 100, 100, 200, 300, 500, 900, 1500
* `retry.exp(factor)`, returns a function for generating a sequence according to
  `factor^n`. With `factor=25`: 1, 25, 625, 15625

License
-------

[ISC](LICENSE)
