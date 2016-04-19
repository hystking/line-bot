const actionTypes = require("../action-types")
const brainstormingTalk = require("./brainstorming-talk")
const randomTalk = require("./random-talk")
const talkTypes = require("../talk-types")

function talk(state, action) {
  console.log(talkTypes)
  state = state || {messages: [], type: talkTypes.RANDOM}
  switch(action.type) {
    case actionTypes.CLEAR_ALL_MESSAGES:
      return Object.assign({}, state, {
        messages: [],
      })
    case actionTypes.RECEIVE_MESSAGE:
      switch(state.type) {
        case talkTypes.RANDOM:
          return Object.assign({}, state, {
            typeStates: 
          })
        case talkTypes.BRAIN_STORMING:
          return brainstormingTalk(state, action)
        default:
          return state
      }
    default:
      return state
  }
}

module.exports = talk
