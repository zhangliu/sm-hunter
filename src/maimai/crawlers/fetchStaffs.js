const { getNm } = require('../../../utils/nightmare')
const {sleep} = require('../../../utils/time')
const DB = require('../db')
const {querys} = require('./config')

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

const run = async () => {
  // const nm = getNm({ openDevTools: { mode: 'detach' }, show: true })
  const nm = getNm({ show: true, webPreferences: {partition: 'persist: maimais'} })
  // 登录到app
  await nm.zlLogin('https://maimai.cn/ent/talents/discover/search', 'span[innerText="搜索人才"]')

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