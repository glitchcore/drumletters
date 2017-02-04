import { createStore, applyMiddleware } from 'redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";

import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("store");
log.setLevel(Logger.DEBUG);

export const Letters = [
  {letter:"A", beats: [true, false, false, false]}
];

export const LetterSize = 16;
const QueueSize = 4;

var initLetters = [];
for(let i = 0; i < 4; i++) {
  initLetters.push(i);
}

var initQueue = [];
for(let i = 0; i < QueueSize; i++) {
  initQueue.push(0);
}

const initialState = {
  tempo: 96,
  beats: 4, // 4, 8, 16, "helper"
  isPlaying: false,
  sequencerSize: 4, // 1..9
  sequencerMode: "direct", // direct, reverse, random
  selectedLetters: initLetters,
  lettersQueue: initQueue
};

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

      log.info("new letters:", _selectedLetters);

      return {...state,
        selectedLetters: _selectedLetters
      };
      
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
