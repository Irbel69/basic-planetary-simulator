 var counter;
  function start(e) {
    console.log(e.target);
    counter = setInterval(()=>{e.target.click()}, 200);
  }
  function end() {
    clearInterval(counter)
  }