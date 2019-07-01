const cprocess = require('child_process')
const { exec, getFile } = require('./utils')

const filePrefix = 'sm_hunter_'
const sdcardPath = '/sdcard/'

const light = async name => await exec('input keyevent 224', name) // 224 表示点亮屏

const getScreen = async name => {
  const random = parseInt((Date.now() + Math.random()) * 10000)
  const file = `${sdcardPath}${filePrefix}${random}.png`
  await exec(`screencap -p ${file}`, name)
  await getFile(file)
  await exec(`rm -rf ${sdcardPath}${filePrefix}*`, name)
  cprocess.exec(`rm -rf ./${filePrefix}*`)
  return `./${file}`
}

const getSize = async (name) => {
  const sizeStr = await exec('wm size', name)
  const sizeArr = sizeStr.replace(/.*?(\d+)x(\d+)/, '$1,$2').split(',')
  const size = { width: +sizeArr[0], height: +sizeArr[1] }
  console.log('获取屏幕分辨率：', size)
  return size
}

module.exports = {
  light,
  getScreen,
  getSize,
}