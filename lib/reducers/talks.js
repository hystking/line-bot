const _ = require("lodash")
const actionTypes = require("../action-types")
const talk = require("./talk")

function talks(state, action) {
  state = state || {}
  switch(action.type) {
    case actionTypes.CLEAR_ALL_MESSAGES:
      return _.mapValues(state, function(_talk){
        return talk(_talk, action)
      })
    case actionTypes.RECEIVE_MESSAGE:
      const _talk = state[action.from]
      const ret = Object.assign({}, state)
      ret[action.from] = talk(_talk, action)
      return ret
    default:
      return state
  }
}

module.exports = talks
