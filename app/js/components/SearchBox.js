class SearchBox extends React.Component {

  render () {
    /* jshint ignore:start */
    return <input
        type="text"
        ref="searchInput"
        placeholder="Type user pseudo"
        onChange={this.props.onChange}
      />;
    /* jshint ignore:end */
  }
}

module.exports = SearchBox;
