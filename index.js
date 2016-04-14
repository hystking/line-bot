const moment = require("moment")
const express = require('express')
const bodyParser = require('body-parser')
const kue = require("kue")
const createRequestData = require("./lib/create-request-data")
const say = require("./lib/say")

const PORT = 8080
const PATTERNS = ["やばい", "わろた"]

const queue = kue.createQueue({
  redis: require("./config/redis")
})

queue.process("say", function(job, ctx, done) {
  console.log("processed say")
  say(job.data.requestData)
  done()
})

const app = express()

app.use(bodyParser.json())
app.post('/', function (req, res) {
  console.log("received message")
  req.body.result.forEach(function(res) {
    resTextArguments = res.content.text.split(" ")
    const from = res.content.from
    const date = moment(resTextArguments.slice(0, -1).join(" "))
    const message = resTextArguments[resTextArguments.length - 1]

    if(!date.isValid()) {
      queue.create("say", {
        requestData: createRequestData(PATTERNS[Math.random() * PATTERNS.length | 0], [from]),
      }).save()
      return
    }

    queue.create("say", {
      requestData: createRequestData(`${date.format("YYYY/MM/DD HH:mm:ss")}\nになったら声かけますね`, [from]),
    }).save()

    queue.create("say", {
      requestData: createRequestData(message, [from]),
    }).delay(date.toDate()).save()
  })

  res.send(':)')
})
app.listen(PORT, function () {
  console.log(`start listening on port ${PORT}`)
})
