const https = require("https")
const docomoApi = require("../config/docomo-api")

const requestOptions = {
  method: 'POST',
  host: "api.apigw.smt.docomo.ne.jp",
  path: "/dialogue/v1/dialogue?APIKEY=" + docomoApi.apiKey,
}

function dialogue(requestData, callback) {
  const req = https.request(requestOptions, function(res) {
    var data = ""
    res.on("data", function(chunk) {
      data += chunk.toString()
      console.log(chunk.toString())
    })
    res.on("error", callback)
    res.on("end", function(){
      callback(JSON.parse(data))
    })
  })
  req.write(JSON.stringify(requestData))
  req.end()
}

module.exports = dialogue
