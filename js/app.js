(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("actions/SearchActions", function(exports, require, module) {
'use strict';

var SearchConstants = require('../constants/SearchConstants'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    SearchService = require('../services/SearchService');

// Do not query too much backend
var THROTTLE_DELAY = 500;
var debouncedReposQuery = _.debounce(SearchService.reposQuery, THROTTLE_DELAY);

var SearchActions = {

  query: function query(text) {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_BEGIN,
      text: text
    });

    debouncedReposQuery(text);
  },

  receiveResults: function receiveResults(results) {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_SUCCESS,
      results: results
    });
  },

  receiveError: function receiveError(error) {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_FAILURE,
      error: error
    });
  } };

module.exports = SearchActions;
});

require.register("app", function(exports, require, module) {
'use strict';

var SearchApp = require('./components/SearchApp');

React.render(
/* jshint ignore:start */
React.createElement(SearchApp, null),
/* jshint ignore:end */
document.body);
});

require.register("components/SearchApp", function(exports, require, module) {
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var SearchBox = require('./SearchBox'),
    SearchResults = require('./SearchResults'),
    SearchStore = require('../stores/SearchStore'),
    SearchActions = require('../actions/SearchActions');

var App = (function (_React$Component) {
  function App() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).apply(this, args);
    this.state = {
      results: SearchStore.getResults()
    };
    this._onChange = this._onChange.bind(this);
  }

  _inherits(App, _React$Component);

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      SearchStore.addChangeListener(this._onChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      SearchStore.removeChangeListener(this._onChange);
    }
  }, {
    key: '_onChange',
    value: function _onChange() {
      this.setState({
        results: SearchStore.getResults()
      });
    }
  }, {
    key: '_onInput',
    value: function _onInput(event) {
      SearchActions.query(event.target.value);
    }
  }, {
    key: 'render',
    value: function render() {

      /* jshint ignore:start */
      return React.createElement(
        'div',
        { className: 'layout' },
        React.createElement(
          'div',
          { className: 'sidebar' },
          React.createElement(
            'form',
            { className: 'pure-form l-box' },
            React.createElement(SearchBox, { onChange: this._onInput })
          )
        ),
        React.createElement(SearchResults, { results: this.state.results })
      );
      /* jshint ignore:end */
    }
  }]);

  return App;
})(React.Component);

module.exports = App;
});

require.register("components/SearchBox", function(exports, require, module) {
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var SearchBox = (function (_React$Component) {
  function SearchBox() {
    _classCallCheck(this, SearchBox);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(SearchBox, _React$Component);

  _createClass(SearchBox, [{
    key: "render",
    value: function render() {
      /* jshint ignore:start */
      return React.createElement("input", {
        type: "text",
        ref: "searchInput",
        placeholder: "Type user pseudo",
        onChange: this.props.onChange
      });
      /* jshint ignore:end */
    }
  }]);

  return SearchBox;
})(React.Component);

module.exports = SearchBox;
});

require.register("components/SearchResults", function(exports, require, module) {
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var SearchResults = (function (_React$Component) {
  function SearchResults() {
    _classCallCheck(this, SearchResults);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(SearchResults, _React$Component);

  _createClass(SearchResults, [{
    key: "render",
    value: function render() {

      // Do not render if no results
      if (Object.keys(this.props.results).length < 1) {
        return null;
      }

      var items = _.map(this.props.results, function (result) {

        /* jshint ignore:start */
        return React.createElement(
          "li",
          { className: "pure-menu-item", key: result.id },
          React.createElement(
            "a",
            { href: result.html_url, className: "pure-menu-link pure-g" },
            React.createElement(
              "span",
              { className: "pure-u-1-4 emphasise" },
              result.name
            ),
            React.createElement(
              "span",
              { className: "pure-u-3-4" },
              result.description
            )
          )
        );
        /* jshint ignore:end */
      });

      /* jshint ignore:start */
      return React.createElement(
        "ul",
        { className: "pure-menu-list" },
        items
      );
      /* jshint ignore:end */
    }
  }]);

  return SearchResults;
})(React.Component);

module.exports = SearchResults;
});

require.register("constants/SearchConstants", function(exports, require, module) {
"use strict";

module.exports = {
  SEARCH_BEGIN: Symbol(),
  SEARCH_SUCCESS: Symbol(),
  SEARCH_FAILURE: Symbol()
};
});

require.register("dispatcher/AppDispatcher", function(exports, require, module) {
"use strict";

module.exports = new Flux.Dispatcher();
});

require.register("services/SearchService", function(exports, require, module) {
'use strict';

var USER_URL = function USER_URL(user) {
  return 'https://api.github.com/users/' + user + '/repos';
};

module.exports = {

  reposQuery: function reposQuery(text) {

    // circular dependencies not handled by brunch.io :-|
    var SearchActions = require('../actions/SearchActions');

    $.get(USER_URL(text)).done(SearchActions.receiveResults).fail(function (err) {

      if (err.status === 404) {
        return SearchActions.receiveResults([]);
      }

      SearchActions.receiveError(err);
    });
  }

};
});

require.register("stores/SearchStore", function(exports, require, module) {
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    SearchConstants = require('../constants/SearchConstants');

var Store = (function (_EventEmitter2) {
  function Store() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, Store);

    _get(Object.getPrototypeOf(Store.prototype), 'constructor', this).apply(this, args);
    this.results = {};
  }

  _inherits(Store, _EventEmitter2);

  _createClass(Store, [{
    key: 'emitChange',
    value: function emitChange() {
      this.emit('change');
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.results = {};
      return this;
    }
  }, {
    key: 'createResult',
    value: function createResult(item) {
      var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
      this.results[id] = item;
    }
  }, {
    key: 'getResults',
    value: function getResults() {
      return this.results;
    }
  }, {
    key: 'setResults',
    value: function setResults(list) {
      var _this = this;

      this.reset();
      _.each(list, function (item) {
        _this.createResult(item);
      });
      return this;
    }
  }, {
    key: 'addChangeListener',
    value: function addChangeListener(callback) {
      this.on('change', callback);
    }
  }, {
    key: 'removeChangeListener',
    value: function removeChangeListener(callback) {
      this.removeListener('change', callback);
    }
  }]);

  return Store;
})(EventEmitter2);

var SearchStore = new Store();

AppDispatcher.register(function (action) {

  var text = undefined;

  switch (action.actionType) {

    case SearchConstants.SEARCH_SUCCESS:
      SearchStore.setResults(action.results).emitChange();
      break;

    case SearchConstants.SEARCH_FAILURE:
      SearchStore.reset().emitChange();
      break;

  }
});

module.exports = SearchStore;
});


//# sourceMappingURL=app.js.map