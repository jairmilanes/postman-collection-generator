'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('lodash/fp/map');

var _map2 = _interopRequireDefault(_map);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Router stack filter constructor
 *
 * @param {string} by The key that will be used to filter the routes
 * @param {string} value The value which to compare to
 * @returns {function(route:object)} The filterStack function
 */
const filterStack = (by, value) =>
/**
 * Router stack filter
 *
 * @param {object} route The route Layer
 * @returns {Object[]} An array of routes
 */
route => route.stack.filter(route => route[by] === value);

/**
 * Checks if the endpoints group folder exists and if not create it
 *
 * @param {Object} collection The collection
 * @returns {Object} The collection
 */
const ensureFolderExists = collection =>
/**
 * Checks if the endpoints group folder exists and if not create it
 *
 * @param {object} route The route Layer
 * @returns {*}
 */
route => {
	const id = getGroupId(route.regexp.source);
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
const getGroupId = regex => {
	// @todo create better folder labels for first level routes instead of the route path cleaned from the regex
	const matches = regex.match(/\^(.*?)\?/g, '');
	if (matches.length) {
		return matches[0].replace(/[\\^$?]/g, '').slice(0, -1);
	}
	throw new Error(`Could not extract id from ${regex}`);
};

/**
 * Add route items to collection
 *
 * @param {object} collection The collection
 * @returns {*} The collection
 */
const addItems = collection =>
/**
 * Adds items to the collection
 *
 * @param {object} route The route Layer
 * @returns {*}
 */
route => {
	const groupId = getGroupId(route.regexp.source);
	const stack = route.handle.stack;

	if (!stack.length) {
		return collection;
	}
	/**
  * Recursive helper
  *
  * @param {number} index The current index
  * @returns {*} The collection
  */
	const r = index => {
		// @todo remove this function from here into a separate function
		const route = stack[index];

		if (!route.route) {
			return addItems(collection)(route);
		}

		createItemsFromMethods(collection, groupId, route.route);

		if (++index > stack.length - 1) {
			return collection;
		}

		r(index);
	};

	return r(0);
};

/**
 * Creates items based on the route methods
 *
 * @param {object} collection The collection
 * @param {string} groupId The group to add the new items to
 * @param {object} route A route layer
 * @returns {String[]} The method names that were added to the collection
 */
const createItemsFromMethods = (collection, groupId, route) => {
	return (0, _map2.default)(method => {
		collection.item.addToFolder(groupId, `${groupId}${route.path}`, method);
	})((0, _keys2.default)(route.methods));
};

/**
 * The collection builder
 *
 * @param {object} collection The collection
 * @param {object} router The app router object
 * @param {object} config The config object
 * @returns {Promise<Object>} A pronise that resolves with the built collection
 */

exports.default = (() => {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(collection, router, config) {
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0:
					(0, _pipe2.default)([filterStack('name', 'router'), function (routes) {
						return (0, _map2.default)(function (route) {
							return (0, _pipe2.default)([ensureFolderExists(collection), addItems(collection)])(route);
						})(routes);
					}])(router);

					return _context.abrupt('return', collection);

				case 2:
				case 'end':
					return _context.stop();
			}
		}, _callee, undefined);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})();