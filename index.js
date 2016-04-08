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

function say(text, to, toChannel, eventType) {
  const data = JSON.stringify({
    to: to,
    content: {
      text: text,
      contentType: 1,
      toType: 1,
    },
    toChannel: 1383378250,
    eventType: "138311608800106203",
  })
  const opts = {
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
  console.log(data)
  console.log(opts)
  const req = https.request(opts, function(res) {
    res.on("data", function(chunk) {
      console.log(chunk.toString())
    })
  })
  req.write(data)
  req.end()
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/', function (req, res) {
  console.log("post")
  console.log(req.body.result[0]);
  res.send('works!')
  req.body.result.forEach(function(res) {
    say(messages[Math.random() * messages.length | 0], [res.content.from], res.fromChannel, res.eventType)
  })
})

app.listen(PORT, function () {
  console.log('Example app listening on port 8080')
})
