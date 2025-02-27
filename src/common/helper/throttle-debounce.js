export const debounce = (delay, callback) => {
  let timeoutID

  function wrapper() {
    const self = this
    const args = arguments

    function exec() {
      callback.apply(self, args)
    }

    clearTimeout(timeoutID)

    timeoutID = setTimeout(exec, delay)
  }

  return wrapper
}

export const throttle = (delay, callback) => {
  let timeoutID
  let lastExec = 0

  function wrapper() {
    const self = this
    const elapsed = Number(new Date()) - lastExec
    const args = arguments

    function exec() {
      lastExec = Number(new Date())
      callback.apply(self, args)
    }

    clearTimeout(timeoutID)

    if (elapsed > delay) {
      exec()
    } else {
      timeoutID = setTimeout(exec, delay - elapsed)
    }
  }

  return wrapper
}
