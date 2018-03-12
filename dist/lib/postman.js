'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Save collection and environments to postman
 *
 * @param {object} payload The payload object
 * @param {object} config The config object
 * @returns {Promise<void>} The response object
 */
const saveToPostman = (() => {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(payload, config) {
		var response;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0:
					response = {};

					if (!process.env.POSTMAN_API_KEY) {
						_context.next = 12;
						break;
					}

					console.info('SAVING TO POSTMAN');
					_context.next = 5;
					return (0, _collection2.default)(payload);

				case 5:
					response.collection = _context.sent;

					console.info(response.environments);
					console.info('SAVING ENVIRONMENTS TO POSTMAN');
					_context.next = 10;
					return saveEnvironment(payload, config);

				case 10:
					response.environments = _context.sent;

					console.info(response.environments);

				case 12:
					return _context.abrupt('return', response);

				case 13:
				case 'end':
					return _context.stop();
			}
		}, _callee, undefined);
	}));

	return function saveToPostman(_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

exports.default = saveToPostman;