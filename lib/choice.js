function choice(arr, random) {
  return arr[arr.length * random | 0]
}

module.exports = choice
