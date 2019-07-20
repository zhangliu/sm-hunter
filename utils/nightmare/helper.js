(function(win){
  const sleep = timeout => new Promise(r => setTimeout(r, timeout))
  const findEle = (selector) => {
    let ele
    const match = selector.match(/(.*)\[innerText=(.*)\]$/)
    if (match) {
      const innerText = (match[2] || '').replace(/"/g, '')
      return Array.from(document.querySelectorAll(match[1])).find(e => e.innerText === innerText)
    } 
    return document.querySelector(selector)
  }
  win.__NM = {
    sleep,
    findEle
  }
})(window)