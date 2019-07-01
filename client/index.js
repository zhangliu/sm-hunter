const Phone = require('./phone/index')

const getPhone = (name) => new Phone(name)

module.exports = {
  getPhone
}