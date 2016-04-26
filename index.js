const _ = require("lodash")
const express = require('express')
const bodyParser = require('body-parser')
const kue = require("kue")
const redux = require("redux")
const actionTypes = require("./lib/action-types")
const combineReducers = redux.combineReducers
const createStore = redux.createStore
const createRequestData = require("./lib/create-request-data")
const say = require("./lib/say")
const dialogue = require("./lib/dialogue")
const daponify = require("./lib/daponify")

const PORT = 8080

const queue = kue.createQueue({
  redis: require("./config/redis")
})

queue.process("say", function(job, ctx, done) {
  console.log("processed say")
  say(job.data.requestData, function(){
    if(job.data.next) {
      queueMessage(job.data.next)
    }
    done()
  })
})

queue.process("dialogue", function(job, ctx, done) {
  console.log("processed dialogue")
  dialogue(job.data.requestData, function(res){
    daponify(res.utt, function(text) {
      queueMessage({
        requestData: createRequestData(text, job.data.to),
      })
      done()
    })
  })
})

const app = express()
const store = createStore(
  combineReducers({
    talks: require("./lib/reducers/talks")
  })
)

function queueMessage(message) {
  const q = queue.create("say", message)
  if(message.delay) {
    q.delay(message.delay)
  }
  q.save()
}

function queueDialogue(message) {
  const q = queue.create("dialogue", message)
  q.save()
}

function processMessages(){
  console.log("proceeess message")
  const state = store.getState()
  const messages = _.flatten(_.map(state.talks, function(talk){
    return talk.messages
  }))
  if(messages.length === 0) {
    return
  }
  messages.forEach(queueMessage)
  store.dispatch({
    type: actionTypes.CLEAR_ALL_MESSAGES,
  })
}

function processDialogues(){
  console.log("process dialogues")
  const state = store.getState()
  const dialogues = _.flatten(_.map(state.talks, function(talk){
    return talk.dialogues
  }))
  if(dialogues.length === 0) {
    return
  }
  dialogues.forEach(queueDialogue)
  store.dispatch({
    type: actionTypes.CLEAR_ALL_DIALOGUES,
  })
}

store.subscribe(processMessages)
store.subscribe(processDialogues)

app.use(bodyParser.json())
app.post('/', function (req, res) {
  console.log("received message")
  req.body.result.forEach(function(res) {
    store.dispatch({
      type: actionTypes.RECEIVE_MESSAGE,
      from: res.content.from,
      text: res.content.text,
      random: Math.random(),
    })
  })
  res.send(':)')
})
app.listen(PORT, function () {
  console.log(`start listening on port ${PORT}`)
})
