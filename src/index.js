const maimai = require('./maimai/staffs')

const run = async () => {
  try {
    await maimai.run()
  } catch(e) {
    console.error(e)
  }
}

module.exports = {
  run
}