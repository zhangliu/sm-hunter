const Nightmare = require('nightmare')
const querystring = require('querystring')
const { sleep } = require('../time')
const {runTimes} = require('../runHelper')

const getNm = (opt = {}) => {
  const nightmare = Nightmare(opt)
  nightmare.zlWait = zlWait.bind(nightmare)
  nightmare.zlGoto = (url) => nightmare.goto(url).inject('js', `${__dirname}/helper.js`)
  nightmare.zlClick = zlClick.bind(nightmare)
  nightmare.zlTryClick = zlTryClick.bind(nightmare)
  nightmare.zlLogin = zlLogin.bind(nightmare)

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

const zlClick = async function(selector, times) {
  const fun = async () => await this.evaluate(selector => {
    let ele
    const match = selector.match(/(.*)\[innerText=(.*)\]$/)
    if (match) {
      const innerText = (match[2] || '').replace(/"/g, '')
      ele = Array.from(document.querySelectorAll(match[1])).find(e => e.innerText === innerText)
    } else ele = document.querySelector(selector)

    if (!ele) throw new Error(`没有发现元素 ${selector}`)
    ele.click()
  }, selector)

  await runTimes(fun, times)
}

const zlTryClick = async function(selector, times){
  try {
    await zlClick.bind(this)(selector, times)
  } catch(e) {
    console.log(e)
    return false
  }
}

const zlLogin = async function(url, loginQuery, loginUrl) {
  console.log(`尝试登录系统 ${url} 中`)
  try {
    return await this.goto(url).zlWait(loginQuery, 5000)
  } catch(e) {
    console.error(e)
  }
  console.log('发现状态为未登录，尝试登录中...')
  if (loginUrl) await this.goto(loginUrl)

  console.log('请输入用户名密码！')
  const oldUrl = await this.url()
  
  await runTimes(async () => (await this.url() !== oldUrl), 90)

  await this.zlLogin(url, loginQuery, loginUrl)
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