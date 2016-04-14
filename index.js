const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 8080
const createRequestData = require("./lib/create-request-data")
const say = require("./lib/say")

app.use(bodyParser.json())

app.post('/', function (req, res) {
  console.log("received")
  req.body.result.forEach(function(res) {
    console.log(res)
    const data = createRequestData("Hallo", [res.content.from])
    say(data)
  })
  res.send(':)')
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`)
})
