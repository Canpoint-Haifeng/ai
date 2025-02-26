import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'

export function useAnalysisDialogMaker(instance) {
  const store = useStore()
  
  // Reactive state
  const visible = ref(false)
  const loading = ref(false)
  const analysisData = ref({})
  const questionData = ref({})
  const currentTab = ref('analysis')
  const questionId = ref('')
  
  // Computed properties
  const tabList = computed(() => [
    { label: '解析', name: 'analysis' },
    { label: '推荐试题', name: 'recommend' }
  ])
  
  // Methods
  const show = (id) => {
    visible.value = true
    questionId.value = id
    getAnalysis(id)
  }
  
  const hide = () => {
    visible.value = false
    analysisData.value = {}
    questionData.value = {}
    currentTab.value = 'analysis'
  }
  
  const getAnalysis = (id) => {
    loading.value = true
    let parms = {
      url: API.GETANALYSIS.urlPath,
      apiId: API.GETANALYSIS.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        questionId: id
      }
    }
    instance.proxy.newPost({ urlPath: API.GETANALYSIS.baseURL }, parms).then(res => {
      loading.value = false
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        analysisData.value = res.data
      }
    }).catch(() => {
      loading.value = false
    })
  }
  
  const getRecommendQuestions = () => {
    if (!questionId.value) return
    
    loading.value = true
    let parms = {
      url: API.GETRECOMMENDQUESTIONS.urlPath,
      apiId: API.GETRECOMMENDQUESTIONS.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        questionId: questionId.value,
        pageNum: 1,
        pageSize: 10
      }
    }
    instance.proxy.newPost({ urlPath: API.GETRECOMMENDQUESTIONS.baseURL }, parms).then(res => {
      loading.value = false
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        questionData.value = res.data
      }
    }).catch(() => {
      loading.value = false
    })
  }
  
  const handleTabClick = (tab) => {
    currentTab.value = tab.name
    if (tab.name === 'recommend') {
      getRecommendQuestions()
    }
  }
  
  return {
    visible,
    loading,
    analysisData,
    questionData,
    currentTab,
    tabList,
    show,
    hide,
    getAnalysis,
    getRecommendQuestions,
    handleTabClick
  }
}
