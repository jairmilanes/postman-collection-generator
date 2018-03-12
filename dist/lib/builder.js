'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fp = require('lodash/fp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const build = (() => {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(collection, router, config) {
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0:
					return _context.abrupt('return', (0, _fp.pipe)([filterStack('name', 'router'), // routes
					function (routes) {
						return routes;
					}, function (routes) {
						return (0, _fp.map)(function (route) {
							return (0, _fp.pipe)([ensureFolderExists(collection), addItems(collection)])(route);
						})(routes);
					}, function (collections) {
						// console.info(collection)
						return collection;
					}
					//await saveCollection(config), // payload
					//await saveEnvironment(config), // payload
					//saveCollectionFile(config) // payload
					])(router));

				case 1:
				case 'end':
					return _context.stop();
			}
		}, _callee, undefined);
	}));

	return function build(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})();

/**
 *
 * @param stack
 * @param by
 * @param value
 */
const filterStack = (by, value) => route => route.stack.filter(route => route[by] === value);

/**
 * Checks if the endpoints group folder exists and if not create it
 *
 * @param {Object} collection The collection
 * @param {Object} route The route
 * @returns {Object} The collection
 */
const ensureFolderExists = collection => route => {
	const id = cleanRegex(route.regexp.source);
	if (!collection.item.has(id)) {
		collection.item.addFolder(id);
	}

	return route;
};

/**
 * Cleans a route regexp string to the the groupId
 *
 * @param {String} regex The regex string
 * @returns {string} The sanitized string
 */
const cleanRegex = regex => {
	// @todo create better folder labels for first level routes instead of the route path cleaned from the regex
	const matches = regex.match(/\^(.*?)\?/g, '');
	if (matches.length) {
		return matches[0].replace(/[\\^$?]/g, '');
	}
	throw new Error(`Could not extract id from ${regex}`);
};

/**
 * Add route items to collection
 *
 * @param {object[]} stack The route stack
 * @param {string} groupId The group id for this stack
 * @param {object} collection The collection
 * @returns {*} The collection
 */
const addItems = collection => route => {
	const groupId = cleanRegex(route.regexp.source);
	const stack = route.handle.stack;

	if (!stack.length) {
		return collection;
	}
	/**
  * Resursive helper
  *
  * @param {number} index The current index
  * @returns {*} The collection
  */
	const r = index => {
		const route = stack[index];

		if (!route.route && route.handle && route.handle.stack) {
			return addItems(collection)(route);
		}

		(0, _fp.map)(method => {
			collection.item.addToFolder(groupId, `/${groupId}${route.route.path}`, method);
		})((0, _keys2.default)(route.route.methods));

		if (++index > stack.length - 1) {
			return collection;
		}

		r(++index);
	};

	return r(0);
};

exports.default = build;