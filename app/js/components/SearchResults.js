class SearchResults extends React.Component {

  render () {

    // Do not render if no results
    if (Object.keys(this.props.results).length < 1) {
      return null;
    }

    var items = _.map(this.props.results, function(result) {

      /* jshint ignore:start */
      return (
        <li className="pure-menu-item" key={result.id}>
          <a href={result.html_url} className="pure-menu-link pure-g">
            <span className="pure-u-1-4 emphasise">{result.name}</span>
            <span className="pure-u-3-4">{result.description}</span>
          </a>
        </li>
      );
      /* jshint ignore:end */
    });

    /* jshint ignore:start */
    return (
      <ul className="pure-menu-list">{items}</ul>
    );
    /* jshint ignore:end */
  }
}

module.exports = SearchResults;
