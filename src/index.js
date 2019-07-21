const crawlers = require('./maimai/crawlers')
const filters = require('./maimai/filters')

const fetch = async () => {
  try {
    await crawlers.run()
  } catch(e) {
    console.error(e)
  }
}

const filter = async () => {
  try {
    await filters.run()
  } catch(e) {
    console.error(e)
  }
}

module.exports = {
  fetch,
  filter
}