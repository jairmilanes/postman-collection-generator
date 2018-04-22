"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pipe = exports.findBy = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Simple findBy recursive utility
 *
 * @param {array} array The array to look into
 * @param {string} by The key to compare
 * @param {string} value The value to compare
 * @returns {null|*} Null or the value found
 */
const findBy = exports.findBy = (array, by, value) => {
	/**
  * @param {number} index The current index
  * @returns {null|*} Null or the value found
  */
	const r = index => {
		if (array[index][by] === value) {
			return array[index];
		}

		if (++index > array.length - 1) {
			return null;
		}

		return r(index);
	};

	return r(0);
};

/**
 * Pipe async functions
 *
 * @param {object} fns The fns
 * @returns {function(*=): *} The result
 */
const pipe = exports.pipe = (...fns) => x => fns.reduce((prev, f) => prev.then(f), _promise2.default.resolve(x));