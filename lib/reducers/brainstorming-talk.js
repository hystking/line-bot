const createRequestData = require("../create-request-data")
const isYes = require("../is-yes")
const isNo = require("../is-no")
const choice = require("../choice")
const nextRandom = require("../next-random")
const talkTypes = require("../talk-types")
const _ = require("lodash")
const initialStates = require("../initial-states")

function getKeywordSuggestion(keywords, random1, random2) {
  const keyword = choice(keywords, random1)
  return choice([
    `${keyword}といえば？`,
    `こんな${keyword}は嫌だ。どんな${keyword}？`,
    `${keyword}と眼鏡を組み合わせたら？`,
    `${keyword}と真鯛の共通点は？`,
    `${keyword}の反対語は？`,
    `${keyword}でダジャレを言って`
  ], random2)
}

function getIdeaSuggestion(ideas, random1, random2) {
  const idea = choice(ideas, random1)
  return choice([
    `${idea}はいい切り口ですね`,
    `${idea}とかさっきでました`,
    `${idea}と組み合わせられますか？`,
    `${idea}！！`
  ], random2)
}

function brainstormingTalk(state, action) {
  const from = action.from
  const text = action.text

  if(state.brainstorminReceivingConfirmKeywords) {
    if(isYes(text)) {
      return Object.assign({}, state, {
        brainstorminReceivingConfirmKeywords: false,
        messages: state.messages.concat([{
          requestData: createRequestData("やったー", [from]),
          next: {
            delay: 500,
            requestData: createRequestData("ブレストを始めましょう", [from]),
          },
        }])
      })
    }
    if(isNo(text)) {
      return Object.assign({}, state, {
        brainstorminReceivingKeywords: true,
        brainstorminReceivingConfirmKeywords: false,
        brainstormingKeywords: [],
        messages: state.messages.concat([{
          requestData: createRequestData("は？", [from]),
          next: {
            delay: 500,
            requestData: createRequestData("じゃあもう一回言ってください", [from]),
          }
        }])
      })
    }
    return Object.assign({}, state, {
      messages: state.messages.concat([{
        requestData: createRequestData("なに言ってんだこいつ", [from]),
      }])
    })
  }

  if(state.brainstorminReceivingKeywords) {
    if(/^終わり$/.test(text)) {
      if(state.brainstormingKeywords.length === 0) {
        return Object.assign({}, state, {
          messages: state.messages.concat([{
            requestData: createRequestData("いや、キーワードないけど", [from]),
          }])
        })
      }
      return Object.assign({}, state, {
        brainstorminReceivingKeywords: false,
        brainstorminReceivingConfirmKeywords: true,
        messages: state.messages.concat([{
          requestData: createRequestData(`${state.brainstormingKeywords.map(function(k){
            return `『${k}』`}).join("と")
          }をキーワードにしますね`, [from]),
          next: {
            delay: 500,
            requestData: createRequestData("これでいいですか？", [from]),
          },
        }]),
      })
    }
    if(_.includes(state.brainstormingKeywords, text)) {
      return Object.assign({}, state, {
        messages: state.messages.concat([{
          requestData: createRequestData(`『${text}』はさっきも言いましたよ`, [from]),
        }])
      })
    }
    return Object.assign({}, state, {
      brainstormingKeywords: state.brainstormingKeywords.concat([text]),
      messages: state.messages.concat([{
        requestData: createRequestData(`『${text}』ですか`, [from]),
        next: {
          delay: 500,
          requestData: createRequestData(`いいですね`, [from]),
          next: {
            delay: 500,
            requestData: createRequestData(`他にはありますか？`, [from]),
          }
        }
      }]),
    })
  }
  if(state.brainstorminReceivingConfirmIdea) {
    if(isYes(text)) {
      return Object.assign({}, state, {
        brainstorminReceivingConfirmIdea: false,
        brainstormingIdeas: state.brainstormingIdeas.concat([state.lastIdea]),
        messages: state.messages.concat([{
          requestData: createRequestData("覚えました", [from]),
        }])
      })
    }
    return Object.assign({}, state, {
      brainstorminReceivingConfirmIdea: false,
      messages: state.messages.concat([{
        requestData: createRequestData("忘れますね", [from]),
      }])
    })
  }
  if(state.brainstorminReceivingIdea) {
    return Object.assign({}, state, {
      brainstorminReceivingIdea: false,
      brainstorminReceivingConfirmIdea: true,
      lastIdea: text,
      messages: state.messages.concat([{
        requestData: createRequestData(choice(["おお", "いいですね", "最高", "やばい", "わろた", "天才か"], action.random), [from]),
        next: {
          delay: 500,
          requestData: createRequestData(choice(["メモします？", "覚えますか？"], action.random), [from]),
        }
      }])
    })
  }
  if(state.brainstormingKeywords.length > 0) {
    if(/^やめる$/.test(action.text)) {
      return Object.assign({}, state, initialStates.talksBrainstorming(), {
        type: talkTypes.RANDOM,
        messages: [{
          requestData: createRequestData("やめますか、こんな無駄なこと", [from]),
        }],
      })
    }
    if(action.random < 0.8) {
      return Object.assign({}, state, {
        brainstorminReceivingIdea: true,
        messages: state.messages.concat([{
          requestData: createRequestData(getKeywordSuggestion(
            state.brainstormingKeywords,
            nextRandom(action.random, 1),
            nextRandom(action.random, 2)
          ), [from]),
        }])
      })
    }
    if(state.brainstormingIdeas.length > 0) {
      return Object.assign({}, state, {
        messages: state.messages.concat([{
          requestData: createRequestData(getIdeaSuggestion(
            state.brainstormingIdeas,
            nextRandom(action.random, 1),
            nextRandom(action.random, 2)
          ), [from]),
        }])
      })
    }
    return Object.assign({}, state, {
      messages: state.messages.concat([{
        requestData: createRequestData(choice(["やばい", "わろた"], action.random), [from]),
      }])
    })
  }
  return state
}

module.exports = brainstormingTalk
