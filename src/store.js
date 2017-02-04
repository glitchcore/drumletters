import { createStore, applyMiddleware } from 'redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";

import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("store");
log.setLevel(Logger.DEBUG);

const LetterSize = 16;
const QueueSize = 4;

var initLetters = [];
for(let i = 0; i < LetterSize; i++) {
  initLetters.push(i);
}

var initQueue = [];
for(let i = 0; i < QueueSize; i++) {
  initQueue.push(2);
}

const initialState = {
  tempo: 96,
  beats: 4, // 4, 8, 16
  helper: false,
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

    case actionsType.SET_HELPER:
      log.info("new helper:", action.payload);
      return {...state,
        helper: action.payload
      };

    case actionsType.SET_BEATS:
      log.info("new beats:", action.payload);
      return {...state,
        beats: action.payload
      };

    default:
      return state;
  }
}

export default function configureStore(initialState) {
  log.info("configureStore");
  const store = createStore(
    rootReducer,
    initialState
  );
  return store;
}
