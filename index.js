const express = require('express')
const app = express()
const lineApiCredential = require("./line-api-credential")
const bodyParser = require('body-parser')
const https = require("https")
const messages = [
  "やばい",
  "わろた",
]

const PORT = 8080

const contentTemplate = {
  contentType: 1,
  toType: 1,
}

const dataTemplate = {
  toChannel: 1383378250,
  eventType: "138311608800106203",
}

const requestOptions = {
  method: 'POST',
  host: "trialbot-api.line.me",
  path: "/v1/events",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    "X-Line-ChannelID": lineApiCredential.channelId,
    "X-Line-ChannelSecret": lineApiCredential.channelSecret,
    "X-Line-Trusted-User-With-ACL":lineApiCredential.mid, 
  },
}

function say(text, to) {
  const data = Object.assign({}, dataTemplate, {
    to: to,
    content: Object.assign({}, contentTemplate, {
      text: text,
    }),
  })
  console.log(data)
  const req = https.request(requestOptions, function(res) {
    res.on("data", function(chunk) {
      console.log(chunk.toString())
    })
  })
  req.write(JSON.stringify(data))
  req.end()
}

app.use(bodyParser.json())

app.post('/', function (req, res) {
  console.log("received")
  req.body.result.forEach(function(res) {
    console.log(res)
    say(messages[Math.random() * messages.length | 0], [res.content.from])
  })
  res.send(':)')
})

app.listen(PORT, function () {
  console.log('Example app listening on port 8080')
})
