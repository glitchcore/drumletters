import React from 'react';
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';
import { findDOMNode } from 'react-dom';

import { createStore, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";
import configureStore from './store';
import * as BS from 'react-bootstrap';
import {Checkbox} from 'react-icheck';


import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("app");
log.setLevel(Logger.DEBUG);

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

class MetroTempo extends React.Component {
  commitChange() {
    let value = parseInt(findDOMNode(this.refs.tempo).value);
    log.debug("commitChange", value);
    if(value > 250) {
      this.props.onChange(250);
    } else if (value < 30) {
      this.props.onChange(30);
    } else {
      this.props.onChange(value);
    }
  }

  increaseTempo() {
    let value = this.props.value;
    if(this.props.value < 250) {
      this.props.onChange(value + 5);
    }
  }

  decreaseTempo() {
    let value = this.props.value;
    if(value > 30) {
      this.props.onChange(value - 5);
    }
  }

  render() {
    return <div  className="drumletters-footer-panel">
      <BS.FormGroup>
        <BS.InputGroup>
          <BS.InputGroup.Button>
            <BS.Button onClick={::this.decreaseTempo}><BS.Glyphicon glyph="chevron-left"/></BS.Button>
          </BS.InputGroup.Button>
          <div key={this.props.value}>
            <BS.FormControl
              type="text"
              defaultValue={this.props.value}
              ref="tempo"
            />
          </div>
          <BS.InputGroup.Button> 
            <BS.Button onClick={::this.commitChange}>
              <BS.Glyphicon glyph="ok"/>
            </BS.Button>
          </BS.InputGroup.Button>
          <BS.InputGroup.Button>
            <BS.Button onClick={::this.increaseTempo}><BS.Glyphicon glyph="chevron-right"/></BS.Button>
          </BS.InputGroup.Button>
        </BS.InputGroup>
      </BS.FormGroup>
    </div>;
  }
}

class MetroBeats extends React.Component {
  changeHandler(value) {
    this.props.actions.setBeats(value);
  }

  render() {
    // log.debug("metroBeats:", this.props.value);

    return <BS.ButtonGroup>
      <BS.Button
        bsStyle={this.props.value == 4 ? "danger" : "default"}
        onClick={() => ::this.changeHandler(4)}
      > 4 </BS.Button>
      <BS.Button
        bsStyle={this.props.value == 8 ? "danger" : "default"}
        onClick={() => ::this.changeHandler(8)}
      > 8 </BS.Button>
      <BS.Button
        bsStyle={this.props.value == 16 ? "danger" : "default"}
        onClick={() => ::this.changeHandler(16)}
      > 16 </BS.Button>
      <BS.Button
        bsStyle={this.props.value == "helper" ? "danger" : "default"}
        onClick={() => ::this.changeHandler("helper")}
      >
        <img src="images/magic.png" width="18px" />
      </BS.Button>
    </BS.ButtonGroup>;
  }
}

class SequencerSize extends React.Component {

  increaseTempo() {
    let value = this.props.value;
    if(this.props.value < 9) {
      this.props.onChange(value + 1);
    }
  }

  decreaseTempo() {
    let value = this.props.value;
    if(value > 1) {
      this.props.onChange(value - 1);
    }
  }

  render() {
    return <BS.FormGroup>
      <BS.InputGroup>
        <BS.InputGroup.Button>
          <BS.Button onClick={::this.decreaseTempo}><BS.Glyphicon glyph="chevron-left"/></BS.Button>
        </BS.InputGroup.Button>
        <BS.FormControl type="text" value={this.props.value}/>
        <BS.InputGroup.Button>
          <BS.Button onClick={::this.increaseTempo}><BS.Glyphicon glyph="chevron-right"/></BS.Button>
        </BS.InputGroup.Button>
      </BS.InputGroup>
    </BS.FormGroup>;
  }
}

class SequencerMode extends React.Component {
  changeHandler(value) {
    this.props.actions.setSequencerMode(value);
  }

  render() {
    return <BS.ButtonGroup>
      <BS.Button
        bsStyle={this.props.value == "reverse" ? "danger" : "default"}
        onClick={() => ::this.changeHandler("reverse")}
      >
        <BS.Glyphicon glyph="arrow-left"/>
      </BS.Button>
      <BS.Button
        bsStyle={this.props.value == "random" ? "danger" : "default"}
        onClick={() => ::this.changeHandler("random")}
      >
        <BS.Glyphicon glyph="random"/>
      </BS.Button>
      <BS.Button
        bsStyle={this.props.value == "direct" ? "danger" : "default"}
        onClick={() => ::this.changeHandler("direct")}
      >
        <BS.Glyphicon glyph="arrow-right"/>
      </BS.Button>
    </BS.ButtonGroup>;
  }
}

import * as Store from './store';

class Selectors extends React.Component {
  clickHandler(idx, event) {
    let value = event.target.checked;
    log.debug(idx, "checkbox", value);
    this.props.actions.selectLetter(idx, value);
  }

  render() {
    let selectors = [];
    //log.debug("LetterSize", Store.LetterSize);
    for(let i = 0; i < Store.LetterSize; i++) {
      selectors.push(String.fromCharCode(i + "A".charCodeAt()));
    }

    let selectorElements = selectors.map(
      (selector,idx) => <div key={idx} className="drumletters-selector-checkbox">
        <Checkbox
          checkboxClass="icheckbox_flat-blue"
          increaseArea="20%"
          defaultChecked={this.props.letters.indexOf(idx) > -1}
          onChange={(event) => ::this.clickHandler(idx, event)}
        />
        <span className="drumletters-selectors-checkbox-text"> {selector}</span>
      </div>
    );

    return <div>{selectorElements}</div>;
  }
}
class Page extends React.Component {
  changeHandler() {
    log.debug("changeHandler");
  }

  render() {
    let letters = ["A","B","C","D"];
    let lettersElements = letters.map(
      (letter, idx) => <BS.Col key={idx} md={Math.floor(ColSize/letters.length)}>
        <Letter value={letter} active={idx == 1}/>
      </BS.Col>
    );

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
            <Selectors actions={this.props.actions} letters={this.props.state.selectedLetters}/>
          </BS.Col>
        </BS.Row>
        <BS.Row className="drumletters-footer">
          <BS.Col mdOffset={1} md={2} className="">
            <MetroTempo value={this.props.state.tempo} onChange={this.props.actions.setTempo}/>
          </BS.Col>
          <BS.Col md={2} className="">
            <MetroBeats value={this.props.state.beats} actions={this.props.actions}/>
          </BS.Col>
          <BS.Col md={2} className="drumletters-metro">
            <div className="drumletters-play">
              <BS.Glyphicon glyph="play-circle"/>
            </div>
          </BS.Col>
          <BS.Col mdOffset={1} md={2} className="drumletters-sequencer-size">
            <SequencerSize
              onChange={this.props.actions.setSequencerSize}
              value={this.props.state.sequencerSize}
            />
          </BS.Col>
          <BS.Col md={2} className="drumletters-sequencer">
            <SequencerMode value={this.props.state.sequencerMode} actions={this.props.actions}/>
          </BS.Col>
        </BS.Row>
      </div>
    )
  }
}

const store = Store.configureStore();

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
