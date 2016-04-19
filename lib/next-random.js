function nextRandom(random, n) {
  n = n || 1
  var ret = random
  var i = 0;
  for(i = 0; i < n; i ++) {
    ret = ret * 10 % 1
  }
  return ret
}

module.exports = nextRandom
