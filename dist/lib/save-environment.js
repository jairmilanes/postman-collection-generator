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

var _postmanSdk = require('postman-sdk');

var _util = require('../helper/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all postman collections
 *
 * @returns {Promise<*>} Promise that resolves with the collections object
 * @throws Error
 */
const getEnvironments = (() => {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          return _context.abrupt('return', _postmanSdk.Environments.get());

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

  return function getEnvironments() {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Checks if a collection exists on postman
 *
 * @param {object} environment The current environment
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const environmentExists = environment => environments => (0, _util.findBy)(environments.environments, 'name', environment.name);

/**
 * Updates a new collection
 *
 * @param {object} environment The environment object
 * @returns {function(*=): *} A function
 */
const updateEnvironment = environment => (() => {
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
          return _postmanSdk.Environments.put(exists.uid, { environment });

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
 * @param {object} environment The environment object
 * @returns {function(*): *} A function
 */
const createEnvironment = environment => (() => {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(exists) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (exists) {
            _context3.next = 6;
            break;
          }

          _context3.next = 3;
          return _postmanSdk.Environments.post({ environment });

        case 3:
          _context3.t0 = _context3.sent;
          _context3.next = 7;
          break;

        case 6:
          _context3.t0 = exists;

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
    throw new Error(`Could not save collection to Postman: ${results.error.message}`);
  }

  return results;
};

/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const respond = results => _promise2.default.resolve({
  message: 'Environments created!',
  results
});

/**
 * Saves a collection to Postman
 *
 * @param {Object} environments The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */

exports.default = (() => {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(collection, environments = null) {
    var _ref5;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt('return', _promise2.default.all(environments.map((() => {
            _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(environment) {
              return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.t0 = (0, _util.pipe)(environmentExists(environment.environment), updateEnvironment(environment.environment), createEnvironment(environment.environment), checkForError, respond);
                    _context4.next = 3;
                    return getEnvironments();

                  case 3:
                    _context4.t1 = _context4.sent;
                    _context4.next = 6;
                    return (0, _context4.t0)(_context4.t1);

                  case 6:
                    return _context4.abrupt('return', _context4.sent);

                  case 7:
                  case 'end':
                    return _context4.stop();
                }
              }, _callee4, undefined);
            }));
            return function (_x4) {
              return _ref5.apply(this, arguments);
            };
          })())));

        case 1:
        case 'end':
          return _context5.stop();
      }
    }, _callee5, undefined);
  }));

  return function (_x3) {
    return _ref4.apply(this, arguments);
  };
})();