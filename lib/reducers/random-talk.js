const moment = require("moment")
const choice = require("../choice")
const createRequestData = require("../create-request-data")
const talkTypes = require("../talk-types")
const initialStates = require("../initial-states")

function randomTalk(state, action) {
  const from = action.from
  const text = action.text

  if(/ブレスト/.test(text)) {
    return Object.assign({}, state, initialStates.talksBrainstorming(), {
      type: talkTypes.BRAIN_STORMING,
      messages: state.messages.concat([{
        requestData: createRequestData("ブレストしましょう", [from]),
        next: {
          delay: 500,
          requestData: createRequestData("キーワードは何にしますか？\n『終わり』で入力終了します", [from]),
        },
      }]),
    })
  }

  const splittedText = text.split(" ")
  const date = moment(splittedText.slice(0, -1).join(" "))
  if(date.isValid()) {
    const message = splittedText[splittedText.length - 1]
    return Object.assign({}, state, {
      messages: state.messages.concat([{
        requestData: createRequestData(`${date.format("YYYY/MM/DD HH:mm:ss")}\nになったら声かけますね`, [from]),
        next: {
          requestData: createRequestData(message, [from]),
          delay: date.toDate(),
        },

      }]),
    })
  }

  return Object.assign({}, state, {
    messages: state.messages.concat([{
      requestData: createRequestData(choice(["やばい", "わろた"], action.random), [from]),
    }]),
  })
}

module.exports = randomTalk
