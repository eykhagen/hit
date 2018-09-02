// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"helper/cmd.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeError = exports.checkUndefined = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks whether a value is undefined
 * @param {*} value 
 */
const checkUndefined = exports.checkUndefined = value => {
  return typeof value === 'undefined';
};

const writeError = exports.writeError = message => {
  console.log(`${_chalk2.default.red('[Error]')} ${message}`);
};
},{}],"branch/module.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBranch = createBranch;
exports.checkoutBranch = checkoutBranch;

var _cmd = require('../helper/cmd');

/**
 * Create a Branch
 * @param {string} name name of the branch
 */
async function createBranch(name) {
  // http://www.nodegit.org/api/branch/#create
  if ((0, _cmd.checkUndefined)(name)) {
    (0, _cmd.writeError)(`The branches's name must not be undefined`);
  }
}

/**
 * Checkout a branch
 * @param {*} reference Branch reference
 */
async function checkoutBranch(reference) {
  // https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
  console.log('checkout');
}
},{"../helper/cmd":"helper/cmd.js"}],"branch/commands.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBranchCommands = undefined;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _module = require('./module');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initBranchCommands = exports.initBranchCommands = () => {

  // register the hit branch command
  _commander2.default.command('branch [subcommand] [parameter]')
  // --u option is only available with hit branch <branch_name> -u command 
  .option('-u, --use', 'Create and use a branch with one command (only available with commands that create a branch)').alias('b').description('Create, use, modify and merge branches').action(async (subcommand, parameter, cmd) => {
    switch (subcommand) {
      case 'add':
        // create a branch
        const reference = await (0, _module.createBranch)(parameter);
        if (cmd.use) {
          await (0, _module.checkoutBranch)(reference);
        }
    }
  });

  _commander2.default.parse(process.argv);
};
},{"./module":"branch/module.js"}],"index.js":[function(require,module,exports) {
'use strict';

var _commands = require('./branch/commands');

(0, _commands.initBranchCommands)(); ///usr/bin/env node
},{"./branch/commands":"branch/commands.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.map