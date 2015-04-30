const USER_URL = (user) => `https://api.github.com/users/${user}/repos`;

module.exports = {

  reposQuery: (text) => {

    // circular dependencies not handled by brunch.io :-|
    let SearchActions = require('../actions/SearchActions');

    $.get(USER_URL(text))

      .done(SearchActions.receiveResults)

      .fail((err) => {

        if (err.status === 404) {
          return SearchActions.receiveResults([]);
        }

        SearchActions.receiveError(err);

      })

    ;

  }

};
