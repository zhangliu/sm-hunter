(function(win){
  const sleep = timeout => new Promise(r => setTimeout(r, timeout))
  win.__nm = {
    sleep
  }
})(window)