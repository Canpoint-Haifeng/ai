<template>
  <div class="my-composition-segment">
    <div class="my-composition-title">
      <div class="my-composition-body">
        <span class="iconfont iconwodeziyuan1"></span>
        我的资源
      </div>
    </div>
    <div class="my-composition-content">
      <div class="my-composition-tabs">
        <div
          class="my-composition-tab-item"
          v-for="item in tabsList"
          :key="item.code"
          :class="activeTabs == item.code ? 'action' : ''"
          @click="onActiveTabs(item)"
        >
          <div class="tab-name">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="my-composition-paper" v-show="activeTabs == '1'">
        <div v-if="pageData.totalCount">
          <div class="title">
            <div class="title-text">
              共<span>{{ pageData.totalCount }}</span
              >套试卷
            </div>
            <div class="more" @click="openPaper">
              更多试卷<i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="my-paper" v-if="pageData.list && pageData.list.length">
            <PaperHomeList :list="pageData.list"></PaperHomeList>
          </div>
        </div>
        <div class="no-composition-resource" v-else>
          <div v-if="!isLogin || paperInit">
            <img class="no-composition-image" :src="noresultSearchPng" alt="" />
            <div class="no-composition-text">
              <span> 没有找到您的组卷，快去</span>
              <span class="click" @click="chapterSelection">组卷</span>
              <span>吧</span>
            </div>
          </div>
        </div>
      </div>
      <div class="my-composition-ques" v-show="activeTabs == '2'">
        <div v-if="questionTotalCount && questionList.length">
          <div class="title">
            <div class="title-text">
              共<span>{{ questionTotalCount }}</span
              >道题目
            </div>
            <div class="more" @click="openQuestion">
              更多试题<i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="my-composition-ques-body">
            <div
              class="my-composition-ques-item"
              v-for="questionItem in questionList"
              :key="questionItem.questionId"
            >
              <div class="question-container">
                <div v-if="questionItem" class="question-content">
                  <question-cell
                    :showAttr="false"
                    :showRegion="false"
                    :level="1"
                    :quesStructPm="
                      questionItem.quesStruct && questionItem.quesStruct.code
                        ? questionItem.quesStruct.code
                        : '-1'
                    "
                    :ques="questionItem"
                    :showExplain="false"
                  >
                  </question-cell>
                </div>
              </div>
              <div v-if="questionItem" class="question-footer clearfix">
                <span
                  >题型：<em class="">{{
                    questionItem.quesType | isEmptyObject('name')
                  }}</em></span
                >
                <span
                  >预估难度：<em class="">{{
                    questionItem.difficulty | isEmptyObject('name')
                  }}</em></span
                >
                <span
                  >更新时间：{{
                    questionItem.updateTime | datetime('YYYY/MM/DD')
                  }}</span
                >
                <span class="r" @click="openDetailQues(questionItem)">
                  <i class="iconfont icondetail"></i>详情
                </span>
              </div>
            </div>
            <div
              class="my-composition-ques-item"
              v-if="questionList.length == 1"
            >
              <div class="no-composition-resource" style="padding-top: 20px">
                <img
                  class="no-composition-image"
                  :src="noresultSearchPng"
                  alt=""
                />
                <div class="no-composition-text">
                  <span>暂无更多试题，快去</span>
                  <span class="click" @click="chapterSelection">使用试题</span>
                  <span>吧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-composition-resource" v-else>
          <div v-if="!isLogin || quesInit">
            <img class="no-composition-image" :src="noresultSearchPng" alt="" />
            <div class="no-composition-text">
              <span>没有找到您的试题，快去</span>
              <span class="click" @click="chapterSelection">使用试题</span>
              <span>吧</span>
            </div>
          </div>
        </div>
      </div>
      <div class="my-composition-book" v-show="activeTabs == '3'">
        <div v-if="booksDataTotalCount">
          <div class="title">
            <div class="title-text">
              共<span>{{ booksDataTotalCount }}</span
              >本图书
            </div>
          </div>
          <div v-if="booksData && booksData.length">
            <MyCompositionBooks :books="booksData"></MyCompositionBooks>
          </div>
        </div>
        <div class="no-composition-resource" v-else>
          <div v-if="!isLogin || bookInit">
            <img class="no-composition-image" :src="noresultSearchPng" alt="" />
            <div class="no-composition-text">
              <span> 没有找到您的图书，快去</span>
              <span class="click" @click="openBook">创建</span>
              <span>吧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { isLogin, getToken } from '@/common/js/util'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import PaperHomeList from '@/components/PaperItem/PaperHomeList'
  import QuestionCell from '@/components/QuestionItem/QuestionCell.vue'
  import MyCompositionBooks from './MyCompositionBooks'
  import NoresultSearchPng from '@/components/Noresult/noresult-search.png'
  export default {
    components: { PaperHomeList, QuestionCell, MyCompositionBooks },
    data() {
      return {
        noresultSearchPng: NoresultSearchPng,
        bkPaperList: [
          { paperId: 1, paperName: '123123', timeModified: 12312312 },
        ],
        tabsList: [
          {
            code: '1',
            name: '我的组卷',
          },
          {
            code: '2',
            name: '我的题库',
          },
          {
            code: '3',
            name: '我的图书',
          },
        ],
        activeTabs: '1',
        pageData: {
          list: [],
          pageSize: 12,
          currPage: 1,
          totalCount: 0,
        },
        questionList: [],
        questionTotalCount: 0,
        booksData: [],
        booksDataTotalCount: 0,
        paperInit: false,
        quesInit: false,
        bookInit: false,
        isLogin: isLogin(),
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mounted() {
      this.getPaperList()
    },
    methods: {
      openDetailQues(questionInfo) {
        let qscource = ''
        let year = ''
        let source = '1'
        let useCount = ''
        let updateTime = ''
        if (questionInfo) {
          if (questionInfo.questionSource) {
            qscource = questionInfo.questionSource.code || ''
          }
          if (questionInfo.year) {
            year = questionInfo.year.code || ''
          }
          if (questionInfo.useCount) {
            useCount = questionInfo.useCount || 0
          }
          if (questionInfo.updateTime) {
            updateTime = questionInfo.updateTime || ''
          }
        }
        let queryStr =
          '?questionId=' +
          questionInfo.questionId +
          '&source=' +
          source +
          '&qscource=' +
          qscource +
          '&year=' +
          year
        if (useCount) {
          queryStr += '&useCount=' + useCount
        }
        //  学段学科 已传进去
        if (this.currSubject.subjectCode) {
          queryStr += '&subject=' + this.currSubject.subjectCode
        }

        if (updateTime) {
          queryStr += '&ut=' + updateTime
        }

        this.openWindowLink(
          process.env.VUE_APP_SRC + 'question/detail' + queryStr,
        )
      },
      openPaper() {
        if (isLogin()) {
          this.openSystemPathLink('paper/resources/papers')
        } else {
          this.$emit('showLogin')
        }
      },
      chapterSelection() {
        if (isLogin()) {
          this.openSystemPathLink('paper/chapterques/selection')
        } else {
          this.$emit('showLogin')
        }
      },
      openQuestion() {
        if (isLogin()) {
          this.openSystemPathLink('paper/resources/ques?isKnowledge=1')
        } else {
          this.$emit('showLogin')
        }
      },
      openBook() {
        if (isLogin()) {
          this.openSystemPathLink('paper/resources/books')
        } else {
          this.$emit('showLogin')
        }
      },
      onActiveTabs(item) {
        this.activeTabs = item.code
        if (this.activeTabs == '2') {
          this.getQusListHttp()
        } else if (this.activeTabs == '3') {
          this.myselfBooks()
        }
      },
      // 获取 我的试题
      // 获取题目列表
      getQusListHttp() {
        if (!isLogin()) return
        if (this.questionTotalCount) return
        let parms = {
          token: getToken(),
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          currPage: 1,
          pageSize: 2,
          sort: '1',
          sortByLatestUpload: 0,
        }
        this.apiGet(API.RESOURCE_PAPER_SELFQUES, parms).then((res) => {
          this.quesInit = true
          if (this.checkoutRes(res)) {
            if (res.data) {
              if (res.data && res.data.list) {
                this.questionList = res.data.list || []
                this.questionTotalCount = res.data.totalCount
              }
            }
          }
        })
      },
      // 获取试卷列表数据
      getPaperList() {
        if (!isLogin()) return
        if (this.pageData.list && this.pageData.list.length) return
        let parms = {
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          currPage: this.pageData.currPage,
          pageSize: this.pageData.pageSize,
        }
        this.apiGet(API.GENERATION_PAPER, parms).then((res) => {
          this.paperInit = true
          if (this.checkoutRes(res)) {
            this.loading = false
            this.pageData = res.data
          } else {
            this.loading = false
          }
        })
      },
      myselfBooks() {
        if (!isLogin()) return
        if (this.booksDataTotalCount) return
        let parms = {
          stageSubject: this.currSubject.subjectCode,
        }
        this.apiGet(API.MYBOOK_BOOKS, parms).then((res) => {
          this.bookInit = true
          if (this.checkoutRes(res)) {
            let results = res.data
            let subjectName =
              this.currSubject.periodName + this.currSubject.subjectName
            let subjectCode = this.currSubject.subjectCode + ''
            this.booksDataTotalCount = results.books.length
            if (results.books && results.books.length) {
              results.books.forEach((item) => {
                item.subjectName = subjectName
                item.subjectCode = subjectCode
              })
            }
            let list = []
            if (this.booksDataTotalCount < 5) {
              list = results.books
              list.push({ id: -1 })
            } else {
              list = results.books.slice(0, 5)
            }
            this.booksData = list
          } else {
            this.$message.error(res.msg)
          }
        })
      },
    },
  }
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .my-composition-segment {
    display: flex;
    width: 1200px;
    height: 360px;
    background: #ffffff;
    border-radius: 6px;
    margin-top: 16px;
    .my-composition-title {
      position: relative;
      width: 80px;
      height: 360px;
      box-sizing: border-box;

      background: #fff1e1;
      border-radius: 6px 0px 0px 6px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffa746;
      text-align: center;
      .my-composition-body {
        padding: 100px 28px;
        background-image: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/83973df7-9f2d-4b75-acae-4415a334370d.png);
        background-size: 80px 360px;
      }
      .iconfont {
        display: inline-block;
        font-size: 24px;
        font-weight: normal;
        padding-bottom: 8px;
      }
    }
    .my-composition-content {
      flex: 1;
      padding-top: 10px;
      .my-composition-tabs {
        border-bottom: 1px solid #eeeeee;
        .my-composition-tab-item {
          display: inline-block;
          font-size: 16px;
          color: #666666;
          text-align: center;
          cursor: pointer;
          padding: 0 30px 0 20px;
          user-select: none;
          line-height: 50px;

          &.action {
            font-weight: bold;
            color: #4b8ff5;
            .tab-name {
              border-bottom: 2px solid #4b8ff5;
            }
          }
        }
      }
    }
  }

  .my-composition-paper,
  .my-composition-ques,
  .my-composition-book {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      line-height: 52px;
      font-size: 14px;
      .title-text {
        color: #666666;
        span {
          color: #fe7700;
        }
      }
      .more {
        color: $color-theme;
        cursor: pointer;
        &:hover {
          color: $color-theme-d;
        }
      }
    }
  }

  .my-composition-ques {
    .question-container {
      height: 205px;
      box-sizing: border-box;
      padding: 0 20px;
      overflow: hidden;
    }
    .question-footer {
      height: 40px;
      background: #f6f6f6;
      border-radius: 0px 0px 6px 0px;
      line-height: 40px;
      padding: 0 20px;
      span {
        display: inline-block;
        padding-right: 30px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
      .r {
        padding-right: 0px;
        float: right;
        cursor: pointer;
        user-select: none;
        color: #333333;
        .iconfont {
          color: #fea600;
          font-size: 12px;
          line-height: 40px;
          padding-right: 6px;
        }
        &:hover {
          color: $color-theme;
        }
      }
    }
  }

  .no-composition-resource {
    padding-top: 70px;
    text-align: center;
    .no-composition-image {
      display: inline-block;
      width: 101px;
      height: 123px;
    }
    .no-composition-text {
      padding-top: 24px;
      line-height: 20px;
      font-size: 16px;
      color: #999999;
      .click {
        cursor: pointer;
        user-select: none;
        color: #4b8ff5;
        &:hover {
          color: $color-theme-d;
        }
      }
    }
  }

  .my-composition-ques-body {
    display: flex;
    .my-composition-ques-item {
      overflow: hidden;
      width: 560px;
      &:nth-child(1) {
        border-right: 1px solid #eeeeee;
        // .question-container {
        //   border-right: 1px solid #eeeeee;
        // }
        .question-footer {
          border-radius: 0px 0px 0px 0px;
        }
      }
    }
  }
</style>

