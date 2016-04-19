const https = require("https")
const lineApi = require("../config/line-api")

const requestOptions = {
  method: 'POST',
  host: "trialbot-api.line.me",
  path: "/v1/events",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    "X-Line-ChannelID": lineApi.channelId,
    "X-Line-ChannelSecret": lineApi.channelSecret,
    "X-Line-Trusted-User-With-ACL":lineApi.mid, 
  },
}

function say(requestData, callback) {
  const req = https.request(requestOptions, function(res) {
    res.on("data", function(chunk) {
      console.log(chunk.toString())
    })
    res.on("error", callback)
    res.on("end", function(){
      callback()
    })
  })
  req.write(JSON.stringify(requestData))
  req.end()
}

module.exports = say
