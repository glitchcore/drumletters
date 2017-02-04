import * as actionsType from "./actions_type";



/* action functions here */

export function setTempo(tempo) {
  return {
    type: actionsType.SET_TEMPO,
    payload: tempo
  }
}