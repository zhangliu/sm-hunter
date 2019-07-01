const { exec } = require('./utils')
const win = require('./win')

class Phone {
  constructor(name) {
    this.name = name
  }

  async login() {
    const { width, height } = await win.getSize()
    await win.light()
  
    const startPoint = { x: width / 2, y: height - 1 }
    const endPoint = { x: width / 2, y: 0 }
    await this.swipe(startPoint, endPoint)
    const image = await win.getScreen(this.name)
  }
  
  async swipe(startPoint, endPoint, duration = 200) {
    const startStr = `${startPoint.x} ${startPoint.y}`
    const endStr = `${endPoint.x} ${endPoint.y}`
    await exec(`input swipe ${startStr} ${endStr} ${duration} `, this.name)
  }
}


module.exports = Phone