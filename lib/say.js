const https = require("https")
const lineApiCredential = require("../line-api-credential")
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

function say(data) {
  const req = https.request(requestOptions, function(res) {
    res.on("data", function(chunk) {
      console.log(chunk.toString())
    })
  })
  req.write(JSON.stringify(data))
  req.end()
}

module.exports = say
