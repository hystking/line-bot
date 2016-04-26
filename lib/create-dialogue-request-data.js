const requestTemplate = {
  "utt": "こんにちは",
  "context": "",
  "nickname": "ぽんふか",
  "nickname_y": "ポンフカ",
  "sex": "男",
  "bloodtype": "B",
  "birthdateY": "1997",
  "birthdateM": "5",
  "birthdateD": "30",
  "age": "16",
  "constellations": "双子座",
  "place": "東京",
  "mode": "dialog",
}

function createDialigueRequestData(text) {
  return Object.assign({}, requestTemplate, {utt: text})
  
}

module.exports = createDialigueRequestData
