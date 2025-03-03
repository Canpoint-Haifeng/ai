<template>
  <div>
    <!-- 历史搜索框  currSearchOption为1 只显示历史记录，为2全显示 -->
    <!-- 传currSearchOption 如果为试题的话，只显示历史记录，清空记录，直接隐藏组件， -->
    <!--类型为试卷，显示历史记录和试卷推荐，清空直接隐藏历史记录的盒子模块 -->
    <MessageList
      v-if="currSearchOption == '1' && quesHistoryList.length > 0"
      :is-show="isShow"
      :curr-search-option="currSearchOption"
      :history-list="quesHistoryList"
      @clear-list="clearList"
      @change-history-text="changeHisText"
    />
    <MessageList
      v-if="currSearchOption == '2'"
      :is-show="isShow"
      :value="showMessage"
      :curr-search-option="currSearchOption"
      :history-list="paperHistoryList"
      @clear-list="clearList"
      @change-history-text="changeHisText"
      @change-paper-name="changeHotPaper"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, defineComponent, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import MessageList from './messageList.vue'
import { API } from '@/api/config'
import Cookies from 'js-cookie'

export default defineComponent({
  name: 'HistoryMessageList',
  components: {
    MessageList,
  },
  props: {
    currSearchOption: {
      type: Number,
      default: 1,
    },
  },
  emits: ['changeHisText', 'changeHotPaper'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const store = useStore()
    
    // Reactive state
    const paperList = ref([])
    const quesHistoryList = ref([])
    const paperHistoryList = ref([])
    const showMessage = ref([])
    const isShow = ref(false)
    
    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    
    const searchHistoryCookie = computed(() => {
      if (currSubject.value) {
        return 'searchHistory' + currSubject.value.subjectCode
      } else {
        return 'searchHistory'
      }
    })
    
    const searchPaperHistoryCookie = computed(() => {
      if (currSubject.value) {
        return 'searchPaperHistory' + currSubject.value.subjectCode
      } else {
        return 'searchPaperHistory'
      }
    })
    
    // Methods
    const changeHisText = (item) => {
      emit('changeHisText', item)
    }
    
    const changeHotPaper = (item) => {
      emit('changeHotPaper', item)
    }
    
    const initSeachData = () => {
      if (!(currSubject.value && currSubject.value.subjectCode)) {
        return
      }
      getMessageList()
      getSearchHistory()
    }
    
    const getMessageList = () => {
      let parms = {
        period: currSubject.value.periodCode,
        subjectCode: currSubject.value.subjectCode,
        sort: 2,
        pageSize: 5,
      }
      // instance.proxy.apiGet(API.MANAGE_PAPER_LIST, parms).then(res => {
      //   if (instance.proxy.checkoutRes(res)) {
      //     showMessage.value = res.data.list
      //   }
      // })
    }
    
    const getSearchHistory = () => {
      let arr = Cookies.get(searchHistoryCookie.value)
      if (arr != null) {
        quesHistoryList.value = arr.split(',')
      }
      // 获取试卷历史的搜索记录
      let paperHistory = Cookies.get(searchPaperHistoryCookie.value)
      if (paperHistory != null) {
        paperHistoryList.value = paperHistory.split(',')
      }
    }
    
    const clearList = () => {
      if (props.currSearchOption == '1') {
        quesHistoryList.value = [] // 清空试题，隐藏弹框
        Cookies.remove(searchHistoryCookie.value)
      } else {
        paperHistoryList.value = [] // 清空试卷搜索历史记录
        Cookies.remove(searchPaperHistoryCookie.value)
      }
    }
    
    // 提供 给父级 保存 数据的  去重 新的数据往前unshift
    const saveCookieData = (keywords) => {
      // 保存数据到cookie
      if (props.currSearchOption == '1') {
        // tab为试题类型
        if (quesHistoryList.value && quesHistoryList.value.length > 5) {
          quesHistoryList.value.pop()
          quesHistoryList.value.unshift(keywords.trim())
        } else {
          if (keywords.trim()) {
            quesHistoryList.value.unshift(keywords.trim())
          }
        }
        let list = quesHistoryList.value
        quesHistoryList.value = [...new Set(list)] // 去重
        Cookies.set(searchHistoryCookie.value, quesHistoryList.value.join(','))
      } else {
        if (paperHistoryList.value && paperHistoryList.value.length > 5) {
          paperHistoryList.value.pop()
          paperHistoryList.value.unshift(keywords.trim())
        } else {
          if (keywords.trim()) {
            paperHistoryList.value.unshift(keywords.trim())
          }
        }
        let list = paperHistoryList.value
        paperHistoryList.value = [...new Set(list)] // 去重
        Cookies.set(
          searchPaperHistoryCookie.value,
          paperHistoryList.value.join(','),
        )
      }
    }
    
    const show = () => {
      isShow.value = true
    }
    
    const closed = () => {
      isShow.value = false
    }
    
    // Watch for changes
    watch(() => currSubject.value, () => {
      initSeachData()
    })
    
    // Lifecycle hooks
    onMounted(() => {
      initSeachData()
    })
    
    return {
      paperList,
      quesHistoryList,
      paperHistoryList,
      showMessage,
      isShow,
      changeHisText,
      changeHotPaper,
      initSeachData,
      getMessageList,
      getSearchHistory,
      clearList,
      saveCookieData,
      show,
      closed
    }
  }
})
</script>

<style lang="scss" scoped>
.messageList {
  position: absolute;
  right: 0px;
  top: 46px;
  width: 628px;
  //   min-height: 208px;
  background: #ffffff;
  box-shadow: 0px 0px 30px 1px rgba(27, 50, 89, 0.2);
  border-radius: 12px;
  border: 1px solid #c1c9cd;
  z-index: 9999;
  padding: 20px 20px;
  margin-top: 8px;
  box-sizing: border-box;
  .div_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .span_clear {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      color: #8590a6;
      cursor: pointer;
    }
  }
  .div_history {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .div_item {
      //   width: 80px;
      //   line-height: 28px;
      height: 14px;
      text-align: center;
      padding: 7px 12px;
      background: #f5f5f5;
      border-radius: 10px 10px 10px 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(n + 5) {
        margin-bottom: 0px;
      }
      span {
        color: #333333;
        font-size: 14px;
        display: block;
        max-width: 222px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .span_title {
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #8590a6;
  }
  .div_recommend {
    text-align: left;
    .icont-tip {
      padding-left: 6px;
      color: #ff985d;
    }
  }
  ul {
    padding-top: 10px;
    li {
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 10px;
      color: #333333;
      font-size: 14px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0px;
      }
      .span2 {
        padding-left: 10px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .div_item_tag {
        width: 12px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        background: #eeeeee;
        border-radius: 2px 2px 2px 2px;
        text-align: center;
        .span1 {
          color: #333333;
        }
      }
      .div_tag_bg {
        width: 12px;
        height: 18px;
        text-align: center;
      }
      &:first-child {
        .div_tag_bg {
          background: url('../../assets/images/tag_one.png');
        }
      }

      &:nth-child(2) {
        .div_tag_bg {
          background: url('../../assets/images/tag_two.png');
        }
      }
      &:nth-child(3) {
        .div_tag_bg {
          background: url('../../assets/images/tag_three.png');
        }
      }
    }
  }
}
.addClass {
  height: 172px;
}
.paperHeight {
  min-height: 208px;
}
</style>
