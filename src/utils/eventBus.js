import { ref } from 'vue'
import mitt from 'mitt'

const emitter = mitt()
const Bus = {
  on: (...args) => emitter.on(...args),
  once: (event, callback) => {
    const fn = (...args) => {
      emitter.off(event, fn)
      callback(...args)
    }
    emitter.on(event, fn)
  },
  off: (...args) => emitter.off(...args),
  emit: (...args) => emitter.emit(...args)
}

export default Bus
