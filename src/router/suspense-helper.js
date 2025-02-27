import { h, Suspense } from 'vue'

export function wrapInSuspense(component) {
  return {
    setup() {
      return () => h(Suspense, null, {
        default: h(component),
        fallback: h('div', { class: 'loading' }, 'Loading...')
      })
    }
  }
}
