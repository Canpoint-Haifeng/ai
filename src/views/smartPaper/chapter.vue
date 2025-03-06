<template>
  <div class="div_knowPreview content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="header">
            <div v-if="teachCurrentName && gradeCurrentName">
              <span v-if="currSubject && currSubject.periodCode == '13'">{{ teachCurrentName }} / {{ gradeCurrentName }}</span>
              <span v-else>{{ teachCurrentName }} / {{ gradeCurrentName }}</span>
            </div>
            <span v-else>请点击图标，选择教材</span>
            <el-popover
              :visible="visible" @update:visible="$emit('update:visible', $event)"
              style="height: 16px;"
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
                      String(gradeCurrentCode) === String(item.code)
                        ? 'active'
                        : ''
                    "
                    @click="selectGrade(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <template #reference>
                <i class="iconfont icon-transfer_line" />
              </template>
            </el-popover>
          </div>
          <div class="header-top">
            <p class="title_border">
              选择知识点
            </p>
            <span
              class="span_text"
              @click="deleteAll"
            >重置</span>
          </div>
          <div
            v-loading="treeLoading"
            class="content mytree"
          >
            <el-tree
              ref="lemonTree"
              :data="treeDataList"
              :indent="0"
              :props="defaultProps"
              :highlight-current="true"
              class="custom-tree-content"
              empty-text="暂无数据"
              icon-class="icon-expand el-icon-plus"
              check-on-click-node
              show-checkbox
              node-key="id"
              :filter-node-method="filterNode"
              :default-expanded-keys="expandedKeys"
              @node-click="checkClick"
            >
              <template #default="{ data, node }">
                <div class="custom-tree-node">
                  <span
                    class="tree-node-label"
                    :class="{ 'node-selected': node.checked }"
                  >
                    <span
                      v-if="data.types == 1"
                      class="knowledge"
                      :style="{ color: colors[Math.ceil(data.importance)].color }"
                    >知</span>

                    <i
                      v-if="data.importance && data.types === 2"
                      class="el-icon-star-on coefficient"
                      :style="{ color: colors[Math.ceil(data.importance)].color }"
                    ><span
                      class="tooltip-text"
                      :style="{
                        background: colors[Math.ceil(data.importance)].color,
                      }"
                    >{{ colors[Math.ceil(data.importance)].name }}</span></i></span>
                </div>
              </template>

              <span
                class="nodeName"
                :style="{
                  cursor: node.level == 1 ? 'not-allowed' : 'pointer',
                  color: node.checked ? '#487fff' : '#606266',
                }"
                :title="data.name"
                v-html="data.name"
              />
              </span>
              <b
                v-if="data.types === 2"
                :class="[
                  'icon',
                  'el-icon-circle-check',
                  { ischeck: node.checked },
                ]"
              />
            </el-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
            </el-tree>

            <!-- <el-tree
              :data="treeDataList"
              :indent="0"
              :props="defaultProps"
              show-checkbox
              empty-text="暂无数据"
              icon-class="icon-expand el-icon-plus"
              ref="lemonTree"
              check-on-click-node
              @check="checkClick"
              node-key="id"
              :expand-on-click-node="false"
              >
              <div class="custom-tree-node" v-slot:{ data }">
                <span class="tree-node-label">
                    <span class="knowledge" v-if="data.types == 1" :style="{color: colors[Math.ceil(data.importance)].color}">知</span>
                    <i v-if="data.importance && data.types === 2" class="el-icon-star-on coefficient" :style="{color: colors[Math.ceil(data.importance)].color}"></i></template>
                    <span class="nodeName" :title="data.name" v-html="data.name"></span>
                </span>
              </div>
            </el-tree> -->
            <!-- <el-tree
              :data="treeDataList"
              :indent="0"
              show-checkbox
              :props="defaultProps"
              :check-strictly="checkStrictly"
              :highlight-current="true"
              :expand-on-click-node="false"
              :empty-text="treeNotMsg"
              icon-class="icon-expand el-icon-plus"
              ref="lemonTree"
              @check="checkClick"
              node-key="chapterCode"
            >
              <div class="custom-tree-node" v-slot:{ node, data }">
                <span
                  class="tree-node-label"
                  :title="data.chapterName"
                  @click="handleRowClick(node, data)"
                >
                  <span :title="data.chapterName">{{ data.chapterName }}</span>
                </span>
              </div>
            </el-tree> -->
          </div>
        </div>
      </div>
      <div class="user-content-right min-height750">
        <item-one
          ref="smartGenerate"
          :is-chapter="true"
          :cache="cache"
          :curr-scence="currScence"
          @delete-all="deleteAll"
          @del-parent="delParent"
          @del-children="delChildren"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import {
  isLogin,
  setCookieSubjectVolume,
  getCookieSubjectVolume,
} from '@/common/js/util'
import ItemOne from '@/views/smartPaper/components/one-selection-knowledge'
import merge from 'webpack-merge'
import { delCatalogueTypeByTree } from '@/common/js/util'
export default {
  name: 'Chapter',
  components: { ItemOne },
  beforeRouteEnter(to, form, next) {
    if (form.path === '/smartpaper/paperView') {
      next(vm => {
        vm.cache = true
      })
    } else {
      next(vm => {
        vm.cache = false
        vm.selectData = []
        vm.deleteAll()
        sessionStorage.removeItem('questionParams')
      })
    }
  },
  data() {
    return {
      advanced: false,
      colors: [
        {},
        { name: '非常重要', color: '#ed7764' },
        { name: '非常重要', color: '#ed7764' },
        { name: '重要', color: '#ef8944' },
        { name: '一般', color: '#f4bd41' },
        { name: '不重要', color: '#999' },
      ],
      checkStrictly: false,
      treeLoading: false,
      questionId: '',
      questionDome: '',
      questionVisible: false,
      nickName: 'Smile',
      visible: false,
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '智能选题',
        },
        {
          path: '',
          isLink: false,
          text: '按章节',
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
        disabled: (data, node) => {
          return node.level == 1
        },
      },
      bookText: {},
      treeDataList: [],
      treeNotMsg: '暂无数据',
      currentNodeCodeChapter: null,
      currScence: {},
      scenceList: [],
      cache: false,
      selectData: [],
      queue: [],
      expandedKeys: [],
    }
  },
  watch: {
    currSubject(n, o) {
      if (n.periodCode === o.periodCode && n.subjectCode === o.subjectCode)
        return
      this.getBookCategoryId()
      this.treeDataList = [] // 自控章节选题
    },
    // userInfo(v) {
    //   // 监听 userInfo 才会 访问
    //   this.getDefaultBookToBack() // 获取基本学段学科信息
    // },
  },
  activated() {
    if (!this.cache) {
      // this.getTreeDataList() // 获取侧边栏数据
      this.$refs.lemonTree.store._getAllNodes().map(n => (n.expanded = false))
    }
  },
  deactivated() {},
  computed: {
    ...mapState(['currSubject', 'userInfo']),
    tabActiveName() {
      return this.$route.query.tabActiveName
        ? this.$route.query.tabActiveName
        : 'first'
    },
  },
  mounted() {
    if (this.currSubject && this.currSubject.subjectCode) {
      this.getBookCategoryId()
    }
  },
  created() {
    this.activeName = this.tabActiveName
    // this.getDefaultBookToBack() // 获取基本学段学科信息
  },
  methods: {
    changeCurrScence(item) {
      if (this.advanced) {
        return this.$message.warning(
          '高级设置不支持切换场景，请在普通设置中修改',
        )
      }
      this.currScence = item
      this.checkClick()
      // this.$refs.lemonTree.filter();
    },
    filterNode(v, data) {
      return !(
        data.types === 2 &&
        [100197, 100198].includes(this.currScence.paperTypeId)
      )
    },
    // 获取教材版本列表
    async getBookCategoryId() {
      const url = { urlPath: '/lesson-app/config/getInvokeInfo' }
      const params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        if (res.data.length) {
          // 帮后端处理数据
          this.teachData = res.data[0].children
          const i = 0
          let item
          let child
          if (i !== -1) {
            item = this.teachData[i]
            child = this.teachData[i].children
          } else {
            item = this.teachData[0]
            child = this.teachData[0].children
          }
          this.teachCurrentCode = item.code
          this.classData =
            child &&
            child.map(v => {
              return {
                code: v.code,
                name: v.name,
              }
            })
          const data = this.classData[0]
          this.gradeCurrentCode = data.code
          this.teachCurrentName = item.name
          this.gradeCurrentName = data.name
          this.getChapter()
          this.changeGradeAndVolume()
        }
      } else {
        this.$message.error(res.msg)
      }
    },

    // 版本册别变了之后
    changeGradeAndVolume() {
      console.log('this.refs', this.$refs)
      console.log('this.refs', this.$refs.smartGenerate)

      this.$refs.smartGenerate.versionCode =
        this.teachCurrentCode && this.teachCurrentCode
      this.$refs.smartGenerate.volumeCode =
        this.gradeCurrentCode && this.gradeCurrentCode
      this.$refs.smartGenerate.gradeCode =
        this.gradeCurrentCode && this.gradeCurrentCode
      this.$refs.smartGenerate.versionName =
        this.teachCurrentName && this.teachCurrentName
      this.$refs.smartGenerate.volumeName =
        this.gradeCurrentName && this.gradeCurrentName
      this.$refs.smartGenerate.gradeName =
        this.gradeCurrentName && this.gradeCurrentName
    },
    async getChapter() {
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      const params = {
        catalogueType: 10,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        // grade: this.gradeCurrentCode,
        version: this.teachCurrentCode,
        volume: this.gradeCurrentCode,
      }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        const list = res.data || []
        const loop = arr => {
          arr.forEach(v => {
            v.id = v.uuid
            v.isKnowledge = v.types === 1
            v.children && loop(v.children)
          })
        }
        loop(list)
        this.treeDataList = list
        this.expandedKeys = this.treeDataList.map(v => v.uuid)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.name
      this.teachCurrentCode = item.code
      this.gradeCurrentCode = item.children[0].code
      this.gradeCurrentName = item.children[0].name
      this.classData = item.children.map(v => {
        return {
          code: v.code,
          name: v.name,
        }
      })
      this.changeGradeAndVolume()
    },
    // 选择年级版本
    selectGrade(item) {
      this.gradeCurrentCode = item.code
      this.gradeCurrentName = item.name
      // 重置数据
      this.bookText = {}
      this.treeDataList = []
      this.visible = false
      this.getChapter()
      this.changeGradeAndVolume()
    },
    // 点击行的选中状态
    handleRowClick(node, data) {
      node.checked = !node.checked
      if (node.checked) {
        this.$refs['lemonTree'].setChecked(node, true, true)
      } else {
        this.$refs['lemonTree'].setChecked(node, false, true)
      }
      this.checkClick() // 调用获取题目接口
    },
    // 点击复选框选中事件
    // checkClick(data, isChecked) {
    //   let noMore = this.getSimpleCheckedNodes(this.$refs['lemonTree'].store)
    //   this.currentNodeCodeChapter = noMore
    // },
    handleClick(tab, event) {
      this.$router.push({
        query: merge(this.$route.query, { tabActiveName: tab.name }),
      })
      this.crumbsData[1].text = tab.label
    },
    // 全部清空知识点
    deleteAll() {
      this.$refs['lemonTree'].setCheckedKeys([])
      this.$refs['lemonTree'].setCurrentKey(null)
      this.checkClick()
    },
    delParent(node) {
      this.$refs['lemonTree'].setChecked(node.id, false, true)
      this.checkClick()
    },
    // 单个删除
    delChildren(node) {
      this.$refs['lemonTree'].setChecked(node.id, false, true)
      this.checkClick()
    },
    // 复选框点击
    checkClick() {
      this.selectData = []
      const testType = this.currScence.testType
      let nodes = this.getSimpleCheckedNodes(this.$refs['lemonTree'].store)
      // let nodes = this.$refs['lemonTree'].getCheckedNodes()
      console.log(nodes, 'nodes')
      nodes.forEach(v => {
        const node = this.$refs.lemonTree.getNode(v.id)
        if ([100197, 100198].includes(this.currScence.paperTypeId)) {
          // 大考
          if (v.level < 3) {
            v.children.forEach(c => {
              const sNode = this.$refs.lemonTree.getNode(c.id)
              this.examTransform(sNode.parent, sNode)
            })
          } else {
            this.examTransform(node.parent, node)
          }
          // this.examTransform(node.parent, node)
        } else {
          // 普通
          const flag = this.transformNode(node.parent, node)
          if (!flag && v.children && v.children.length) {
            this.queue.push(...v.children)
            this.findDown()
          }
        }
      })
      this.Bus.$emit('interCheckNodeCodeKnowledge', this.selectData)
    },
    findDown() {
      while (this.queue.length !== 0) {
        const data = this.queue.shift()
        if (data.isKnowledge) {
          const index = this.selectData.findIndex(v => v.id === data.id)
          const cNode = { ...data, selChildren: data.children || [] }
          if (index !== -1) {
            if (data.children) {
              this.selectData[index].selChildren.push(data.children)
            }
          } else {
            this.selectData.push(cNode)
          }
        } else {
          if (data.children && data.children.length) {
            this.queue.unshift(...data.children)
          }
        }
      }
    },
    transformNode(pNode, node) {
      const data = node.data
      const pData = pNode.data
      if (Array.isArray(pData)) {
        // this.$message.error('当前节点上没有知识点')
        return false
      }
      if (data.isKnowledge) {
        const cNode = { ...data, selChildren: data.children || [] }
        this.selectData.push(cNode)
        return true
      } else if (pData.isKnowledge) {
        const index = this.selectData.findIndex(v => v.id === pData.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...pData, selChildren: [data] }
          this.selectData.push(p)
        }
        return true
      } else {
        return this.transformNode(pNode.parent, node)
      }
    },
    // findDown(data) {
    //   if (data.isKnowledge) {
    //     const index = this.selectData.findIndex(v => v.id === data.id)
    //     const cNode = { ...data, selChildren: data.children || [] }
    //     if (index !== -1) {
    //       if (data.children) {
    //         this.selectData[index].selChildren.push(data.children)
    //       }
    //     } else {
    //       this.selectData.push(cNode)
    //     }
    //   } else {
    //     if (data.children) {
    //       data.children.forEach(v => {
    //         this.findDown(v)
    //       })
    //     }
    //   }
    // },
    examTransform(pNode, node) {
      const data = node.data
      const pData = pNode.data
      if (Array.isArray(pData)) {
        this.$message.error('当前节点上没有知识点')
        return false
      }
      if (data.isKnowledge) {
        const index = this.selectData.findIndex(v => v.id === pData.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...pData, selChildren: [data] }
          this.selectData.push(p)
        }
      } else if (pData.isKnowledge) {
        const aNode = pNode.parent.data
        const index = this.selectData.findIndex(v => v.id === aNode.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...aNode, selChildren: [data] }
          this.selectData.push(p)
        }
      } else {
        this.examTransform(pNode.parent, node)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
<style lang="scss">
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.content-container {
  margin-top: 12px;
}
.coefficient {
  position: relative;
  &:hover {
    .tooltip-text {
      display: block !important;
    }
  }
  .tooltip-text {
    position: absolute;
    color: #fff;
    display: none;
    z-index: 99999;
    padding: 0 4px;
    border-radius: 2px;
    font-size: 12px;
    right: -45px;
    top: -2px;
    line-height: 20px;
    height: 18px;
  }
}
.div_header {
  padding: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  margin: 12px 0px 12px 286px;
  min-height: 56px;
  box-sizing: border-box;

  .itemWrap {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
  }

  .span_text {
    width: 80px;
    min-width: 70px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    position: relative;
    cursor: pointer;

    :deep(.scsne_tip) {
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: 11px;
      border-radius: 50%;
      color: #ff0000;
    }
  }

  .div_item {
    padding: 0px 20px;
    box-sizing: border-box;
    margin-right: 10px;
    position: relative;
    flex: 0 1 auto;

    &::after {
      content: '';
      width: 0px;
      height: 20px;
      border: 1px solid #eeeeee;
      position: absolute;
      right: -2px;
      top: 7px;
    }

    &:last-child {
      &::after {
        content: '';
        display: none;
      }
    }

    // .span_line {
    //   width: 0px;
    //   height: 20px;
    //   border: 1px solid #eeeeee;
    // }
  }

  .div_header_btn {
    padding: 0 5px;
    width: 90px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .addClass {
    border-radius: 20px 20px 20px 20px;
    background: #4b8ff5;
    color: #ffffff;
  }
}

.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 20px;
  display: flex;

  .user-content-left {
    width: 270px;
    margin-right: 16px;
    //margin-top: -68px;

    .user-content-left-route {
      border-radius: 10px 10px 10px 10px;
      background-color: $color-white;
      min-height: 470px;

      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 59px;
        line-height: 60px;
        padding: 0 14px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        border-bottom: 1px solid $color-background-l;
        position: relative;
        box-sizing: border-box;
        .span_text {
          cursor: pointer;
        }
      }
      .title_border {
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        padding-left: 10px;
        position: relative;
        height: 20px;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: #487fff;
          border-radius: 2px;
        }
      }
      .header {
        height: 59px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        border-bottom: 1px solid $color-background-l;
        position: relative;
        box-sizing: border-box;

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
    height: min-content;

    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
    }
  }
}

.custom-tree-node {
  display: flex !important;
  text-indent: 0 !important;
  padding-left: 0 !important;
  width: 100% !important;
  justify-content: space-between !important;
  .tree-node-label {
    width: 100%;
    display: flex;
    white-space: nowrap;
    // overflow: hidden;
    min-height: 18px;
    text-overflow: ellipsis;
    .nodeName {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    &.node-selected .nodeName {
      color: #487fff;
    }
  }
  .knowledge {
    color: #ff7928;
    background: #ff792826;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 4px;
    margin-right: 6px;
  }
}

.nodeName {
  // overflow: hidden;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // -webkit-box-orient: vertical;
  // text-overflow: ellipsis;
  // white-space: normal;
}
.custom-tree-content {
  /* 隐藏默认勾选框 */
  .el-tree-node__content .el-checkbox {
    display: none;
  }
  // .el-tree-node > .el-tree-node__children {
  //   overflow: inherit !important;
  // }
  .el-icon-circle-check {
    display: none;
    color: #70b503;
    &.ischeck {
      display: inline-block;
    }
    &.ischeck + .tree-node-label .nodeName {
      color: #487fff;
    }
  }
  .custom-checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #dcdfe6;
    border-radius: 50%;
    margin-left: 5px;
    cursor: pointer;
    position: relative;
    top: 4px;
    transition: border-color 0.3s, background-color 0.3s;
  }

  .custom-checkbox.checked {
    border-color: #409eff;
    background-color: #409eff;
  }

  .custom-checkbox.checked::after {
    content: '';
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    position: absolute;
    top: 0px;
    left: 3px;
    transform: rotate(45deg);
  }
}
</style>

