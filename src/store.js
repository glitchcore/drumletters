import { createStore, applyMiddleware } from 'redux';
import * as actions from './actions';
import * as actionsType from "./actions_type";

import * as Log from './log';
import Logger from 'js-logger';
var log = Log.get("store");
log.setLevel(Logger.DEBUG);

const initialState = {

};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.TEST:
      console.log("[rx] test", action.payload);
      return {...state
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
