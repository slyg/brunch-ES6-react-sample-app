var SearchConstants = require('../constants/SearchConstants'),
    AppDispatcher   = require('../dispatcher/AppDispatcher'),
    SearchService   = require('../services/SearchService');

// Do not query too much backend
const THROTTLE_DELAY = 500;
var debouncedReposQuery = _.debounce(SearchService.reposQuery, THROTTLE_DELAY);

var SearchActions = {

  query : (text) => {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_BEGIN,
      text: text
    });

    debouncedReposQuery(text);

  },

  receiveResults : (results) => {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_SUCCESS,
      results: results
    });

  },

  receiveError : (error) => {

    AppDispatcher.dispatch({
      actionType: SearchConstants.SEARCH_FAILURE,
      error: error
    });

  },

};

module.exports = SearchActions;
