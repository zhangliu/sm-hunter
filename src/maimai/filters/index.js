const DB = require('../utils/db')
const { companys } = require('../../../utils/companys')

const DAY = 24 * 60 * 60 * 1000
const START_TIME = new Date('2000-01-01').getTime()

const query = {
  position: '前端',
  company: {
    notIn: companys.ali
  },
  jump: { companyNum: 2, allTime: 3 }
}

const run = async () => {
  const staffs = await  DB.query('staffs', 'source="maimai"') // , {page: 0, pageSize: 3})
  const result = []
  for (const staff of staffs) {
    try {
      if (!isPositionOk(staff)) continue
      if (!isCompanyOk(staff)) continue
      if (isJunior(staff)) continue
      if (!isJumpOk(staff)) continue

      result.push(staff)
    } catch(e) {
      // console.error(`员工 id=${staff.id} 解析失败，目前解析失败数：${++errorNum}`)
      console.error(e)
    }
  }
  console.log(`共解析成功 ${result.length} 个员工！`)
  await genJob(result, 'add_friend')
}

const isPositionOk = (staff) => {
  const {position} = query
  const summary = JSON.parse(staff.summary)
  return summary.includes(position)
}

const isCompanyOk = (staff) => {
  const { notIn } = query.company
  const info = JSON.parse(staff.detail)
  const exp = info.exp || []
  if (exp.length <= 0) return false

  const companyName = exp[0].company
  const isIn = notIn.keys.some(key => companyName.includes(key)) 
  if (isIn) console.log(`公司：${companyName}，不符合 notin 条件：${notIn.keys}`)
  return !isIn
}

// 是不是专科
const isJunior = (staff) => {
  const info = JSON.parse(staff.detail)
  const edus = info.edu || []
  return edus.find(s => s.sdegree === '专科')
}

const isJumpOk = (staff) => {
  const { jump } = query

  const info = JSON.parse(staff.detail)
  const exp = info.exp || []
  const subExp = exp.slice(0, jump.companyNum)
  const allTime = subExp.reduce((total, item) => {
    const wk = getWorktime(item)
    // console.log(`员工 ${info.name} 在公司 ${item.company} 工作了： ${wk} 年，具体时间：${item.v}`)
    total += parseInt(wk, 10)
    return total
  }, 0)
  return allTime >= jump.allTime
}

const getWorktime = (item) => {
  const match = (item.v || '').trim().match(/(.*?)至(.*)/)
  if (!match) throw new Error('解析 worktime 失败！')
  const startTime = new Date(match[1]).getTime()
  const endTime = match[2] === '今' ? Date.now() : new Date(match[2]).getTime()

  if (isNaN(startTime) || isNaN(endTime)) throw new Error('解析 worktime 失败！')
  if ((startTime <= START_TIME) || (endTime <= START_TIME)) throw new Error('解析 worktime 失败！')

  const result = +((endTime - startTime) / (365 * DAY)).toFixed(2)
  if (result < 0 || result > 20) throw new Error('解析 worktime 失败！')
  return result
}

const genJob = async (staffs, type) => {
  console.log('开始创建 add_friend jobs...')
  for(const staff of staffs) {
    const sid = `${type}_${staff.sid}`
    const data = {
      sid,
      detail: staff.detail,
      createTime: Date.now(),
      type,
      status: ''
    }
    const dbData = await DB.query('jobs', `sid="${sid}"`)
    if (dbData && dbData.length > 0) continue
    await DB.insert('jobs', data)
  }
}

module.exports = {
  run
}