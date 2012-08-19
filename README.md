# Memoization, like RSpec let for Node.js & Mocha/Jasmine

memo-is provides a memoization system with the same semantics as `#let` in
RSpec for Ruby. It allows you to provide a function that should be memoized
for the duration of a spec example and reset between examples. It also
supports nested overriding, as expected.

It will work with Jasmine and Mocha out of the box, since it only needs to
hook into `beforeEach()` and `afterEach()` hooks to work. It may work with
other testing frameworks (e.g. vows) if you can provide implementations of
`beforeEach()` and `afterEach()` to do the correct thing.

## Installation

This should work just fine in a browser, if you include the lib/memo-is.js
file via a `<script>` tag. For Node.js, you can install it via NPM:

    npm install memo-is

## Usage

What better way to document this usage than with a spec? :-) This is the
actual spec from the package itself.

``` javascript
var memo   = require('memo-is')
  , assert = require('assert')
  ;

describe('Memoizer', function(){
  var example = memo().is(function() { return []; });
  var value;

  beforeEach(function() { value = example(); });

  it('returns the same value every time', function(){
    assert(example() === example());
  });

  describe('when overridden', function(){
    example.is(function() { return ['bob']; });

    it('returns the overridden value', function(){
      assert.equal(example()[0], 'bob');
    });

    it('is available in the before of an outer context', function(){
      assert.equal(value[0], 'bob');
    });

    describe('and used in a sub context', function(){
      it('returns the overridden value', function(){
        assert.equal(example()[0], 'bob');
      });
    });
  });

  describe('state between tests', function(){
    it('is reset to the value for the current context', function(){
      assert.equal(example().length, 0);
    });

    describe('when the value is modified', function(){
      it('is changed in the example that modifies it', function(){
        example().push(42);
        assert.equal(example()[0], 42);
      });

      it('is reset between examples', function(){
        assert.equal(example().length, 0);
      });
    });
  });
});
```

## Caveats

One thing you should be aware of is the fact that memo-is depends on the
`before()` hook in order to prepare the memoized function. When working with
the memoized function inside a `beforeEach()`, you won't have any unexpected
issues. When working with it inside a `before()` hook of a context nested
deeper than where the memoized function is defined, you won't have any issues
neither. When working, however, with a `before()` hook in the same context as
where you define the memoized function, you *must* define the memoizer first,
so that it is available in your `before()` hook.

This is fine:

``` javascript
describe('using inside a before()', function(){
  var numPlusOne;
  var example = memo().is(function(){ return 42; });

  before(function() { numPlusOne = example() + 1; }

  it('works when the hook is declared after the memoizer', function(){
    assert.equal(numPlusOne, 43);
  });
});
```

This won't work:

``` javascript
describe('using inside a before()', function(){
  var numPlusOne;

  before(function() { numPlusOne = example() + 1; }

  var example = memo().is(function(){ return 42; }); // too late!

  it('explodes in an unexpected way', function(){
    assert.equal(numPlusOne, 43);
  });
});
```

The same applies for overriding memoizer functions—do the override first.

If anybody can think of a way to remove this limitation, please send a pull
request :-)

## Copyright & Licensing

Written and maintained by Chris Corbyn. Licensed under the MIT license.
See the LICENSE file for details.
