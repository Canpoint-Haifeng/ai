import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'

export function useRecommendQuestionDia(instance) {
  const store = useStore()
  
  // Reactive state
  const visible = ref(false)
  const loading = ref(false)
  const questionData = ref({})
  const pageNum = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const questionId = ref('')
  
  // Methods
  const show = (id) => {
    visible.value = true
    questionId.value = id
    getRecommendQuestions()
  }
  
  const hide = () => {
    visible.value = false
    questionData.value = {}
    pageNum.value = 1
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
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    }
    instance.proxy.newPost({ urlPath: API.GETRECOMMENDQUESTIONS.baseURL }, parms).then(res => {
      loading.value = false
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        questionData.value = res.data
        total.value = res.data.total
      }
    }).catch(() => {
      loading.value = false
    })
  }
  
  const handleCurrentChange = (val) => {
    pageNum.value = val
    getRecommendQuestions()
  }
  
  return {
    visible,
    loading,
    questionData,
    pageNum,
    pageSize,
    total,
    show,
    hide,
    getRecommendQuestions,
    handleCurrentChange
  }
}
