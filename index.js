'use strict';

const _ = {};
_.defaults = require('lodash.defaults');

// Unicode surrogate range boundaries (inclusive)
const HIGH_SURROGATES_BEGIN = 0xD800;
const HIGH_SURROGATES_END   = 0xDBFF;
const LOW_SURROGATES_BEGIN  = 0xDC00;
const LOW_SURROGATES_END    = 0xDFFF;
const SURROGATES_BEGIN = HIGH_SURROGATES_BEGIN;
const SURROGATES_END   = LOW_SURROGATES_END;

function isInRange(value, begin, end) {
  return value >= begin && value <= end;
}

function isHighSurrogate(codeUnit) {
  return isInRange(codeUnit, HIGH_SURROGATES_BEGIN, HIGH_SURROGATES_END);
}

function isLowSurrogate(codeUnit) {
  return isInRange(codeUnit, LOW_SURROGATES_BEGIN, LOW_SURROGATES_END);
}

// Like String.prototype.charAt(), but treats surrogates correctly.
// Note: `index` must be specified in code units.
// Throws RangeError if
// - a lone surrogate is encountered (`str` contains invalid UTF-16)
// - index points inside a surrogate pair (invalid argument)
function charAt(str, index) {
  if (typeof str !== 'string') {
    throw TypeError('`str` must be a string');
  }
  if (typeof index !== 'number') {
    throw TypeError('`index` must be a number');
  }

  const codeUnit = str.charCodeAt(index);
  if (Number.isNaN(codeUnit)) {
    return '';
  }

  if (isLowSurrogate(codeUnit)) {
    if (index > 0 && isHighSurrogate(str.charCodeAt(index - 1))) {
      throw RangeError('Index points inside a surrogate pair');
    } else {
      throw RangeError('Invalid UTF-16: lone low surrogate encountered');
    }
  }

  if (isHighSurrogate(codeUnit)) {
    const codeUnit2 = str.charCodeAt(index + 1);
    if (Number.isNaN(codeUnit2) || !isLowSurrogate(codeUnit2)) {
      throw RangeError('Invalid UTF-16: lone high surrogate encountered');
    }
    return String.fromCharCode(codeUnit, codeUnit2);
  }

  return String.fromCharCode(codeUnit);
}

function generateRange(first, last) {
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
  return output.join('');
}

function subCompare(str, index, cmp) {
  return str.substr(index, cmp.length) === cmp;
}

const DEFAULT_OPTIONS = {ellipsis: '-'};

function expandString(str, options) {
  if (typeof options === 'string') {
    options = {ellipsis: options};
  }

  options = _.defaults({}, options, DEFAULT_OPTIONS);

  if (typeof options.ellipsis !== 'string' || !options.ellipsis.length) {
    throw new TypeError('`options.ellipsis` must be a non-empty string');
  }

  if (typeof str === 'undefined' || str === null) {
    str = '';
  }
  if (typeof str !== 'string') {
    throw new TypeError('`str` must be a string');
  }

  const ellipsis = options.ellipsis;

  let output = [];
  for (let i = 0; i < str.length; ) {
    // get current character and move i to next index
    let ch = charAt(str, i);
    i += ch.length;

    // test for escape character; treat trailing escape character as literal
    if (ch === '\\' && i < str.length) {
      // get escaped character and move i to next index
      ch = charAt(str, i);
      i += ch.length;
      // push escaped character
      output.push(ch);
      continue;
    }

    // test for range expression; treat trailing ellipsis as literal
    if (subCompare(str, i, ellipsis) && i + ellipsis.length < str.length) {
      // get range end character and move i to next index
      i += ellipsis.length;
      let ch2 = charAt(str, i);
      i += ch2.length;
      // push range
      output.push(generateRange(ch, ch2));
      continue;
    }

    // push plain character
    output.push(ch);
  }
  return output.join('');
}

exports = module.exports = expandString;
exports.charAt = charAt;
exports.generateRange = generateRange;

