<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="user-content">
      <div class="user-content-left">
        <div
          class="user-content-left-route"
          :class="showFixed ? 'show-fixed' : ''"
          :style="{ height: pageInnerHeight + 'px' }"
        >
          <div class="header">
            <span
              v-if="teachCurrentName && gradeCurrentName"
              class="title"
            >
              <span
                v-if="currSubject && currSubject.periodCode == '13'"
                :title="teachCurrentName + '/' + gradeCurrentName"
              >{{ teachCurrentName }} / {{ gradeCurrentName }}</span>
              <span
                v-else
                class="title"
                :title="
                  teachCurrentName + '/' + gradeCurrentName + volumeCurrentName
                "
              >{{ teachCurrentName }} / {{ gradeCurrentName
              }}{{ volumeCurrentName }}</span>
            </span>
            <span v-else>请点击图标，选择教材</span>
            <el-popover
              v-model="visible"
              placement="bottom"
              popper-class="select-popper"
              width="800"
              trigger="click"
            >
              <p class="popper-text-d">
                教材版本
              </p>
              <div class="popper-category-content">
                <div
                  v-if="teachData.length"
                  class="category-list"
                >
                  <div
                    v-for="item in teachData"
                    :key="item.dictId"
                    class="category-item"
                    :class="
                      String(teachCurrentCode) === String(item.code)
                        ? 'active'
                        : ''
                    "
                    @click="selectBook(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <p
                  v-else
                  class="text-empty"
                >
                  暂无数据!
                </p>
              </div>
              <div class="pd10" />
              <div v-if="String(currSubject.periodCode) !== '13'">
                <p
                  v-show="classData.length"
                  class="popper-text-d"
                >
                  年级册
                </p>
                <div
                  v-show="classData.length"
                  class="popper-category-content"
                >
                  <div
                    v-if="classData.length"
                    class="category-list"
                  >
                    <div
                      v-for="(item, index) in classData"
                      :key="index"
                      class="category-item"
                      :class="
                        String(gradeCurrentCode) === String(item.gradeCode) &&
                          String(volumeCurrentCode) === String(item.volumeCode)
                          ? 'active'
                          : ''
                      "
                      @click="selectGrade(item)"
                    >
                      {{ item.gradeName }}{{ item.volumeName }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p
                  v-show="classData.length"
                  class="popper-text-d"
                >
                  册别
                </p>
                <div
                  v-show="classData.length"
                  class="popper-category-content"
                >
                  <div
                    v-if="classData.length"
                    class="category-list"
                  >
                    <div
                      v-for="(item, index) in classData"
                      :key="index"
                      class="category-item"
                      :class="
                        String(gradeCurrentCode) === String(item.gradeCode)
                          ? 'active'
                          : ''
                      "
                      @click="selectGrade(item)"
                    >
                      {{ item.gradeName }}
                    </div>
                  </div>
                </div>
              </div>
              <template #reference>
                <i class="iconfont iconqiehuan" />
              </template>
            </el-popover>
          </div>
          <div
            v-loading="treeLoading"
            class="content mytree"
            :style="{ height: pageInnerHeight - 50 + 'px' }"
          >
            <!--
              max_height500
              lazy"
              :load="loadNode" -->
            <el-tree
              ref="lemonTree"
              :data="treeDataList"
              :indent="0"
              :props="defaultProps"
              :check-strictly="checkStrictly"
              :highlight-current="true"
              :expand-on-click-node="false"
              :empty-text="treeNotMsg"
              :default-expanded-keys="openTreeKeys"
              icon-class="icon-expand el-icon-plus"
              node-key="chapterCode"
              @node-click="checkClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <span
                    class="tree-node-label"
                    :title="data.chapterName"
                    @click="handleRowClick(node, data)"
                  >
                    <span :title="data.chapterName">{{ data.chapterName }}</span>
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="user-content-right">
        <layered-homework
          v-if="showLayeredHomework"
          :teach-current-code="teachCurrentCode"
          :volume-current-code="volumeCurrentCode"
          :version-grade-code="gradeCurrentCode"
          :check-node-code-level="checkNodeCodeLevel"
          :check-node-code="checkNodeCode"
        />
        <item-two
          v-else
          :teach-current-code="teachCurrentCode"
          :volume-current-code="volumeCurrentCode"
          :version-grade-code="gradeCurrentCode"
          :check-node-code-level="checkNodeCodeLevel"
          :check-node-code="checkNodeCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import {
  isLogin,
  setCookieSubjectVolume,
  getCookieSubjectVolume,
} from '@/common/js/util'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import LayeredHomework from './components/layered-homework'
import ItemTwo from './two-selection'
import windowScrollResetMixin from '@/common/mixins/windowScrollResetMixin'

export default {
  components: {
    Breadcrumb,
    ItemTwo,
    LayeredHomework,
  },
  mixins: [windowScrollResetMixin],
  computed: {
    ...mapState(['currSubject', 'userInfo']),
    tabActiveName() {
      return 'first'
    },
    showLayeredHomework() {
      // 121211
      if (
        this.currSubject.subjectCode == '1212' &&
        this.teachCurrentCode === '121211'
      ) {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      checkStrictly: false,
      treeLoading: false,
      questionId: '',
      questionDome: '',
      questionVisible: false,
      visible: false,
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '章节选题 ',
        },
        {
          path: '',
          isLink: false,
          text: '同步试题 ',
        },
      ],
      teachData: [],
      teachCurrentCode: '',
      teachCurrentName: '',
      classData: [],
      gradeCurrentCode: '',
      gradeCurrentName: '',
      volumeCurrentCode: '',
      volumeCurrentName: '',
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: 'chapterName',
      },
      treeDataList: [],
      bookText: {},
      bookId: '',
      checkNodeCodeLevel: '',
      checkNodeCode: '',
      hasChapterChild: true,
      treeNotMsg: '暂无数据',
      openTreeKeys: [],
      defaultChapterCode: '',
      showFixed: false,
      pageInnerHeight: 400,
    }
  },

  watch: {
    currSubject(val, old) {
      this.getBookCategoryId()
      this.treeDataList = [] // 自控章节选题
      this.bookText = {}
    },
    userInfo(v) {
      // 监听 userInfo 才会 访问
      this.getDefaultBookToBack() // 获取基本学段学科信息
    },
  },
  mounted() {
    if (this.currSubject && this.currSubject.subjectCode) {
      this.getBookCategoryId()
    }
    this.renderScrollFixed()
  },
  created() {
    let query = this.$route.query
    this.activeName = this.tabActiveName
    if (query.chapter) {
      this.defaultChapterCode = query.chapter
    }
    this.getDefaultBookToBack() // 获取基本学段学科信息

    this.initWindowsEvent()
  },
  unmounted() {
    this.destroyedWindowsEvent()
  },
  methods: {
    renderScrollFixed(e) {
      let comparisonTop = this.getPageScrollTop()
      let offsetTop =
        this.offsetDis(document.querySelector('.user-content-left')).top - 50
      if (offsetTop > 0) {
        if (comparisonTop >= offsetTop) {
          this.showFixed = true
        } else {
          this.showFixed = false
        }
      }

      let bottomOffset =
        document.body.scrollHeight - window.innerHeight - comparisonTop - 210

      if (bottomOffset > 0) {
        this.pageInnerHeight = Math.max(550, window.innerHeight - 50)
      } else {
        this.pageInnerHeight = Math.max(
          550,
          window.innerHeight - 50 + bottomOffset,
        )
      }
      // console.log(offsetTop, bottomOffset, this.pageInnerHeight, 600)
    },
    runCodeSplice(str, type) {
      // type; 1 切割首两位和末尾两位， 2 切割最后一位
      const strMo = str.toString()
      const disLength = strMo.length
      var res = ''
      if (type === 1) {
        res =
          strMo.substring(0, 2) + '' + strMo.substring(disLength - 2, disLength)
      } else {
        res = strMo.substring(disLength - 1, disLength)
      }
      return res
    },
    // 获取教材版本列表
    getBookCategoryId() {
      let strParams = {
        periodCode: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
      }
      this.$store
        .dispatch('getConfigData', {
          vm: this,
          type: 4,
          strParams: strParams,
          setKey: 'configVersionList',
        })
        .then(res => {
          let bookArr = res
          this.teachData = bookArr
        })
    },

    // 获取全品AI教研云后台的默认学段学科
    getDefaultBookToBack() {
      if (isLogin()) {
        if (!this.userInfo.userGuid) return
      } else {
        // 看缓存 里面有没有
        let currS = getCookieSubjectVolume(this.currSubject.subjectCode)
        if (currS && currS.volume) {
          this.teachCurrentName = currS.volume.tName
          this.volumeCurrentName = currS.volume.vName
          this.gradeCurrentName = currS.volume.gName
          this.teachCurrentCode = currS.volume.tCode
          this.gradeCurrentCode = currS.volume.gCode
          this.volumeCurrentCode = currS.volume.vCode

          this.getGradeCategoryId(this.teachCurrentCode) // 获取年级
          this.getPaperList() // 获取右侧栏数据
          return
        }
      }

      let strParams = {
        periodCode: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
      }
      this.getInvokeData(3, strParams, this.userInfo.userGuid || '').then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let codeObj = res.data.paramValue
            this.teachCurrentName = res.data.textbookVersionName
            this.volumeCurrentName = res.data.volumeName
            this.gradeCurrentName = res.data.gradeName
            this.teachCurrentCode = codeObj.textbookVersionCode
            this.gradeCurrentCode = codeObj.gradeCode
            this.volumeCurrentCode = codeObj.volumeCode

            this.getGradeCategoryId(codeObj.textbookVersionCode) // 获取年级
            this.getPaperList() // 获取右侧栏数据
          } else {
            return null
          }
        },
      )
    },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.name
      this.teachCurrentCode = item.code
      this.gradeCurrentCode = ''
      this.gradeCurrentName = ''
      this.classData = []
      this.volumeCurrentCode = ''
      this.volumeCurrentName = ''

      this.checkNodeCodeLevel = ''
      this.checkNodeCode = ''
      this.bookId = ''
      this.getGradeCategoryId()
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
      this.treeDataList = []
      this.visible = false
      this.getPaperList(true) // 获取右侧栏数据
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
      this.addChooseConfig(this.currSubject.subjectCode, {
        grade: item.gradeCode,
        volume: item.volumeCode,
        version: this.teachCurrentCode,
      })
    },
    // 获取侧边栏数据
    getPaperList(flag) {
      // type=6&strParams={"stage":"13","subject":"1312","versions":"131238","grade":"13123841","volume":"0"}
      let strParams = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        versions: this.teachCurrentCode,
        grade: this.gradeCurrentCode,
        volume: this.volumeCurrentCode ? this.volumeCurrentCode : '0',
      }
      if (this.currSubject.periodCode == '13') {
        strParams.volume = '0'
      }
      if (
        strParams.stage &&
        strParams.subject &&
        strParams.versions &&
        strParams.grade
      ) {
        this.$store
          .dispatch('getConfigData', {
            vm: this,
            type: 6,
            strParams: strParams,
            setKey: 'configBookText',
            isUpdate: flag,
          })
          .then(res => {
            if (res) {
              if (res && res.bookText) {
                this.bookText = res.bookText
                this.bookId = res.bookText.id + ''
              } else {
                this.bookId = ''
              }
              if (res && res.chapters) {
                //  设置 level
                let chaptersList = this.setTreeLevel(res.chapters)
                // 只显示 第一层 和 最后层
                this.treeDataList = this.getFirstAndFinal(chaptersList)
                this.executeDefaultChapter()
              } else {
                this.treeDataList = []
                this.executeDefaultChapter()
              }
              this.treeLoading = false
            } else {
              this.treeLoading = false
              this.treeDataList = []
              this.executeDefaultChapter()
            }
          })
      }
    },
    executeDefaultChapter() {
      // 选择第一个章节 并且 张开第一个章节
      let data = null
      if (this.defaultChapterCode) {
        data = this.treeDataList.find(
          item => item.chapterCode == this.defaultChapterCode,
        )
        this.defaultChapterCode = ''
      }
      if (!data) {
        data = this.treeDataList[0]
      }
      if (data) {
        this.checkNodeCodeLevel = data.level + ''
        this.checkNodeCode = data.chapterCode + ''
        this.hasChapterChild = data.hasChild

        this.openTreeKeys = [data.chapterCode]

        this.$nextTick(() => {
          if (this.$refs.lemonTree) {
            this.$refs.lemonTree.setCurrentKey(data.chapterCode)
          }
        })
      } else {
        this.checkNodeCodeLevel = ''
        this.checkNodeCode = ''
      }
    },
    // 点击行的选中状态
    handleRowClick(node, data) {
      // console.log('handleRowClick', data)
      this.checkNodeCodeLevel = data.level + ''
      this.checkNodeCode = data.chapterCode + ''
      this.hasChapterChild = data.hasChild

      // this.checkClick() // 调用获取题目接口
    },
    // 点击复选框
    checkClick(data, isChecked, node) {
      console.log(data)
      this.checkNodeCodeLevel = data.level + ''
      this.checkNodeCode = data.chapterCode + ''
      this.hasChapterChild = data.hasChild
    },
    // 懒加载子集
    handleClick(tab, event) {
      this.$router.push({
        path: '/paper/chapter/selection',
        query: { tabActiveName: tab.name },
      })
      this.crumbsData[1].text = tab.label
    },
  },
}
</script>
<style lang="scss" scoped>
.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 50px;
  display: flex;
  .user-content-left {
    width: 270px;
    margin-right: 16px;
    .user-content-left-route {
      background-color: $color-white;
      width: 270px;
      &.show-fixed {
        position: fixed;
        top: 50px;
      }
      .header {
        height: 48px;
        line-height: 48px;
        padding: 0 14px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        border-bottom: 1px solid $color-background-l;
        position: relative;
        box-sizing: border-box;
        .title {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 200px;
        }
        i {
          position: absolute;
          right: 14px;
          cursor: pointer;
          color: $color-theme;
        }
      }
      .content {
        padding: 17px 14px 17px 0;
        overflow-y: auto;
        width: 270px;
        box-sizing: border-box;
      }
    }
  }
  .user-content-right {
    width: 914px;
    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
      background-color: $color-white;
    }
    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item) {
      font-size: 15px;
      font-weight: bold;
      background-color: F4F8FF;
      width: 120px;
      padding: 0;
      text-align: center;
    }
    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
      height: 3px;
    }
    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
      background-color: #f4f8ff;
    }
  }
}

.max_height500 {
  max-height: 500px;
  overflow-y: auto;
}
</style>
