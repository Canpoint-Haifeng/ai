<template>
  <div class="content-container">
    <!-- <breadcrumb :crumbsData="crumbsData"></breadcrumb> -->
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="header">
            <span
              v-if="teachCurrentCode && order === '0'"
              class="title"
            >
              <span
                v-if="currSubject && currSubject.periodCode == '13'"
                :title="teachCurrentName + '/' + gradeCurrentName"
              >{{ teachCurrentName }} / {{ gradeCurrentName
              }}</span>
              <span
                v-else
                class="title"
                :title="teachCurrentName + '/' + gradeCurrentName + volumeCurrentName
                "
              >{{ teachCurrentName }} / {{ gradeCurrentName
              }}{{ volumeCurrentName }}</span>
            </span>
            <span
              v-else
              class="title-icon"
            ><span class="icon iconfont icon-ximubiao" /> {{ itemData.name }}</span>
            <el-popover
              v-if="order === '0'"
              v-model="visible"
              placement="bottom"
              popper-class="select-popper"
              width="800"
              trigger="click"
            >
              <p class="popper-text-d">
                版本
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
                    :class="String(teachCurrentCode) === String(item.code)
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
                  年级
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
                      :class="String(volumeCurrentCode) === String(item.volumeCode)
                        ? 'active'
                        : ''
                      "
                      @click="selectGrade(item)"
                    >
                      {{ item.volumeName }}
                    </div>
                  </div>
                </div>
              </div>
              <template #reference>
                <i class="iconfont icon-transfer_line" />
              </template>
            </el-popover>
          </div>
          <div
            v-loading="treeLoading"
            class="content mytree-special"
          >
            <!--
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
              node-key="code"
              @node-click="onNodeClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <span
                    class="tree-node-label"
                    :title="data.name"
                    @click="handleRowClick(node, data)"
                  >
                    <span :title="data.name">{{ data.name }}</span>
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="user-content-right">
        <item-one
          :paper-scene-type="itemData.paperSceneType"
          :teach-current-code="teachCurrentCode"
          :volume-current-code="volumeCurrentCode"
          :version-grade-code="gradeCurrentCode"
          :check-node-code="checkNodeCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { isLogin } from '@/common/js/util'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import ItemOne from './one-selection'
import { paperTypeConfig } from '@/common/config/tikuCfg'

export default {
  components: {
    Breadcrumb,
    ItemOne,
  },
  props: {
    order: {
      type: String,
      default() {
        return '0'
      }
    },
    itemData: {
      type: Object,
    }
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
      checkNodeCode: '',
      hasChapterChild: true,
      treeNotMsg: '暂无数据',
      openTreeKeys: [],
    }
  },
  computed: {
    ...mapState(['currSubject', 'userInfo']),
    tabActiveName() {
      return 'first'
    },
  },
  watch: {
    currSubject(val, old) {
      // this.treeDataList = [] // 自控章节选题
      // this.bookText = {}
      if (this.$route.query.type && this.$route.query.type !== '0') {
        this.getRelationCategoryId()
      } else {
        this.getBookCategoryId()
      }
    },
    $route: {
      handler(newUrl, oldUrl) {
        this.checkNodeCode = ''
        let type = newUrl.query.type ? newUrl.query.type : '0'
        if (type !== '0') {
          this.getRelationCategoryId()
        } else {
          this.getBookCategoryId()
        }
      }
    },
    // itemData: {
    //   handler(newVal, oldVal) {
    //     this.getBookCategoryId()
    //   },
    //   deep: true,
    // },
    userInfo(v) {
      // 监听 userInfo 才会 访问
    },
  },
  created() {
    this.activeName = this.tabActiveName
    if (this.$route.query.type && this.$route.query.type !== '0') {
      this.getRelationCategoryId()
    } else {
      this.getBookCategoryId()
    }
  },
  methods: {
    runCodeSplice(str, type) {
      // type; 1 切割首两位和末尾两位， 2 切割最后一位
      const strMo = str.toString()
      const disLength = strMo.length
      var res = ''
      if (type === 1) {
        res =
          strMo.substring(0, 2) +
          '' +
          strMo.substring(disLength - 2, disLength)
      } else {
        res = strMo.substring(disLength - 1, disLength)
      }
      return res
    },
    // 获取教材版本列表
    getBookCategoryId() {
      let strParams = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/lesson-app/config/getInvokeInfo' }, strParams).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrData = []
          let gradeData = []
          res.data.forEach(item => {
            arrData.push({
              'code': item.id + '',
              'name': item.name,
              'gradeList': item.gradeList
            })
          })
          res.data[0].gradeList.forEach(item => {
            gradeData.push({
              'gradeCode': item.gradeId,
              'gradeName': item.gradeName,
              'volumeCode': item.gradeId + '-' + item.volumeId,
              'volumeName': item.volumeName
            })
          })
          this.teachData = arrData
          this.teachCurrentCode = this.teachData[0].code
          this.teachCurrentName = this.teachData[0].name
          this.classData = gradeData
          this.volumeCurrentCode = this.classData[0].volumeCode
          this.volumeCurrentName = this.classData[0].volumeName
          this.getChapter()
        }
      })
    },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.name
      this.teachCurrentCode = item.code
      let arrData = []
      this.teachData.forEach(teachItem => {
        if (item.code === teachItem.code) {
          teachItem.gradeList.forEach(gradeItem => {
            arrData.push({
              'gradeCode': gradeItem.gradeId,
              'gradeName': gradeItem.gradeName,
              'volumeCode': gradeItem.gradeId + '-' + gradeItem.volumeId,
              'volumeName': gradeItem.volumeName
            })
          })
        }
      })
      this.classData = arrData
      this.volumeCurrentCode = arrData[0].volumeCode
      this.volumeCurrentName = arrData[0].volumeName
      this.getChapter()
    },
    // 选择年级版本
    selectGrade(item) {
      this.volumeCurrentCode = item.volumeCode
      this.volumeCurrentName = item.volumeName

      // 重置数据
      this.bookText = {}
      this.visible = false
      this.getChapter()
    },
    getChapter() {
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      const params = {
        catalogueType: 10,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        grade: this.volumeCurrentCode.split('-')[0],
        version: this.teachCurrentCode,
        volume: this.volumeCurrentCode.split('-')[1],
      }
      this.apiGet(url, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.treeDataList = [{
            code: 0,
            name: '全部',
          }, ...res.data.map(v => {
            v.code = v.uuid
            return v
          })]
        } else {
          this.treeDataList = [{
            code: 0,
            name: '全部',
          }]
        }
      })
    },
    // 获取侧边栏数据
    getPaperList(flag) {
      this.getRelationCategoryId()
    },
    getTreeData(data) {
      return data.map(item => {
        if (item.childList) {
          return {
            code: item.paperType,
            name: item.paperTypeName,
            children: this.getTreeData(item.childList),
          }
        } else {
          return {
            code: item.paperType,
            name: item.paperTypeName,
            children: null,
          }
        }
      })
    },
    // 获取当前学段试卷类型关联id
    getRelationCategoryId() {
      // console.log(this.itemData)
      // // 通过配置获取类型
      // let strParams = {
      //   stage: this.currSubject.periodCode,
      //   relationPaperScene: this.itemData.paperSceneType,
      //   isKnowledge: 0,
      //   isSpecialSubject: 0,
      //   isSyncChapter: 0,
      //   parentId: 0,
      //   relationQuestionScene: 0,
      // }
      // this.apiGet({ urlPath: '/paper-builder/config/queryPaperType' }, strParams).then(res => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     this.treeDataList = [{
      //       code: 0,
      //       name: '全部试卷类型',
      //     }, ...this.getTreeData(res.data)]
      //   }
      // })
    },
    // 获取当前学段试卷类型
    getTypesList(relationCategoryId) {
      if (!relationCategoryId) {
        return
      }
      let parms = {
        categoryId: relationCategoryId,
        level: '1,2',
      }
      this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrData = res.data
          this.treeDataList = [
            {
              code: '',
              name: '全部试卷类型',
            },
            ...arrData,
          ]
          let data = this.treeDataList[0]
          this.openTreeKeys = [data.code]
          nextTick(() => {
            const lemonTree = this.$refs.lemonTree
            if (lemonTree) {
              lemonTree.setCurrentKey(data.code)
            }
          })
        }
      })
    },
    // 点击行的选中状态
    handleRowClick(node, data) {
      console.log(data);

      this.checkNodeCode = data.code
    },
    // 点击复选框
    onNodeClick(data) {
      this.checkNodeCode = data.code
    },
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
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 20px;
  display: flex;

  .user-content-left {
    width: 270px;
    margin-right: 16px;

    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;

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

        .title-icon {
          color: $color-theme;
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
      }
    }
  }

  .user-content-right {
    width: 914px;

    :deep(.el-tabs .el-tabs__header)) {
      padding: 0 20px;
      background-color: $color-white;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item)) {
      font-size: 15px;
      font-weight: bold;
      background-color: F4F8FF;
      width: 120px;
      padding: 0;
      text-align: center;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar)) {
      background-color: $color-theme;
      height: 3px;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active)) {
      color: $color-theme;
      background-color: #f4f8ff;
    }
  }
}

.mytree-special {
  max-height: 500px;
  overflow-y: auto;
}
</style>
