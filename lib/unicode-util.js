'use strict';

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
    throw new TypeError('`str` must be a string');
  }
  if (typeof index !== 'number') {
    throw new TypeError('`index` must be a number');
  }

  const codeUnit = str.charCodeAt(index);
  if (Number.isNaN(codeUnit)) {
    return '';
  }

  if (isLowSurrogate(codeUnit)) {
    if (index > 0 && isHighSurrogate(str.charCodeAt(index - 1))) {
      throw new RangeError('Index points inside a surrogate pair');
    } else {
      throw new RangeError('Invalid UTF-16: lone low surrogate encountered');
    }
  }

  if (isHighSurrogate(codeUnit)) {
    const codeUnit2 = str.charCodeAt(index + 1);
    if (Number.isNaN(codeUnit2) || !isLowSurrogate(codeUnit2)) {
      throw new RangeError('Invalid UTF-16: lone high surrogate encountered');
    }
    return String.fromCharCode(codeUnit, codeUnit2);
  }

  return String.fromCharCode(codeUnit);
}

module.exports = {
  charAt,
  HIGH_SURROGATES_BEGIN,
  HIGH_SURROGATES_END,
  LOW_SURROGATES_BEGIN,
  LOW_SURROGATES_END,
  SURROGATES_BEGIN,
  SURROGATES_END
};

