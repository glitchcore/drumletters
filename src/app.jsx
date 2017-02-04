import React from 'react';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

import { createStore, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";
import configureStore from './store';
import * as BS from 'react-bootstrap';
import {Checkbox} from 'react-icheck';

const ColSize = 12;

class Tap extends React.Component {
  render() {
    let icon = this.props.value
      ? "\u25CF"
      : "\u25CB";
    let suffix = (this.props.active ? "active" : "inactive");

    return <div className={"drumletters-tap drumletters-bigletter-"+suffix}> {icon} </div>
  }
}

class Letter extends React.Component {
  render() {
    let taps = [true,true,false,true];
    let tapsElements = taps.map(
      (tap, idx) => <BS.Col key={idx} md={Math.floor(ColSize/taps.length)}>
        <Tap value={tap} active={this.props.active}/>
      </BS.Col>
    );
    let suffix = (this.props.active ? "active" : "inactive");
    return <div className="drumletters-letter-container">
      <BS.Row className={"drumletters-bigletter drumletters-bigletter-" + suffix}> {this.props.value} </BS.Row>
      <BS.Row className={"drumletters-taps"}>{tapsElements}</BS.Row>
    </div>;
  }
}


class Page extends React.Component {
  render() {
    let letters = ["A","B","C","D"];
    let lettersElements = letters.map(
      (letter, idx) => <BS.Col key={idx} md={Math.floor(ColSize/letters.length)}>
        <Letter value={letter} active={idx == 1}/>
      </BS.Col>
    );

    let selectors = [];
    for(let i = 65; i <= 80; i++) {
      selectors.push(String.fromCharCode(i));
    }

    let selectorElements = selectors.map(
      (selector,idx) => <div key={idx} className="drumletters-selector-checkbox">
        <Checkbox
        checkboxClass="icheckbox_flat-blue"
        increaseArea="20%"
        defaultChecked={true}
        />
        <span className="drumletters-selectors-checkbox-text"> {selector}</span>
      </div>
    );

    let metroTempo = <div>
      <BS.Col md={2} className="">
        <BS.FormGroup>
          <BS.InputGroup>
            <BS.InputGroup.Button>
              <BS.Button><BS.Glyphicon glyph="arrow-left"/></BS.Button>
            </BS.InputGroup.Button>
            <BS.FormControl type="text" defaultValue="120"/>
            <BS.InputGroup.Button> 
              <BS.Button><BS.Glyphicon glyph="ok"/></BS.Button>
            </BS.InputGroup.Button>
            <BS.InputGroup.Button>
              <BS.Button><BS.Glyphicon glyph="arrow-right"/></BS.Button>
            </BS.InputGroup.Button>
          </BS.InputGroup>
        </BS.FormGroup>
      </BS.Col>
    </div>;

    let metroBeats = <div>
      <BS.Col md={2} className="">
        <BS.ButtonGroup>
          <BS.Button> 4</BS.Button>
          <BS.Button> 8</BS.Button>
          <BS.Button>16</BS.Button>
          <BS.Button><img src="images/magic.png" width="18px" /></BS.Button>
        </BS.ButtonGroup>
      </BS.Col>
    </div>;

    let sequencer = <div>Секвенсер</div>;

    return (
      <div className="drumletters-wrapper">
        <div className="drumletters-title">
          Benny Greb letters for drummers
        </div>
        <BS.Row className="drumletters-main">
          <BS.Col md={11} className="drumletters-letters-container">
            <div className="drumletters-letters">
              {lettersElements}
            </div>
          </BS.Col>
          <BS.Col md={1} className="drumletters-selectors-container">
            {selectorElements}
          </BS.Col>
        </BS.Row>
        <BS.Row className="drumletters-footer">
          {metroTempo}{metroBeats}
          <BS.Col md={4} className="drumletters-metro">
            <div className="drumletters-play">
              <BS.Glyphicon glyph="play-circle"/>
            </div>
          </BS.Col>
          <BS.Col md={4} className="drumletters-sequencer">
            {sequencer}
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
