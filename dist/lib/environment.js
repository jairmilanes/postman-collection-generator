'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _postmanSdk = require('postman-sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { environment } = _postmanSdk.Builder;

/**
 * Saves an environment to post man
 *
 * @param {object} payload The object payload
 * @param {object} config The config object
 * @returns {Promise<any[]>} A Promise
 */
const save = config => (() => {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(payload, config) {
		var _ref2;

		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) switch (_context2.prev = _context2.next) {
				case 0:
					return _context2.abrupt('return', config.environments.map((() => {
						_ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(env) {
							var name, newEnv, exists, results;
							return _regenerator2.default.wrap(function _callee$(_context) {
								while (1) switch (_context.prev = _context.next) {
									case 0:
										name = `${payload.collection.info.name.toUpperCase()}_${env.name.toUpperCase()}`;
										newEnv = environment(name);


										config.values.map(function (variable) {
											return newEnv.add(variable);
										});

										_context.prev = 3;
										_context.next = 6;
										return exists(name);

									case 6:
										exists = _context.sent;


										console.info('COLLECTION EXISTS?', exists);

										if (exists) {
											_context.next = 14;
											break;
										}

										_context.next = 11;
										return _postmanSdk.Environments.post(newEnv);

									case 11:
										results = _context.sent;
										_context.next = 17;
										break;

									case 14:
										_context.next = 16;
										return _postmanSdk.Environments.put(exists.id, newEnv);

									case 16:
										results = _context.sent;

									case 17:
										if (!results.error) {
											_context.next = 20;
											break;
										}

										console.error(`Could not save collection to Postman: ${results.error.message}`, results);

										return _context.abrupt('return', false);

									case 20:

										console.info(`Environment ${results.environment.name} (${results.environment.id}) Saved To Postman!`);

										return _context.abrupt('return', results.environment);

									case 24:
										_context.prev = 24;
										_context.t0 = _context['catch'](3);

										console.error(`Could not save collection to Postman: ${_context.t0.message}`, _context.t0);

										return _context.abrupt('return', false);

									case 28:
									case 'end':
										return _context.stop();
								}
							}, _callee, undefined, [[3, 24]]);
						}));
						return function (_x3) {
							return _ref2.apply(this, arguments);
						};
					})()));

				case 1:
				case 'end':
					return _context2.stop();
			}
		}, _callee2, undefined);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

/**
 * Checks if a collection exists on postman
 *
 * @param {String} name The collection name
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const exists = (() => {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(name) {
		var results, filerCollection;
		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) switch (_context3.prev = _context3.next) {
				case 0:
					_context3.prev = 0;
					_context3.next = 3;
					return _postmanSdk.Environments.get();

				case 3:
					results = _context3.sent;

					if (!results.environment) {
						_context3.next = 7;
						break;
					}

					filerCollection = results.environment.filter(function (environment) {
						return environment.name === name;
					});
					return _context3.abrupt('return', filerCollection.length > 0 ? filerCollection[0] : false);

				case 7:
					return _context3.abrupt('return', false);

				case 10:
					_context3.prev = 10;
					_context3.t0 = _context3['catch'](0);

					console.error(`Error while trying to check if the environment "${name}" exists: ${_context3.t0.message}`);
					return _context3.abrupt('return', false);

				case 14:
				case 'end':
					return _context3.stop();
			}
		}, _callee3, undefined, [[0, 10]]);
	}));

	return function exists(_x4) {
		return _ref3.apply(this, arguments);
	};
})();

exports.default = save;