'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  const localPath = _path2.default.join(_fs2.default.realpathSync('./'), !directory ? '.postman' : directory);

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
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @param {object} config The config object
 * @returns {Boolean} True if all was ok
 */

exports.default = (collection, config = {}) => (0, _pipe2.default)([ensureDirectoryExists, getLocalFilePath, saveToFile(collection)])(config.directory);