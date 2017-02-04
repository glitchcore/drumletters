import React from 'react';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

import { createStore, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";
import configureStore from './store';
import * as BS from 'react-bootstrap';

class Page extends React.Component {
  render() {
    return (
      <div className="drumletters-wrapper">
        <div className="drumletters-title">
          Benny Greb letters for drummers
        </div>
        <BS.Row className="drumletters-main">
          <BS.Col md={10} className="drumletters-letters">
            Буквы
          </BS.Col>
          <BS.Col md={2} className="drumletters-selectors">
            Чекбоксы
          </BS.Col>
        </BS.Row>
        <BS.Row className="drumletters-footer">
          <BS.Col md={7} className="drumletters-metro">
            Метроном
          </BS.Col>
          <BS.Col md={5} className="drumletters-sequencer">
            Секвенсер
          </BS.Col>
        </BS.Row>
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
