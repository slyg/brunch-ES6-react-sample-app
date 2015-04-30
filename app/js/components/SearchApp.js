var SearchBox     = require('./SearchBox'),
    SearchResults = require('./SearchResults'),
    SearchStore   = require('../stores/SearchStore'),
    SearchActions = require('../actions/SearchActions');

class App extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      results: SearchStore.getResults()
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount () {
    SearchStore.addChangeListener(this._onChange);
  }

  componentWillUnmount () {
    SearchStore.removeChangeListener(this._onChange);
  }

  _onChange () {
    this.setState({
      results: SearchStore.getResults()
    });
  }

  _onInput (event) {
    SearchActions.query(event.target.value);
  }

  render(){

  /* jshint ignore:start */
    return (
      <div className="layout">
        <div className="sidebar">
          <form className="pure-form l-box">
            <SearchBox onChange={this._onInput} />
          </form>
        </div>
        <SearchResults results={this.state.results} />
      </div>
    );
  /* jshint ignore:end */

  }

}

module.exports = App;
