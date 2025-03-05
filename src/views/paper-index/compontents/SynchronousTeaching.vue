<template>
  <div class="sync-body">
    <div class="title">
      <img
        src="./img/recommended.svg"
        alt=""
      >
      <div class="tabs">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="同步教案"
            name="1"
          />
          <el-tab-pane
            label="阶段复习"
            name="2"
          />
          <el-tab-pane
            label="专题备考"
            name="3"
          />
        </el-tabs>
      </div>
    </div>
    <div class="sync-teach-content">
      <div class="chapter-list">
        <div
          v-for="(item, index) in treeDataList[activeName]"
          :key="item.chapterCode"
          class="chapter-item"
          :class="
            hoverIndex === index ||
              (index == 0 && [-1, 1, 3, 5, 7, 9].includes(hoverIndex)) ||
              (index == 1 && [-1, 0, 2, 4, 6, 8, 10].includes(hoverIndex))
              ? 'chapter-item-special chapter-item-hover'
              : ''
          "
          :title="item.name"
          @click="selectChapterItem(item)"
          @mouseover="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
        >
          <!-- <transition name="expand"> @mouseover="hoverIndex = index"
          -->
          <transition name="expand">
            <div
              v-if="
                hoverIndex === index ||
                  (index == 0 && [-1, 1, 3, 5, 7, 9].includes(hoverIndex)) ||
                  (index == 1 && [-1, 0, 2, 4, 6, 8, 10].includes(hoverIndex))
              "
              style="width: 100%;"
              class="flex justify-center "
            >
              <img
                src="./img/teaching-plan.svg"
                alt=""
              >
              <div class="content flex justify-center">
                <div class="name-info">
                  <div class="paper-name">
                    {{ item.name }}
                  </div>
                  <span class="paper-tag">{{
                    lessonType[item.lessonType - 1]
                  }}</span>
                </div>

                <div class="common-data flex flex-start">
                  <span
                    class="time"
                    style="margin-right: 20px;"
                  >{{
                    formatTimestamp(item.updateTime, 1)
                  }}</span>
                  <div
                    v-for="common in commonData"
                    :key="common.type"
                    style="margin-right: 20px;"
                    :title="common.value"
                  >
                    <span style="margin-right: 4px;">{{ common.value }}</span>

                    <span class="num">{{
                      formatNumber(item[common.type])
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="content"
            >
              <span
                class="paper-name"
                :class="'paper-sort-' + index"
              >
                {{ item.name || item.fileName || item.paperName }}
              </span>
              <span class="paper-time">{{
                formatTimestamp(item.updateTime, 1)
              }}</span>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- <SelectSubjectSyncDia ref="selectSubjectSyncDiaRef"></SelectSubjectSyncDia> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  isLogin,
  getCookieSubjectVolume,
  setCookieSubjectVolume,
  getStageEntranceBySubject,
} from '@/common/js/util'
import CTS from '@/common/js/constant.js'
import SelectSubjectSyncDia from './SelectSubjectSyncDia.js'
import moment from 'moment'
import { commonData } from '../hooks/index.js'
import Login from '@/components/Login/Login.vue'

export default {
  components: { SelectSubjectSyncDia },
  computed: {
    ...mapState(['currSubject', 'userInfo']),
    teachGradeCurrentName() {
      console.log(this.teachCurrentName, this.volumeCurrentName, 111)
      if (this.teachCurrentName && this.volumeCurrentName) {
        // if (this.currSubject && this.currSubject.periodCode == '13') {
        //   return this.teachCurrentName + ' / ' + this.gradeCurrentName
        // } else {
        //   return (
        //     this.teachCurrentName +
        //     ' / ' +
        //     this.gradeCurrentName +
        //     this.volumeCurrentName
        //   )
        // }
        return this.teachCurrentName + ' / ' + this.volumeCurrentName
      } else {
        return '请点击图标，选择教材'
      }
    },
  },
  watch: {
    currSubject(val, old) {
      // this.getBookCategoryId()
      // this.treeDataList = [] // 自控章节选题
      this.bookText = {}
    },
    userInfo(v) {
      // 监听 userInfo 才会 访问
      this.getDefaultBookToBack() // 获取基本学段学科信息
    },
    activeName() {
      this.getList()
      // this.getSideList()
    },
  },
  data() {
    return {
      visible: false,
      teachData: [],
      classData: [],
      teachCurrentCode: '',
      teachCurrentName: '',
      gradeCurrentCode: '',
      gradeCurrentName: '',
      volumeCurrentCode: '',
      volumeCurrentName: '',
      treeDataList: [[], [], [], []],
      bookText: {},
      bookId: '',
      typesList: [[], [], [], []],
      currentSyncId: ['', '', '', ''],
      activeName: '1',
      commonData: [
        {
          type: 'previewNum',
          value: '浏览',
        },
        {
          type: 'downNum',
          value: '下载',
        },
      ],
      // commonData: [
      //   {
      //     type: 'pageView',
      //     value: '浏览'
      //   },
      //   {
      //     type: 'likes',
      //     value: '点赞'
      //   },
      //   {
      //     type: 'Downloads',
      //     value: '下载'
      //   },
      //   {
      //     type: 'usageCount',
      //     value: '使用'
      //   }
      // ],
      testData: [],
      hoverIndex: -1,
      lessonType: ['同步教案', '阶段复习', '专题备考'],
    }
  },
  created() {
    this.getDefaultBookToBack() // 获取基本学段学科信息
    this.getGradesList()
    this.getList()
    this.getSideList()
  },
  mounted() {
    if (this.currSubject && this.currSubject.subjectCode) {
      this.getBookCategoryId()
    }
  },
  methods: {
    formatNumber(value) {
      console.log('value', value)
      if (!value) return '0'
      if (value >= 10000) {
        return (value / 10000).toFixed(1) + 'w'
      }
      return value
    },
    handleClick(tab, event) {
      // this.activeName = tab.name
      // console.log(tab, event);
    },
    selectChapterItem(item) {
      this.$router.push({
        path: '/smartPaper/prePare',
        query: {
          id: item.id,
          type: item.lessonType,
          source: 1,
          showEdit: 1,
        },
      })
      // this.getCookieSubjectVolume()

      // let cookieSubject = getCookieSubjectVolume(this.currSubject.subjectCode)
      // if (cookieSubject) {
      //   this.openSystemPathLink(
      //     `paper/chapter/selection?chapter=${item.chapterCode}&paperType=${this.currentSyncId}`,
      //   )
      // } else {
      //   this.$refs.selectSubjectSyncDiaRef.show()
      // }

      // if (isLogin()) {
      //   this.openSystemPathLink(
      //     `paper/chapter/selection?chapter=${item.chapterCode}&paperType=${this.currentSyncId}`,
      //   )
      // } else {
      //   this.$emit('showLogin')
      // }
      // let queryStr = '?paperId=' + item.paperId + '&source=' + item.source
      // window.open(this.$router.resolve('/paper/detail').href+queryStr)
    },
    // 获取当前学段试卷类型关联id
    getRelationCategoryId() {
      // 通过配置 获取 试卷类型
      // this.typesList = getStageEntranceBySubject(
      //   this.currSubject.subjectCode,
      //   3,
      // )
      // this.selectPaperType(this.typesList[0])
    },
    selectPaperType(item) {
      if (item) {
        this.currentSyncId[this.activeName] = item.code
        this.treeDataList[this.activeName] = []
        this.getList()
      }
    },
    getBookCategoryId() {
      // let strParams = {
      //   periodCode: this.currSubject.periodCode,
      //   subjectCode: this.currSubject.subjectCode,
      // }
      // this.$store
      //   .dispatch('getConfigData', {
      //     vm: this,
      //     type: 4,
      //     strParams: strParams,
      //     setKey: 'configVersionList',
      //   })
      //   .then((res) => {
      //     let bookArr = res || []
      //     this.teachData = bookArr
      //   })
      const url = { urlPath: '/lesson-app/config/getInvokeInfo' }
      const params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet(url, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data.length) {
            res.data.forEach(v => {
              v.version = v.id
              v.versionName = v.name
              v.gradeList &&
                v.gradeList.forEach(y => {
                  y.grade = y.gradeId
                  y.volume = y.volumeId
                })
            })
            // 复制的，没办法，很恶心
            this.teachData = res.data
            const i = this.teachData.findIndex(v => v.versionIsDefault === 1)
            let item
            let child
            if (i !== -1) {
              item = this.teachData[i]
              child = this.teachData[i].gradeList
            } else {
              item = this.teachData[0]
              child = this.teachData[0].gradeList
            }
            this.teachCurrentCode = item.version
            this.classData =
              child &&
              child.map(v => {
                return {
                  gradeCode: v.grade,
                  gradeName: v.gradeName,
                  volumeCode: v.volume,
                  volumeName: v.volumeName,
                }
              })
            const data = this.classData ? this.classData[0] : {}
            this.gradeCurrentCode = data.gradeCode
            this.volumeCurrentCode = data.volumeCode
            this.teachCurrentName = item.versionName
            this.volumeCurrentName = data.volumeName
            // this.getChapter()
            this.getList()
          }
        } else {
          // this.$message.error(res.msg)
        }
      })
    },
    getDefaultBookToBack() {
      // if (isLogin()) {
      //   if (!this.userInfo.userGuid) return
      // } else {
      //   // 看缓存 里面有没有
      //   let currS = getCookieSubjectVolume(this.currSubject.subjectCode)
      //   if (currS && currS.volume) {
      //     this.teachCurrentName = currS.volume.tName
      //     this.volumeCurrentName = currS.volume.vName
      //     this.gradeCurrentName = currS.volume.gName
      //     this.teachCurrentCode = currS.volume.tCode
      //     this.gradeCurrentCode = currS.volume.gCode
      //     this.volumeCurrentCode = currS.volume.vCode
      //     this.getGradeCategoryId(this.teachCurrentCode) // 获取年级
      //     // this.getPaperList() // 获取右侧栏数据
      //     this.getRelationCategoryId() // 获取 试卷类型
      //     return
      //   }
      // }
      // let strParams = {
      //   periodCode: this.currSubject.periodCode,
      //   subjectCode: this.currSubject.subjectCode,
      // }
      // this.getInvokeData(3, strParams, this.userInfo.userGuid || '').then(
      //   (v) => {
      //     const res = v.data
      //     if (res.code === CTS.constant.SUCCESS_CODE) {
      //       let codeObj = res.data.paramValue
      //       this.teachCurrentName = res.data.textbookVersionName
      //       this.volumeCurrentName = res.data.volumeName
      //       this.gradeCurrentName = res.data.gradeName
      //       if (codeObj) {
      //         this.teachCurrentCode = codeObj.textbookVersionCode
      //         this.gradeCurrentCode = codeObj.gradeCode
      //         this.volumeCurrentCode = codeObj.volumeCode
      //         this.getGradeCategoryId(codeObj.textbookVersionCode) // 获取年级
      //       }
      //       // this.getPaperList() // 获取右侧栏数据
      //       this.getRelationCategoryId() // 获取 试卷类型
      //     } else {
      //       return null
      //     }
      //   },
      // )
    },
    // 获取年级和册列表
    getGradeCategoryId() {
      let strParams = {
        versionCode: this.teachCurrentCode,
        subjectCode: this.currSubject.subjectCode,
      }
      var classArrVom = []
      this.$store
        .dispatch('getConfigData', {
          vm: this,
          type: 5,
          strParams: strParams,
          setKey: 'configVolume',
        })
        .then(res => {
          // console.log('---res', res)
          // 判断是否是高中学段
          if (String(this.currSubject.periodCode) === '13') {
            res.forEach(item => {
              let currItem = {
                gradeCode: item.code,
                gradeName: item.name,
                volumeCode: item.code,
                volumeName: '',
              }
              classArrVom.push(currItem)
            })
            this.classData = classArrVom
          } else {
            res.forEach(item => {
              if (item.children && item.children.length) {
                item.children.forEach(value => {
                  // let currItem = { gradeCode: this.runCodeSplice(item.code, 1), gradeName: item.name, volumeCode: this.runCodeSplice(value.code, 2), volumeName: value.name }
                  let currItem = {
                    gradeCode: item.code,
                    gradeName: item.name,
                    volumeCode: value.code,
                    volumeName: value.name,
                  }
                  classArrVom.push(currItem)
                })
              }
            })
            this.classData = classArrVom
          }
        })
    },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.versionName
      this.teachCurrentCode = item.id
      this.gradeCurrentCode = ''
      this.gradeCurrentName = ''
      this.classData = item.gradeList.map(v => {
        return {
          gradeCode: v.grade,
          gradeName: v.gradeName,
          volumeCode: v.volume,
          volumeName: v.volumeName,
        }
      })
      this.volumeCurrentCode = ''
      this.volumeCurrentName = ''
      // this.getGradeCategoryId()
    },
    // 选择年级版本
    selectGrade(item) {
      this.gradeCurrentCode = item.gradeCode
      this.gradeCurrentName = item.gradeName
      this.volumeCurrentCode = item.volumeCode
      this.volumeCurrentName = item.volumeName

      this.checkNodeCodeLevel = ''
      this.checkNodeCode = ''
      // 重置数据
      this.bookText = {}
      // this.treeDataList = []
      this.visible = false
      // this.getPaperList(true) // 获取右侧栏数据
      // {"grade": "12121117", "volume": "121211171", "version": "121211"}
      let volume = {
        tCode: this.teachCurrentCode,
        gCode: this.gradeCurrentCode,
        vCode: this.volumeCurrentCode,
        tName: this.teachCurrentName,
        gName: this.gradeCurrentName,
        vName: this.volumeCurrentName,
      }
      setCookieSubjectVolume(this.currSubject, volume)
      // this.addChooseConfig(this.currSubject.subjectCode, {
      //   grade: item.gradeCode,
      //   volume: item.volumeCode,
      //   version: this.teachCurrentCode,
      // })
      // this.getRelationCategoryId()
      this.getList()
    },
    getList() {
      if (this.activeName == 1) {
        this.getPaperList()
      } else {
        this.getAllPaperList()
      }
    },
    getSideList() {
      // // console.log(this.typesList, 111)
      // if(this.typesList[this.activeName].length) return
      // let type = 10013
      // if(this.activeName == 3) {
      //   type += this.currSubject.periodCode - 10
      // }
      // let strParams = {
      //   stage: this.currSubject.periodCode,
      //   relationPaperScene: type,
      //   isKnowledge: 0,
      //   isSpecialSubject: 0,
      //   isSyncChapter: 0,
      //   parentId: 0,
      //   relationQuestionScene: 0,
      // }
      // this.apiGet({ urlPath: '/paper-builder/config/queryPaperType' }, strParams).then(res => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     const arr = res.data.map(v => {
      //       return {
      //         code: v.paperType,
      //         name: v.paperTypeName,
      //       }
      //     })
      //     this.typesList.splice(this.activeName, 1, arr)
      //   }
      // })
    },
    getGradesList() {
      // let params = {
      //   stage: this.currSubject.periodCode,
      //   subject: this.currSubject.subjectCode,
      // }
      // this.apiGet({ urlPath: '/paper-builder/config/getPaperScene' }, params).then(res => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     let arrData = []
      //     res.data.paperScene.forEach(item => {
      //       arrData.push({ 'code': item.id, 'name': item.name })
      //     })
      //     this.typesList.splice(1, 1, arrData)
      //   }
      // })
    },
    // 获取同步
    getPaperList() {
      // let params = {
      //   stage: this.currSubject.periodCode,
      //   subject: this.currSubject.subjectCode,
      //   version: this.teachCurrentCode ? this.teachCurrentCode : '',// 当前试卷版本
      //   grade: this.gradeCurrentCode || '', // 当前试卷年级
      //   volume: this.volumeCurrentCode,// 当前试卷册别
      //   pageNum: 1, // 当前试卷页数
      //   pageSize: 6, // 当前试卷每页条数
      //   sortType: 1, // 排序
      //   // catalog: this.currentSyncId[this.activeName],
      //   paperTypes: this.currentSyncId[this.activeName],
      // }
      try {
        let params = {
          pageNum: 1,
          pageSize: 10,
          lessonType: this.activeName,
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        console.log('params', params)
        this.apiGet(
          { urlPath: '/lesson-app/index/queryRecommendLessons' },
          params,
        ).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.treeDataList.splice(1, 1, res.data.records)
            console.log('获取推荐', res)
          }
        })
      } catch (error) {
        console.log('error', error)
      }
    },
    // 获取阶段，备考
    getAllPaperList() {
      if (this.treeDataList[this.activeName].length) return
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        // // grade: this.grade ? this.grade : '',
        // sortType: this.currSort, // 排序
        pageNum: 1, // 当前试卷页数
        pageSize: 10, // 当前试卷每页条数
        // paperTypes: this.currentSyncId[this.activeName],
        lessonType: this.activeName,
      }
      this.apiGet(
        { urlPath: '/lesson-app/index/queryRecommendLessons' },
        params,
        {
          needAbort: true,
        },
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.treeDataList.splice(this.activeName, 1, res.data.records)
        }
      })
    },
    formatTimestamp(value, type) {
      if (typeof value === 'number' || /^\d+$/.test(value)) {
        let timestamp = Number(value)

        if (timestamp.toString().length === 10) {
          timestamp *= 1000
        }

        const date = new Date(timestamp)
        if (type == 1) {
          return moment(date).format('YYYY-MM-DD')
        }
        if (isNaN(date.getTime())) {
          return value
        }

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      return value
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/css/variables.scss";
.sync-body {
  width: 100%;
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // padding: 20px 0;
    // border-bottom: 1px solid #eeeeee;
    img {
      margin-right: 10px;
    }
    .l {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      line-height: 59px;
    }
    .r {
      font-size: 14px;
      color: #666666;
      font-weight: normal;
      display: flex;
      align-items: center;
    }
  }
  .teach-name {
    @include textEllipsis();
    display: inline-block;
    margin-right: 10px;
    max-width: 200px;
    vertical-align: bottom;
  }
  .tabs {
    :deep(.el-tabs) {
      .el-tabs__nav {
        height: 50px;
      }

      .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap::after {
          content: none;
        }
        .el-tabs__active-bar {
          background: #487fff;
        }
        .el-tabs__item {
          font-size: 16px;
          &.is-active {
            color: #487fff;
            font-family: 600;
            font-size: 18px;
          }
        }
      }
    }
  }
}

.sync-change-icon {
  color: #4b8ff5;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
}

.sync-teach-content {
  display: flex;
  .paper-type {
    position: relative;
    width: 120px;
    height: 300px;
    padding-left: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    background: #ecf6fe;
    border-radius: 0px 0px 0px 6px;
    &::before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      width: 120px;
      height: 300px;
      background-image: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/b04fe432-05e1-4cf6-97a2-04706cb8808e.png);
      background-size: 120px 300px;
    }
    .paper-left-item {
      position: relative;
      width: 100px;
      height: 41px;
      // padding-right: 20px;
      box-sizing: border-box;
      line-height: 40px;
      cursor: pointer;
      user-select: none;
      text-align: center;
      .item-name {
        line-height: 40px;
        margin-top: 8px;
        font-size: 14px;
        color: #333333;
      }

      &.active {
        &::before {
          content: '';
          background-image: url('../../../assets/images/index/index-paper-circle.png');
          background-size: 8px 8px;
          width: 8px;
          height: 8px;
          display: block;
          position: absolute;
          top: -8px;
          right: 0;
          transform: rotate(180deg);
        }
        &::after {
          content: '';
          background-image: url('../../../assets/images/index/index-paper-circle.png');
          background-size: 8px 8px;
          width: 8px;
          height: 8px;
          display: block;
          position: absolute;
          top: 40px;
          right: 0;
          transform: rotate(90deg);
        }
        .item-name {
          background: #ffffff;
          border-radius: 23px 0px 0px 23px;
          color: $color-theme;
          font-weight: bold;
        }
      }
    }
  }
  .chapter-list {
    height: 240px;
    flex: 1;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 20px;
    column-gap: 60px;
    padding: 20px;
    grid-auto-rows: minmax(min-content, auto);
    .chapter-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border: none;
      background: none;
      word-spacing: normal;
      cursor: pointer;
      user-select: none;
      margin-bottom: 10px;
      &.chapter-item-special {
        margin-bottom: 0;
      }
      &.chapter-item-hover {
        &:nth-child(n + 3) {
          .paper-name::before {
            background: none;
          }
        }
      }
      .paper-name {
        position: relative;
        max-width: 86%;
        cursor: pointer;
        user-select: none;
        padding-left: 22px;
        &:hover {
          color: #487fff;
        }
      }
      .paper-name::before {
        position: absolute;
        content: '';
        display: inline-block;
        width: 14px;
        height: 21px;
        left: 0;
        top: 0;
      }
      &:hover {
        color: $color-theme;
      }
      .paper-sort-0::before {
        background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/bb2b4580-8f9d-4fd2-956a-886f28def936.png)
          no-repeat;
        background-size: 14px 21px;
      }
      // .paper-sort-1::before {
      //   background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/af1d4e1c-18ef-42ca-b693-0a953c66fa93.png)
      //     no-repeat;
      //   background-size: 14px 21px;
      // }
      // .paper-sort-2::before {
      //   background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/7cf42c85-d711-47e5-ad82-46fa4a7e79fe.png)
      //     no-repeat;
      //   background-size: 14px 21px;
      // }
      &:nth-child(n + 3) {
        .paper-name::before {
          left: 5px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #487fff;
          filter: drop-shadow(#487fff4d -4px 0);
        }
      }
      .paper-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        line-height: 18px;
        font-size: 13px;
        font-weight: normal;
        color: #333333;
      }
    }
    .flex {
      display: flex;
    }
    .chapter-item {
      .content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .paper-time {
          line-height: 18px;
          font-size: 13px;
          font-weight: normal;
          color: #999999;
          &:hover {
            color: #487fff;
          }
          i {
            margin-left: 4px;
            font-style: 14px;
          }
        }
        .view-count {
          display: inline-block;
          min-width: 50px;
          text-align: right;
        }
      }
    }
    .chapter-item-special {
      display: flex;
      height: fit-content;
      margin-bottom: 0;
      width: 100%;
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        //height: 72px;
        & > * {
          font-size: 12px;
          line-height: 18px;
          color: #8491a5;
        }
        .flex {
          display: flex;
        }
        .paper-tag {
          text-align: center;
          padding: 2px 8px;
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 12px;
          color: #487fff;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          // width: 40px;
          height: 20px;
          background: rgba(72, 127, 255, 0.1);
          border-radius: 2px 2px 2px 2px;
          margin-right: 16px;
        }
        .paper-time {
          .time:hover {
            color: #487fff;
          }
        }
        .common-data {
          & > div:hover {
            :last-child {
              color: #487fff;
            }
          }
          .num {
            color: #ff6900;
          }
          div > :last-child {
            margin-right: 16px;
          }
        }
      }
      .content > * {
        display: inline-block;
      }
      .paper-name {
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 13px;
        color: #333333;
      }
      .content > *:not(:first-child) {
        padding-left: 20px;
      }
      img {
        width: 60px;
        height: 72px;
      }
    }
  }
  .chapter-list1 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 60px;
  }

  .chapter-item {
    background-color: #f9f9f9;
    //padding: 10px;
    border: 1px solid #ddd;
  }

  .paper-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 18px;
    font-size: 13px;
    font-weight: normal;
    color: #333333;
  }

  .paper-name::before {
    position: absolute;
    content: '';
    display: inline-block;
    width: 14px;
    height: 21px;
    left: 0;
    top: 0;
  }
}
.synchronous-teaching-sign {
  position: relative;
  padding: 0 115px 0 0px;
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 112px;
    height: 30.5px;
    background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/d1a2a452-d8e9-49d8-810c-23da1a9a7a40.png)
      no-repeat;
    background-size: 112px 30.5px;
    right: 0;
    top: 14px;
  }
  .flex {
    display: flex;
  }
  .justify-center {
    justify-content: center;
  }
  .flex-start {
    align-items: flex-start;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease;
}
.expand-enter,
.expand-leave-to {
  height: 0;
  overflow: hidden;
}
.expand-enter-to,
.expand-leave {
  height: auto;
}
.name-info {
  display: flex !important;
  align-items: center;
  .paper-name {
    width: auto !important;
    max-width: 80% !important;
    overflow: hidden;
    white-space: break-spaces !important;
  }
  .paper-tag {
    align-self: start;
    margin: 0 8px;
    width: auto !important;
  }
}
</style>
