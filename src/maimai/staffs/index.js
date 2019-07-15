const { getNm } = require('../../../utils/nightmare')
const {sleep} = require('../../../utils/time')
const DB = require('./db')
const friends = require('./friends')

const query = {
  province: '上海',
  keyword: 'java',
  is_211_985: 1,
  channel: 'www',
  company_level: -1,
  degree: '本科',
  loc: '',
  version: '1.0.0',
  work_time: '5-10年',
}

const friendQuery = {
  is211: true,
  is985: true,
  isGoodSchool: true,
  isGoodCompany: true
}

const run = async () => {
  // const nm = getNm({ openDevTools: { mode: 'detach' }, show: true })
  const nm = getNm({ show: true })
  // 登录到app
  await login(nm)

  console.log('开始进入人才页面...')
  await nm.zlGoto('https://maimai.cn/ent/talents/discover/search')
  let page = -1
  while(true) {
    try {
      const staffs = await getStaffs(nm, ++page)
      console.log(`获取到人才数据 ${staffs.length} 条`)
      if (staffs.length <= 0) break
      await saveStaffs(nm, staffs)
      await sleep(5000)
    } catch(e) {
      console.log(`无法保存第 ${page} 页数据！条件 ${query}`)
      throw e
    }
  }

  // 解析出需要加好友的人才
  genFriendJobs(friendQuery)

  // 加好友
  console.log('开始添加好友！')

  // 发送意向句（例如：你好，看了一下你的简历，咱们这边目前是xxx，这里有个xxx职位很适合你...），后面加人工自能聊天

  // 过滤出意向度高的人
}

const login = async (nm) => {
  console.log('开始登陆脉脉...')
  await nm.zlGoto('https://acc.maimai.cn/login')
  await nm.insert('.loginPhoneInput', '13564703909').insert('#login_pw', 'zhangliumm0')
  await nm.click('.loginBtn')

  try {
    await nm.zlWait('.pcUserName')
  } catch (e) {
    console.error('登录脉脉失败!')
    throw e
  }
  
  console.log('登陆脉脉成功！')
}

const getStaffs = async (nm, page) => {
  console.log(`开始获取第 ${page + 1} 页人才数据...`)
  const url = 'https://maimai.cn/api/ent/discover/search'

  const headers = {
    'Content-Type': 'application/json',
    'X-Request-Id': getGUID()
  }
  const params = {page, ...query}
  const result = await nm.req.get(url, { params, headers, credentials: 'include' })
  return result.data.list
}

const getGUID = () => {
  const w = () => Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
  return w() + w() + '-' + w() + '-' + w() + '-' + w() + '-' + w() + w() + w()
}

const saveStaffs = async (nm, staffs) => {
  console.log('开始保存人才数据...')
  for(const staff of staffs) {
    const data = {
      mmUid: staff.id,
      query,
      detail: JSON.stringify(staff),
      createTime: Date.now()
    }
    const dbData = await DB.query('staffs', `mmUid=${staff.id}`)
    if (dbData && dbData.length > 0) await DB.del('staffs', `mmUid=${staff.id}`)
    await DB.insert('staffs', data)
    console.log(`保存 ${staff.name} 简历成功！`)
  }
}

module.exports = {
  run
}