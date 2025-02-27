import { ref } from 'vue'

export function useThrottle(fn, delay = 300) {
  const timer = ref(null)
  const lastTime = ref(0)

  return function (...args) {
    const now = Date.now()

    if (now - lastTime.value > delay) {
      fn.apply(this, args)
      lastTime.value = now
    } else {
      if (timer.value) clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        fn.apply(this, args)
        lastTime.value = Date.now()
      }, delay)
    }
  }
}
