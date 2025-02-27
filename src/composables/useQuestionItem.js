import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { isLogin } from '@/common/js/util'

export function useQuestionItem() {
  const store = useStore()
  const router = useRouter()

  const onCollectQuestion = async (question) => {
    if (!isLogin()) {
      ElMessage.warning('请先登录')
      return false
    }
    // Implementation
  }

  const onCheckQuestionDetail = (question) => {
    router.push({
      path: '/question/detail',
      query: { id: question.id }
    })
  }

  const onShowReportDialog = () => {
    // Implementation
  }

  const onToggleExplain = () => {
    // Implementation
  }

  const onCheckEditQuesiton = () => {
    // Implementation
  }

  const onCheckSimilarQuesiton = () => {
    // Implementation
  }

  const onAddQuestionBox = () => {
    // Implementation
  }

  const onDeleteQuestionBox = () => {
    // Implementation
  }

  const onShowLogin = () => {
    // Implementation
  }

  const onReportError = () => {
    // Implementation
  }

  return {
    onCollectQuestion,
    onCheckQuestionDetail,
    onShowReportDialog,
    onToggleExplain,
    onCheckEditQuesiton,
    onCheckSimilarQuesiton,
    onAddQuestionBox,
    onDeleteQuestionBox,
    onShowLogin,
    onReportError
  }
}
