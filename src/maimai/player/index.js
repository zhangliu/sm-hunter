const Nightmare = require('nightmare')
const nightmare = Nightmare({ 
    // openDevTools: {
        // mode: 'detach'
    // },
    show: true
})

const run = async () => {
  // 登录到app
  await login()
  // 查找目标人才

  // 加好友

  // 发送意向句（例如：你好，看了一下你的简历，咱们这边目前是xxx，这里有个xxx职位很适合你...），后面加人工自能聊天

  // 过滤出意向度高的人
}

const login = async () => {
  console.log('开始登陆 maimai app...')

}

module.exports = {
  run
}