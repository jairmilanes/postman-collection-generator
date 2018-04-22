'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _util = require('./../helper/util');

var _postmanSdk = require('postman-sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all postman collections
 *
 * @returns {Promise<*>} Promise that resolves with the collections object
 * @throws Error
 */
const getCollection = (() => {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          return _context.abrupt('return', _postmanSdk.Collections.get());

        case 4:
          _context.prev = 4;
          _context.t0 = _context['catch'](0);
          throw new Error(`Unexpected error occurred: ${_context.t0.message}`);

        case 7:
        case 'end':
          return _context.stop();
      }
    }, _callee, undefined, [[0, 4]]);
  }));

  return function getCollection() {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Checks if a collection exists on postman
 *
 * @param {object} collection The current collection
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const collectionExists = collection => collections => (0, _util.findBy)(collections.collections, 'name', collection.info.name);

/**
 * Updates a new collection
 *
 * @param {object} collection The collection object
 * @returns {function(*=): *} A function
 */
const updateCollection = collection => (() => {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(exists) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (exists) {
            _context2.next = 4;
            break;
          }

          _context2.t0 = _promise2.default.resolve(exists);
          _context2.next = 7;
          break;

        case 4:
          _context2.next = 6;
          return _postmanSdk.Collections.put(exists.uid, { collection });

        case 6:
          _context2.t0 = _context2.sent;

        case 7:
          return _context2.abrupt('return', _context2.t0);

        case 8:
        case 'end':
          return _context2.stop();
      }
    }, _callee2, undefined);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})();

/**
 * Create a new collection on postman
 *
 * @param {object} collection The collection object
 * @returns {function(*): *} A function
 */
const createCollection = collection => (() => {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(exists) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(exists === null)) {
            _context3.next = 6;
            break;
          }

          _context3.next = 3;
          return _postmanSdk.Collections.post({ collection });

        case 3:
          _context3.t0 = _context3.sent;
          _context3.next = 7;
          break;

        case 6:
          _context3.t0 = _promise2.default.resolve(exists);

        case 7:
          return _context3.abrupt('return', _context3.t0);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }, _callee3, undefined);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
})();

/**
 * Checks if the request resulted in an error
 *
 * @param {object} results THe results object
 * @returns {object} The results object
 */
const checkForError = results => {
  if (results.error) {
    throw new Error('Could not save collection to Postman: ' + results.error.message);
  }

  return _promise2.default.resolve(results);
};

/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const respond = results => _promise2.default.resolve({
  message: 'Collection created!',
  results
});

/**
 * Saves a collection to Postman
 *
 * @param {Object} collection The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */

exports.default = (() => {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(collection, environments = null) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _util.pipe)(getCollection, collectionExists(collection), updateCollection(collection), createCollection(collection), checkForError, respond)(collection.info.name);

        case 2:
          return _context4.abrupt('return', _context4.sent);

        case 3:
        case 'end':
          return _context4.stop();
      }
    }, _callee4, undefined);
  }));

  return function (_x3) {
    return _ref4.apply(this, arguments);
  };
})();