'use strict';

const _ = {};
_.defaults = require('lodash.defaults');
const unicodeUtil = require('./unicode-util');
const charAt = unicodeUtil.charAt;
const SURROGATES_BEGIN = unicodeUtil.SURROGATES_BEGIN;
const SURROGATES_END = unicodeUtil.SURROGATES_END;

const DEFAULT_OPTIONS = {
  returnArray: false
};

function generateRange(first, last, options) {
  options = _.defaults({}, options, DEFAULT_OPTIONS);
  if (typeof options.returnArray !== 'boolean') {
    throw new TypeError('`options.returnArray` must be a boolean');
  }

  if (typeof first !== 'string') {
    throw new TypeError('`first` must be a string');
  }
  if (typeof last !== 'string') {
    throw new TypeError('`last` must be a string');
  }

  const firstChar = charAt(first, 0);
  const lastChar = charAt(last, 0);

  if (first.length !== firstChar.length) {
    throw new TypeError('`first` must consist of a single character');
  }
  if (last.length !== lastChar.length) {
    throw new TypeError('`last` must consist of a single character');
  }

  const firstCodePoint = firstChar.codePointAt(0);
  const lastCodePoint = lastChar.codePointAt(0);
  const reverse = firstCodePoint > lastCodePoint;
  const min = reverse ? lastCodePoint : firstCodePoint;
  const max = reverse ? firstCodePoint : lastCodePoint;
  // min and max are now guaranteed to be outside of the surrogate range

  let output = [];

  if (min < SURROGATES_BEGIN && max > SURROGATES_END) {
    // range spans across the surrogate range
    for (let i = min; i < SURROGATES_BEGIN; ++i) {
      output.push(String.fromCodePoint(i));
    }
    for (let i = SURROGATES_END + 1; i <= max; ++i) {
      output.push(String.fromCodePoint(i));
    }
  } else {
    for (let i = min; i <= max; ++i) {
      output.push(String.fromCodePoint(i));
    }
  }

  if (reverse) {
    output = output.reverse();
  }
  return options.returnArray ? output : output.join('');
}

module.exports = generateRange;

