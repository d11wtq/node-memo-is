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

  it('returns the same value every time', function(){
    assert(example() === example());
  });

  describe('when overridden', function(){
    example.is(function() { return ['bob']; });

    it('returns the overridden value', function(){
      assert.equal(example()[0], 'bob');
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

## Copyright & Licensing

Written and maintained by Chris Corbyn. Licensed under the MIT license.
See the LICENSE file for details.
