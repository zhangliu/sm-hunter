const Nightmare = require('nightmare')
const querystring = require('querystring')
const { sleep } = require('../time')

const getNm = (opt = {}) => {
  const nightmare = Nightmare(opt)
  nightmare.zlWait = zlWait.bind(nightmare)
  nightmare.zlGoto = (url) => nightmare.goto(url).inject('js', `${__dirname}/helper.js`)
  nightmare.zlClick = selector => zlClick.bind(nightmare, selector)

  nightmare.req = {
    get: get.bind(nightmare)
  }

  return nightmare
}

const zlWait = async function(selector, timeout = 20000) {
  let endTime = Date.now() + timeout
  while(Date.now() < endTime) {
    console.log('to find node remaining: ', endTime - Date.now())
    const result = await this.evaluate(selector => {
      console.log('try to find', selector)
      return !!document.querySelector(selector)
    }, selector)
    if (result) return
    await sleep(1000)
  }
  throw new Error(`wait node "${selector}" time out!`)
}

const zlClick = selector => {
  this.evaluate(selector => {
    
  }, selector)
}

const get = function(url, opt = {}) {
  const paramsStr = opt.params ? `${querystring.stringify(opt.params)}` : ''
  delete opt.params

  return this.evaluate(async (url, opt) => {
    const res = await fetch(url, opt)
    return await res.json()
  }, `${url}?${paramsStr}`, opt)
}

module.exports = {
  getNm,
}