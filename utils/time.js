const sleep = timeout => new Promise(r => setTimeout(r, timeout))

module.exports = {
  sleep,
}