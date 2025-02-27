import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'
import { getToken } from '@/common/js/util'

export function useTopSearch(instance) {
  const store = useStore()
  const router = useRouter()
  
  // Reactive state
  const searchText = ref('')
  const isShow = ref(false)
  const currSearchOption = ref('1')
  const historyList = ref([])
  const hotPaperList = ref([])
  const isLogin = ref(false)
  const userInfo = ref({})
  const messageCount = ref(0)
  const isShowUserCenter = ref(false)
  const isShowMessageList = ref(false)
  const messageList = ref([])
  
  // Computed properties
  const searchOptions = computed(() => {
    return [
      { value: '1', label: '试题' },
      { value: '2', label: '试卷' },
      { value: '3', label: '资源' },
    ]
  })
  
  // Lifecycle hooks
  onMounted(() => {
    getHotPaperList()
    getHistoryList()
    getUserInfo()
    getMessageList()
    
    // Add event listener for clicks outside the component
    document.addEventListener('click', handleDocumentClick)
  })
  
  onBeforeUnmount(() => {
    // Remove event listener when component is unmounted
    document.removeEventListener('click', handleDocumentClick)
  })
  
  // Watch for changes
  watch(currSearchOption, (newVal) => {
    if (newVal === '2') {
      getHotPaperList()
    }
  })
  
  // Methods
  const handleDocumentClick = (e) => {
    // Close dropdowns when clicking outside
    const target = e.target
    if (!target.closest('.user-center') && !target.closest('.user-center-popover')) {
      isShowUserCenter.value = false
    }
    if (!target.closest('.message-list') && !target.closest('.message-icon')) {
      isShowMessageList.value = false
    }
  }
  
  const getUserInfo = () => {
    if (getToken()) {
      isLogin.value = true
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      instance.proxy.apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          userInfo.value = res.data
          store.commit('setUserInfo', res.data)
          getMessageCount()
        }
      })
    }
  }
  
  const getMessageCount = () => {
    let parms = {
      url: API.GETMESSAGECOUNT.urlPath,
      apiId: API.GETMESSAGECOUNT.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {},
    }
    instance.proxy.newPost({ urlPath: API.GETMESSAGECOUNT.baseURL }, parms).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        messageCount.value = res.data
      }
    })
  }
  
  const getMessageList = () => {
    let parms = {
      url: API.GETMESSAGELIST.urlPath,
      apiId: API.GETMESSAGELIST.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        pageNum: 1,
        pageSize: 5,
      },
    }
    instance.proxy.newPost({ urlPath: API.GETMESSAGELIST.baseURL }, parms).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        messageList.value = res.data.list
      }
    })
  }
  
  const getHotPaperList = () => {
    let parms = {
      url: API.HOTPAPER.urlPath,
      apiId: API.HOTPAPER.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {},
    }
    instance.proxy.newPost({ urlPath: API.HOTPAPER.baseURL }, parms).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        hotPaperList.value = res.data
      }
    })
  }
  
  const getHistoryList = () => {
    let list = localStorage.getItem('searchHistory')
    if (list) {
      historyList.value = JSON.parse(list)
    }
  }
  
  const saveHistoryList = () => {
    localStorage.setItem('searchHistory', JSON.stringify(historyList.value))
  }
  
  const clearList = () => {
    historyList.value = []
    localStorage.removeItem('searchHistory')
  }
  
  const changeHistoryText = (item) => {
    searchText.value = item
    isShow.value = false
    search()
  }
  
  const changePaperName = (item) => {
    searchText.value = item.paperName
    isShow.value = false
    search()
  }
  
  const search = () => {
    if (!searchText.value) {
      ElMessage.warning('请输入搜索内容')
      return
    }
    
    // Add to history list if not already present
    if (historyList.value.indexOf(searchText.value) === -1) {
      if (historyList.value.length >= 10) {
        historyList.value.pop()
      }
      historyList.value.unshift(searchText.value)
      saveHistoryList()
    }
    
    // Navigate to search results based on search option
    if (currSearchOption.value === '1') {
      router.push({
        name: 'searchQuestion',
        query: { keyword: searchText.value },
      })
    } else if (currSearchOption.value === '2') {
      router.push({
        name: 'searchPaper',
        query: { keyword: searchText.value },
      })
    } else if (currSearchOption.value === '3') {
      router.push({
        name: 'searchResource',
        query: { keyword: searchText.value },
      })
    }
  }
  
  const onFocus = () => {
    isShow.value = true
  }
  
  const onBlur = () => {
    setTimeout(() => {
      isShow.value = false
    }, 300)
  }
  
  const handleCommand = (command) => {
    if (command === 'logout') {
      logout()
    } else if (command === 'userCenter') {
      router.push({ name: 'myResources' })
    } else if (command === 'message') {
      router.push({ name: 'message' })
    }
  }
  
  const logout = () => {
    let parms = {
      url: API.LOGOUT.urlPath,
      apiId: API.LOGOUT.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {},
    }
    instance.proxy.newPost({ urlPath: API.LOGOUT.baseURL }, parms).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        store.commit('clearUserInfo')
        router.push({ name: 'paperIndex' })
        window.location.reload()
      }
    })
  }
  
  const showLogin = () => {
    instance.proxy.$cpLogin({
      visible: true,
      onGoRegister: () => {
        showRegister()
      },
    })
  }
  
  const showRegister = () => {
    instance.proxy.$cpRegister({
      visible: true,
      onGoAgreement: () => {
        router.push({ name: 'agreement' })
      },
      onGoLogin: () => {
        showLogin()
      },
    })
  }
  
  const toggleUserCenter = () => {
    isShowUserCenter.value = !isShowUserCenter.value
    if (isShowUserCenter.value) {
      isShowMessageList.value = false
    }
  }
  
  const toggleMessageList = () => {
    isShowMessageList.value = !isShowMessageList.value
    if (isShowMessageList.value) {
      isShowUserCenter.value = false
    }
  }
  
  const goToMessageCenter = () => {
    router.push({ name: 'message' })
  }
  
  return {
    searchText,
    isShow,
    currSearchOption,
    historyList,
    hotPaperList,
    isLogin,
    userInfo,
    messageCount,
    isShowUserCenter,
    isShowMessageList,
    messageList,
    searchOptions,
    onFocus,
    onBlur,
    search,
    clearList,
    changeHistoryText,
    changePaperName,
    handleCommand,
    showLogin,
    showRegister,
    toggleUserCenter,
    toggleMessageList,
    goToMessageCenter
  }
}
