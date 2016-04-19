function isYes(text) {
  if(/^はい$/.test(text)) {
    return true
  }
  if(/^うん$/.test(text)) {
    return true
  }
  if(/^いいよ$/.test(text)) {
    return true
  }
  if(/^うむ$/.test(text)) {
    return true
  }
  if(/^よし$/.test(text)) {
    return true
  }
  if(/^ええ$/.test(text)) {
    return true
  }
  return false
}

module.exports = isYes
