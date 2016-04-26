const mecab = new require("mecab-async")
const PON = "ポン"
const DAPON = "だポン"

function daponify(text, callback) {
  mecab.parse(text, function(err, result) {
    const noShujoshi = result.filter(function(e){return e[2] !== "終助詞"})
    const daponified = noShujoshi.map(function(e, i, arr){
      const next = arr[i + 1]
      if(!next || next[1] === "記号") {
        if(e[1] === "助動詞"){
          return [DAPON]
        }
        if(e[1] === "動詞"){
          return [e[0] + PON]
        }
        if(e[1] === "名詞"){
          return [e[0] + DAPON]
        }
        if(e[1] === "形容詞"){
          return [e[0] + PON]
        }
        if(e[1] === "形容動詞"){
          return [e[0] + PON]
        }
        if(e[1] === "感動詞"){
          return [e[0] + DAPON]
        }
      }
      return e
    })
    callback(daponified.map(function(e){return e[0]}).join(""))
  })
}

module.exports = daponify
