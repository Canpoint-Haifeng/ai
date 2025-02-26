import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useAnchor() {
  // Reactive state
  const activeIndex = ref(0)
  const anchorList = ref([])
  const isScrolling = ref(false)
  
  // Methods
  const handleScroll = () => {
    if (isScrolling.value) return
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const offsetHeight = document.documentElement.clientHeight
    
    // Find the current active section
    for (let i = anchorList.value.length - 1; i >= 0; i--) {
      const element = document.getElementById(anchorList.value[i].id)
      if (element) {
        const offsetTop = element.offsetTop
        if (scrollTop >= offsetTop - 100) {
          activeIndex.value = i
          break
        }
      }
    }
  }
  
  const scrollToAnchor = (index) => {
    const element = document.getElementById(anchorList.value[index].id)
    if (element) {
      isScrolling.value = true
      activeIndex.value = index
      
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
      
      setTimeout(() => {
        isScrolling.value = false
      }, 500)
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  return {
    activeIndex,
    anchorList,
    scrollToAnchor
  }
}
