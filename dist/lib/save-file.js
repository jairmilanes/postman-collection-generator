'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./../helper/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPostmanDir = (directory = null) => _path2.default.join(_fs2.default.realpathSync('./'), !directory ? '.postman' : directory);

/**
 * Checks the local file version to see if is different from the one in the package.json
 *
 * @param {String} current Current version
 * @returns {boolean} True if different false otherwise
 */
const checkVersion = (directory = null) => {
	try {
		const packageJson = JSON.parse(_fs2.default.readFileSync(_path2.default.join(_fs2.default.realpathSync('./'), './package.json')));

		if (!packageJson) {
			return directory || '.postman';
		}

		return _path2.default.join(directory || '.postman', packageJson.version);
	} catch (error) {
		console.error(`Error while trying to read from local postman file: ${error.message}`);
		return directory || '.postman';
	}
};

/**
 *
 * @param {string} directory The directory where to save the collection file
 * @returns {string} The directory plus filename
 */
const getLocalFilePath = directory => _path2.default.join(directory, 'collection.json');

/**
 * Ensures the cirectory where to save the file exists
 *
 * @param {string} directory The directory where to save the collection file
 * @returns {*} The
 */
const ensureDirectoryExists = (directory = null) => {
	const localPath = getPostmanDir(directory);

	if (!_fs2.default.existsSync(localPath)) {
		_fs2.default.mkdirSync(localPath);
	}

	return localPath;
};

/**
 * saveToFile constructor
 *
 * @param {object} collection The collection object
 * @returns {function(filename:string): void} Undefined
 */
const saveToFile = collection =>
/**
 * Saves the collection to a file given it's filename
 *
 * @param filename
 */
filename => _fs2.default.writeFileSync(filename, (0, _stringify2.default)(collection), {
	flag: 'w+'
});

/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const finalize = results => _promise2.default.resolve({
	message: 'File created!',
	results
});

/**
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @param {object} config The config object
 * @returns {Boolean} True if all was ok
 */

exports.default = (collection, config = {}) => (0, _util.pipe)(checkVersion, ensureDirectoryExists, getLocalFilePath, saveToFile(collection), finalize)(config.directory);