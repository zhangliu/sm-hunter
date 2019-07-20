const {sleep} = require('../../../utils/time')
const DB = require('../db')

const genFriendJobs = async (query) => {
  let page = 0
  while(true) {
    const staffs = await DB.query('staffs', undefined, {page: 1, pageSize: 10})
    const friends = staffs.filter(staff => isFrends(staff, query))
    for(const friend of friends) {
      const data = {
        name: friend.name,
        position: friend.position,
        company: friend.company,
        company: friend.company,
        avatar: friend.avatar
      }
      DB.insert('jobs', { type: 'add_friend', info: JSON.stringify(data) })
    }
  }
}

const isFrends = (query) => {
  return true
}

module.exports = {
  genFriendJobs
}