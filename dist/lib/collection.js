'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fp = require('lodash/fp');

var _postmanSdk = require('postman-sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Saves a collection to Postman
 *
 * @param {Object} collection The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */
const save = config => (() => {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(collection) {
		var exists, results;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0:
					_context.prev = 0;


					(0, _fp.pipe)([exists(collection)]);

					_context.next = 4;
					return exists(collection.collection.info.name);

				case 4:
					exists = _context.sent;

					console.info('COLLECTION EXISTS?', exists);

					if (exists) {
						_context.next = 12;
						break;
					}

					_context.next = 9;
					return _postmanSdk.Collections.post(collection);

				case 9:
					results = _context.sent;
					_context.next = 16;
					break;

				case 12:
					collection.collection.info._postman_id = exists.id;
					_context.next = 15;
					return _postmanSdk.Collections.put(exists.id, collection);

				case 15:
					results = _context.sent;

				case 16:
					if (!results.error) {
						_context.next = 19;
						break;
					}

					console.error(`Could not save collection to Postman: ${results.error.message}`, results);

					return _context.abrupt('return', false);

				case 19:

					collection.info._postman_id = results.collection.id;

					console.info(`Collection ${results.collection.name} (${results.collection.id}) Saved To Postman!`);

					return _context.abrupt('return', results.collection);

				case 24:
					_context.prev = 24;
					_context.t0 = _context['catch'](0);

					console.error(`Could not save collection to Postman: ${_context.t0.message}`, _context.t0);

					return _context.abrupt('return', false);

				case 28:
				case 'end':
					return _context.stop();
			}
		}, _callee, undefined, [[0, 24]]);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
})();

/**
 * Checks if a collection exists on postman
 *
 * @param {String} name The collection name
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const exists = collection => (() => {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(name) {
		var results, filerCollection;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) switch (_context2.prev = _context2.next) {
				case 0:
					_context2.prev = 0;
					_context2.next = 3;
					return _postmanSdk.Collections.get();

				case 3:
					results = _context2.sent;

					if (!results.collections) {
						_context2.next = 7;
						break;
					}

					filerCollection = results.collections.filter(function (collection) {
						return collection.name === name;
					});
					return _context2.abrupt('return', filerCollection.length > 0 ? filerCollection[0] : false);

				case 7:
					return _context2.abrupt('return', false);

				case 10:
					_context2.prev = 10;
					_context2.t0 = _context2['catch'](0);

					console.error(`Error while trying to check if the collection "${name}" exists: ${_context2.t0.message}`);
					return _context2.abrupt('return', false);

				case 14:
				case 'end':
					return _context2.stop();
			}
		}, _callee2, undefined, [[0, 10]]);
	}));

	return function (_x2) {
		return _ref2.apply(this, arguments);
	};
})();

exports.default = save;