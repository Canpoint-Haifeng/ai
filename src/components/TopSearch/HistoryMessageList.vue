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
import MessageList from './messageList.vue'
import { API } from '@/api/config'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
export default {
  components: {
    MessageList,
  },
  props: {
    currSearchOption: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState(['currSubject']),
    searchHistoryCookie() {
      if (this.currSubject) {
        return 'searchHistory' + this.currSubject.subjectCode
      } else {
        return 'searchHistory'
      }
    },
    searchPaperHistoryCookie() {
      if (this.currSubject) {
        return 'searchPaperHistory' + this.currSubject.subjectCode
      } else {
        return 'searchPaperHistory'
      }
    },
  },
  watch: {
    currSubject() {
      this.initSeachData()
    },
  },
  data() {
    return {
      paperList: [],
      quesHistoryList: [],
      paperHistoryList: [],
      showMessage: [],
      isShow: false,
    }
  },
  mounted() {
    this.initSeachData()
  },
  methods: {
    changeHisText(item) {
      this.$emit('changeHisText', item)
    },
    changeHotPaper(item) {
      this.$emit('changeHotPaper', item)
    },
    initSeachData() {
      if (!(this.currSubject && this.currSubject.subjectCode)) {
        return
      }
      this.getMessageList()
      this.getSearchHistory()
    },
    getMessageList() {
      let parms = {
        period: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        sort: 2,
        pageSize: 5,
      }
      // this.apiGet(API.MANAGE_PAPER_LIST, parms).then(res => {
      //   if (this.checkoutRes(res)) {
      //     this.showMessage = res.data.list
      //   }
      // })
    },
    getSearchHistory() {
      let arr = Cookies.get(this.searchHistoryCookie)
    //   console.log(arr, '获取到历史的搜索记录', this.searchHistoryCookie, arr)
      if (arr != null) {
        this.quesHistoryList = arr.split(',')
      }
      // 获取试卷历史的搜索记录
      let paperHistory = Cookies.get(this.searchPaperHistoryCookie)
      if (paperHistory != null) {
        this.paperHistoryList = paperHistory.split(',')
      }
    },
    clearList() {
      if (this.currSearchOption == '1') {
        this.quesHistoryList = [] //清空试题，隐藏弹框
        Cookies.remove(this.searchHistoryCookie)
      } else {
        this.paperHistoryList = [] //清空试卷搜索历史记录
        Cookies.remove(this.searchPaperHistoryCookie)
      }
    },
    // 提供 给父级 保存 数据的  去重 新的数据往前unshift
    saveCookieData(keywords) {
      //保存数据到cookie
      if (this.currSearchOption == '1') {
        //tab为试题类型
        if (this.quesHistoryList && this.quesHistoryList.length > 5) {
          this.quesHistoryList.pop()
          this.quesHistoryList.unshift(keywords.trim())
        } else {
          if (keywords.trim()) {
            this.quesHistoryList.unshift(keywords.trim())
          }
          //   Cookies.set(this.searchHistoryCookie, this.quesHistoryList.join(','))
        }
        let list = this.quesHistoryList
        this.quesHistoryList = [...new Set(list)] //去重
        Cookies.set(this.searchHistoryCookie, this.quesHistoryList.join(','))
      } else {
        if (this.paperHistoryList && this.paperHistoryList.length > 5) {
          this.paperHistoryList.pop()
          this.paperHistoryList.unshift(keywords.trim())
        } else {
          if (keywords.trim()) {
            this.paperHistoryList.unshift(keywords.trim())
          }
        }
        let list = this.paperHistoryList
        this.paperHistoryList = [...new Set(list)] //去重
        Cookies.set(
          this.searchPaperHistoryCookie,
          this.paperHistoryList.join(','),
        )
      }
    },
    show() {
      this.isShow = true
    },
    closed() {
      this.isShow = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
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

