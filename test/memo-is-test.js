/*
 * node-memo-is.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var memo   = require('../lib/memo-is')
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

  describe('can be used with values iso objects', function() {
      example.is(['bob']);

      it('returns the overridden value', function(){
          assert.equal(example()[0], 'bob');
      });

  })
});
