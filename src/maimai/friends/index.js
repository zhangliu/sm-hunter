const {sleep} = require('../../../utils/time')
const { getNm } = require('../../../utils/nightmare')
const DB = require('../utils/db')
const PAGE_SIZE = 10

const run = async (query) => {
  const nm = getNm({ show: true, webPreferences: {partition: 'persist: maimais'} })

  // 登录到app
  await nm.zlLogin('https://maimai.cn/ent/talents/discover/search', 'span[innerText="搜索人才"]')
  let page = 0
  while (true) {
    const friendJobs = await DB.query('jobs', 'type="add_friend"', {page: page++, pageSize: PAGE_SIZE})
    if (friendJobs.length <= 0) return
    await addFriends(nm, friendJobs)
    await sleep(300)
  }
}

const addFriends = async (nm, jobs) => {
  for (const job of jobs) {
    if (job.status === 'success') continue
    const info = JSON.parse(job.detail)

    await nm.zlGoto(info.detail_url)
    // 是否需要加好友
    try {
      await nm.zlClick('div.btn[innerText="＋加好友"]', 3)
      await sleep(1000)
      return
    } catch(e) {
      console.log('没有发现 "＋加好友" 按钮')
    }

    // 加好友中
    try {
      await nm.zlWait('div.btn[innerText="已申请好友"]', 1000)
      return
    } catch(e) {
      console.log('没有发现 "已申请好友" 按钮')
    }

    // 是否已经成功加好友了
    try {
      await nm.zlWait('div.btn[innerText="发消息"]', 1000)
      DB.update('jobs', `sid="${job.sid}"`, {status: 'success'})
      return
    } catch(e) {
      console.log('没有发现 "发消息" 按钮')
    }
  }
}

module.exports = {
  run
}