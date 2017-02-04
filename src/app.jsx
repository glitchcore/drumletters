import React from 'react';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

import { createStore, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";
import configureStore from './store';

class Page extends React.Component {
  render() {
    return (
      <div>
        ПРИВЕТ
      </div>
    )
  }
}

const store = configureStore();

function state2Page (state) {
  return {
    state
  }
}

function dispatch2Props(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  }
}


export default class App extends React.Component {
  render() {
    //
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={
            connect(state2Page, dispatch2Props)(Page)
          }>
            
          </Route>
        </Router>
      </Provider>
    )
  }
}
