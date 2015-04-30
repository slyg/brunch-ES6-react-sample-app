var AppDispatcher   = require('../dispatcher/AppDispatcher'),
    SearchConstants = require('../constants/SearchConstants');

class Store extends EventEmitter2 {

  constructor (...args) {
    super(...args);
    this.results = {};
  }

  emitChange () {
    this.emit('change');
  }

  reset () {
    this.results = {};
    return this;
  }

  createResult (item) {
    let id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    this.results[id] = item;
  }

  getResults () {
    return this.results;
  }

  setResults (list) {
    this.reset();
    _.each(list, (item) => {
      this.createResult(item);
    });
    return this;
  }

  addChangeListener (callback) {
    this.on('change', callback);
  }

  removeChangeListener (callback) {
    this.removeListener('change', callback);
  }

}

var SearchStore = new Store();

AppDispatcher.register((action) => {

  let text;

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
