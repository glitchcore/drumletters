import * as actionsType from "./actions_type";



/* action functions here */

export function setTempo(tempo) {
  return {
    type: actionsType.SET_TEMPO,
    payload: tempo
  }
}

export function setHelper(value) {
  return {
    type: actionsType.SET_HELPER,
    payload: value
  }
}

export function setBeats(value) {
  return {
    type: actionsType.SET_BEATS,
    payload: value
  }
}

export function setSequencerSize(value) {
  return {
    type: actionsType.SET_SEQUENCER_SIZE,
    payload: value
  }
}