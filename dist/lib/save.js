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

var _saveEnvironment = require('./../lib/save-environment');

var _saveEnvironment2 = _interopRequireDefault(_saveEnvironment);

var _saveCollection = require('./../lib/save-collection');

var _saveCollection2 = _interopRequireDefault(_saveCollection);

var _saveFile = require('./../lib/save-file');

var _saveFile2 = _interopRequireDefault(_saveFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const methods = {
    environment: _saveEnvironment2.default,
    collection: _saveCollection2.default,
    file: _saveFile2.default,
    both: (() => {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(collection, environments) {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _saveCollection2.default)(collection, environments);

                    case 2:
                        _context.t0 = _context.sent;
                        _context.next = 5;
                        return (0, _saveEnvironment2.default)(collection, environments);

                    case 5:
                        _context.t1 = _context.sent;
                        return _context.abrupt('return', {
                            collection: _context.t0,
                            environment: _context.t1
                        });

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }, _callee, undefined);
        }));

        return function both(_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })(),
    '': collection => _promise2.default.resolve(collection)
};

exports.default = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(method, collection, environments) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    return _context2.abrupt('return', methods[method](collection.collection, environments));

                case 1:
                case 'end':
                    return _context2.stop();
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
    };
})();