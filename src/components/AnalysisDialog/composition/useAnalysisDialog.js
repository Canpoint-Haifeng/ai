import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'

export function useAnalysisDialog(instance) {
  const store = useStore()
  
  // Reactive state
  const visible = ref(false)
  const loading = ref(false)
  const analysisData = ref({})
  const questionData = ref({})
  const currentTab = ref('analysis')
  
  // Computed properties
  const tabList = computed(() => [
    { label: '解析', name: 'analysis' },
    { label: '推荐试题', name: 'recommend' }
  ])
  
  // Methods
  const show = () => {
    visible.value = true
  }
  
  const hide = () => {
    visible.value = false
  }
  
  const getAnalysis = (questionId) => {
    loading.value = true
    let parms = {
      url: API.GETANALYSIS.urlPath,
      apiId: API.GETANALYSIS.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        questionId
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
  
  const getRecommendQuestions = (questionId) => {
    loading.value = true
    let parms = {
      url: API.GETRECOMMENDQUESTIONS.urlPath,
      apiId: API.GETRECOMMENDQUESTIONS.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        questionId,
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
      getRecommendQuestions(analysisData.value.questionId)
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
