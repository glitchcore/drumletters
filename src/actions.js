import * as actionsType from "./actions_type";



/* action functions here */

export function setTempo(tempo) {
  return {
    type: actionsType.SET_TEMPO,
    payload: tempo
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

export function setSequencerMode(value) {
  return {
    type: actionsType.SET_SEQUENCER_MODE,
    payload: value
  }
}

export function selectLetter(idx, value) {
  return {
    type: actionsType.SELECT_LETTER,
    payload: {idx, value}
  }
}

export function playPause() {
  return {
    type: actionsType.PLAY_PAUSE,
    payload: null
  }
}

export function setTick(value) {
  return {
    type: actionsType.SET_TICK,
    payload: value
  }
}