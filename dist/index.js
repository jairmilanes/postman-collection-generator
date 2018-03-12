'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _builder = require('./lib/builder');

var _builder2 = _interopRequireDefault(_builder);

var _fp = require('lodash/fp');

var _postmanSdk = require('postman-sdk');

var _environment = require('./lib/environment');

var _environment2 = _interopRequireDefault(_environment);

var _collection = require('./lib/collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { collection } = _postmanSdk.Builder;

/**
 * Builds a postman collection
 *
 * @param {Object} app The models object
 * @param {Object} config The config object
 * @returns {Object} The collection file
 */
const generateCollection = app => (config, meta = {}) => {
	const router = _express2.default.Router();
	router.route('/generate-collection').get((() => {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
			var data;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return (0, _builder2.default)(collection(meta.name, meta.version), app._router, config);

					case 2:
						data = _context.sent;

						if (req.params.postman) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return', res.json(data));

					case 5:
						if (!(req.params.postman === 'local')) {
							_context.next = 7;
							break;
						}

						return _context.abrupt('return', res.json(saveCollectionFile(data)));

					case 7:
						if (!(req.params.postman === 'cloud')) {
							_context.next = 9;
							break;
						}

						return _context.abrupt('return', res.json((0, _fp.pipe)([_collection2.default, _environment2.default])(data)));

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
 * Checks the local file version to see if is different from the one in the package.json
 *
 * @param {String} current Current version
 * @returns {boolean} True if different false otherwise
 */
const checkVersion = current => {
	try {
		const postmanDir = _path2.default.join(_fs2.default.realpathSync('./'), '.postman');
		const file = _path2.default.join(postmanDir, 'collections.json');

		if (!_fs2.default.existsSync(file)) {
			return true;
		}

		const json = JSON.parse(_fs2.default.readFileSync(file));
		return json.info.version !== current;
	} catch (error) {
		console.error(`Error while trying to read from local postman file: ${error.message}`);
		return true;
	}
};

/**
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @returns {Boolean} True if all was ok
 */
const saveCollectionFile = collection => {
	_fs2.default.writeFileSync(getLocalFilePath(), (0, _stringify2.default)(collection), {
		flag: 'w+'
	});

	return collection;
};

const getLocalFilePath = () => _path2.default.join(ensureDirectoryExists(), 'collections.json');

const ensureDirectoryExists = () => {
	const postmanDir = _path2.default.join(_fs2.default.realpathSync('./'), '.postman');

	if (!_fs2.default.existsSync(postmanDir)) {
		_fs2.default.mkdirSync(postmanDir);
	}

	return postmanDir;
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

exports.default = generateCollection;