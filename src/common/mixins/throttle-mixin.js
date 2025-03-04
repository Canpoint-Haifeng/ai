export default {
  methods: {
    throttle(fn, delay = 300) {
      let timer = null
      return function(...args) {
        if (timer) return
        timer = setTimeout(() => {
          fn.apply(this, args)
          timer = null
        }, delay)
      }
    }
  }
}
