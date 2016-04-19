function isNo(text) {
  if(/^いいえ$/.test(text)) {
    return true
  }
  if(/^やだ$/.test(text)) {
    return true
  }
  if(/^だめ$/.test(text)) {
    return true
  }
  if(/^ちがう$/.test(text)) {
    return true
  }
  if(/^違う$/.test(text)) {
    return true
  }
  if(/^いや$/.test(text)) {
    return true
  }
  return false
}

module.exports = isNo
