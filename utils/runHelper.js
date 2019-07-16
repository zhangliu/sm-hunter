const {sleep} = require('./time')

const runTimes = async (func, times = 5, timeout = 5000) => {
  let runTimes = 0
  while(++runTimes <= times) {
    try {
      console.log(`开始第 ${runTimes} 次运行函数...`)
      return await runOnce(func, timeout)
    } catch (e) {
      console.log(e.message)
    }
    await sleep(1000)
  }
  throw new Error(`运行函数 ${times} 次失败！`)
}

const runOnce = async (func, timeout = 5000) => {
  return Promise.race([
    func(),
    new Promise((r, j) => setTimeout(() => j(new Error(`运行超时`)), timeout))
  ])
}

module.exports = {
  runTimes,
}