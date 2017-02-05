import { createStore, applyMiddleware } from 'redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";

import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("store");
log.setLevel(Logger.DEBUG);

export const Letters = [
  {letter:"A", taps: [true, false, false, false]},
  {letter:"B", taps: [false, true, false, false]},
  {letter:"C", taps: [false, false, true, false]},
  {letter:"D", taps: [false, false, false, true]},
  {letter:"E", taps: [true, true, false, false]},
  {letter:"F", taps: [false, true, true, false]},
  {letter:"G", taps: [false, false, true, true]},
  {letter:"H", taps: [true, false, false, true]},
  {letter:"I", taps: [true, false, true, false]},
  {letter:"J", taps: [false, true, false, true]},
  {letter:"K", taps: [true, true, true, false]},
  {letter:"L", taps: [false, true, true, true]},
  {letter:"M", taps: [true, false, true, true]},
  {letter:"N", taps: [true, true, false, true]},
  {letter:"O", taps: [true, true, true, true]},
  {letter:"P", taps: [false, false, false, false]}
];

export const LetterSize = 16;
export const QueueSize = 4;

export const FlashTimeout = 0.05;

var initLetters = [];
for(let i = 0; i < 4; i++) {
  initLetters.push(i);
}

var initQueue = [];
for(let i = 0; i < QueueSize; i++) {
  initQueue.push(null);
}

const initialState = {
  tempo: 96,
  beats: 4, // 4, 8, 16, "helper"
  isPlaying: false,
  sequencerSize: 4, // 1..9
  sequencerMode: "direct", // direct, reverse, random
  selectedLetters: initLetters,
  lettersQueue: initQueue,
  tick: false
};

function getRandomInt(max) {
  return Math.floor(Math.random() * (max));
}

function pushLetter(state) {
  var letter = null;
  let _queue = state.lettersQueue.slice();

  switch(state.sequencerMode) {
    case "direct":
    case "reverse":

      let last = _queue[_queue.length - 1];
      let lastIdx = state.selectedLetters.indexOf(last);
      
      if(lastIdx == -1) {
        log.error("queue unconsistent");
        lastIdx = 0;
      } else if(state.sequencerMode == "direct") {
        lastIdx += 1;
        if(lastIdx > (state.selectedLetters.length - 1)) {
          lastIdx = 0;
        }
      } else {
        lastIdx -= 1;
        if(lastIdx < 0) {
          lastIdx = state.selectedLetters.length - 1;
        }
      }

      letter = state.selectedLetters[lastIdx];

    break;
    case "random":
      letter = state.selectedLetters[
        getRandomInt(state.selectedLetters.length)
      ];
    break;

    default:
      letter = 0;
  }

  
  _queue.splice(0,1);
  _queue.push(letter);
  log.debug(_queue);
  return _queue;
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.TEST:
      log.info("[rx] test", action.payload);
      return {...state
      };

    case actionsType.SET_TEMPO:
      log.info("new tempo:", action.payload);
      return {...state,
        tempo: action.payload
      };

    case actionsType.SET_BEATS:
      log.info("new beats:", action.payload);
      return {...state,
        beats: action.payload
      };

    case actionsType.SET_SEQUENCER_SIZE:
      log.info("new size:", action.payload);
      return {...state,
        sequencerSize: action.payload
      };

    case actionsType.SET_SEQUENCER_MODE:
      log.info("new mode:", action.payload);
      return {...state,
        sequencerMode: action.payload
      };

    case actionsType.SELECT_LETTER:
      log.info("letter:", action.payload);
      let value = action.payload.value;
      let idx = action.payload.idx;

      let _selectedLetters = state.selectedLetters.slice();

      if(value) {
        _selectedLetters.push(idx);
      } else {
        let idxOfIdx = _selectedLetters.indexOf(idx);
        if(idxOfIdx > -1) {
          _selectedLetters.splice(idxOfIdx, 1);
        }
      }
      _selectedLetters.sort((a,b) => (a-b));

      log.info("new letters:", _selectedLetters);

      return {...state,
        selectedLetters: _selectedLetters
      };

    case actionsType.PLAY_PAUSE:
      if(state.isPlaying) {
        log.info("paused");
        return {...state,
          isPlaying: false,
          tick: false
        };
      } else {
        log.info("started");
        return {...state,
          isPlaying: true
        };
      }

    
    case actionsType.SET_TICK:
      // log.debug("tick", action.payload);
      var newLetter = null;
      if(action.payload) {
        return {...state,
          tick: action.payload,
          lettersQueue: pushLetter(state)
        };
      } else {
        return {...state,
          tick: action.payload
        };
      }

    default:
      return state;
  }
}

export function configureStore(initialState) {
  log.info("configureStore");
  const store = createStore(
    rootReducer,
    initialState
  );
  return store;
}
