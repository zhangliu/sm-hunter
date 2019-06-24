const { getNm } = require('../../../utils/nm')

const run = async () => {
  const nm = getNm({ openDevTools: { mode: 'detach' }, show: true })
  // 登录到app
  await login(nm)

  console.log('开始进入人才页面...')
  await nm.goto('https://maimai.cn/ent/talents/discover/search')
  let page = -1
  while(true) {
    const staffs = await getStaffs(nm, ++page)
    console.log(`获取到人才数据 ${staffs.length} 条`, staffs)
    if (staffs.length <= 0) break
    const filterStaffs = filterStaffs(nm, staffs)
  }

  // 加好友

  // 发送意向句（例如：你好，看了一下你的简历，咱们这边目前是xxx，这里有个xxx职位很适合你...），后面加人工自能聊天

  // 过滤出意向度高的人
}

const login = async (nm) => {
  console.log('开始登陆脉脉...')
  await nm.goto('https://acc.maimai.cn/login')
  await nm.insert('.loginPhoneInput', '13564703909').insert('#login_pw', 'zhangliumm0')
  await nm.click('.loginBtn')

  try {
    await nm.waitElement('.pcUserName')
  } catch (e) {
    console.error('登录脉脉失败!')
    throw e
  }
  
  console.log('登陆脉脉成功！')
}

const getStaffs = async (nm, page) => {
  console.log(`开始获取第 ${page + 1} 页人才数据...`)
  const url = 'https://maimai.cn/api/ent/discover/search'
  const params = {
    channel: 'www',
    company_level: -1,
    degree: '本科',
    is_211_985: 1,
    keyword: 'java',
    loc: '',
    page,
    province: '上海',
    version: '1.0.0',
    work_time: '5-10年'
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Request-Id': getGUID()
  }
  const result = await nm.req.get(url, { params, headers, credentials: 'include' })
  return result.data.list
}

const getGUID = () => {
  const w = () => Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
  return w() + w() + '-' + w() + '-' + w() + '-' + w() + '-' + w() + w() + w()
}

module.exports = {
  run
}