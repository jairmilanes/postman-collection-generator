'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _postmanSdk = require('postman-sdk');

var _buildCollection = require('./lib/build-collection');

var _buildCollection2 = _interopRequireDefault(_buildCollection);

var _buildEnvironment = require('./lib/build-environment');

var _buildEnvironment2 = _interopRequireDefault(_buildEnvironment);

var _save = require('./lib/save');

var _save2 = _interopRequireDefault(_save);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { collection } = _postmanSdk.Builder;

/**
 * Builds a postman collection
 *
 * @param {Object} app The models object
 * @param {Object} config The config object
 * @returns {Object} The collection file
 */
const collectionGenerator = (app, config) => {
	const router = _express2.default.Router();

	router.route('/generate-collection').get((() => {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
			var newCollection, newEnvironments;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return (0, _buildCollection2.default)(collection(meta.name, meta.version), app._router, config);

					case 2:
						newCollection = _context.sent;
						newEnvironments = (0, _buildEnvironment2.default)(newCollection.collection, config.environments);
						_context.t0 = res;
						_context.next = 7;
						return (0, _save2.default)(req.query.postman || '', newCollection, newEnvironments);

					case 7:
						_context.t1 = _context.sent;
						return _context.abrupt('return', _context.t0.json.call(_context.t0, _context.t1));

					case 9:
					case 'end':
						return _context.stop();
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2, _x3) {
			return _ref.apply(this, arguments);
		};
	})());

	return router;
};

/**
 * Response helper
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {function} next The callback function
 * @returns {undefined} Nothing
 */
const error = (req, res, next) => {
	req.fulfilled = true;
	res.data = {
		message: 'The postman collection generator is disabled!'
	};
	return next();
};

exports.default = collectionGenerator;