'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _main = require('main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.1').command('rmdir <dir> [otherDirs...]').action(function (dir, otherDirs) {
  console.log('rmdir %s', dir);
  if (otherDirs) {
    otherDirs.forEach(function (oDir) {
      console.log('rmdir %s', oDir);
    });
  }
});

_commander2.default.parse(process.argv);