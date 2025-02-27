import { onMounted, onUnmounted } from 'vue'

export function useWindowScroll() {
  const resetScroll = () => {
    window.scrollTo(0, 0)
  }

  onMounted(() => {
    resetScroll()
  })

  onUnmounted(() => {
    resetScroll()
  })

  return {
    resetScroll
  }
}
