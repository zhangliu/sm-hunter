const cprocess = require('child_process')

const exec = (cmd, phonename) => {
  return new Promise((r, j) => {
    const nameStr = phonename ? `-s ${phonename}` : ''
    cprocess.exec(`adb ${nameStr} shell ${cmd}`, (error, stdout, stderr) => {
      if (error) return j(error)
      r(stdout)
    })
  })
}

const getFile = (filename, phonename) => {
  return new Promise((r, j) => {
    const nameStr = phonename ? `-s ${phonename}` : ''
    cprocess.exec(`adb ${nameStr} pull ${filename}`, (error, stdout, stderr) => {
      if (error) return j(error)
      r(stdout)
    })
  })
}

module.exports = {
  exec,
  getFile,
}