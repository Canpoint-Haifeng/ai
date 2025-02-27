import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export function usePaperOptions() {
  const store = useStore()
  const paperOptions = ref({})

  const setPaperOptions = (options) => {
    paperOptions.value = options
  }

  const getPaperOptions = computed(() => paperOptions.value)

  return {
    paperOptions,
    setPaperOptions,
    getPaperOptions
  }
}
