<template>
  <div class="div_userScence content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="header">
            <p class="title_border">
              选择备课范围
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
              :default-expanded-keys="expandedKeys"
              node-key="id"
              :filter-node-method="filterNode"
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
                    >{{ colors[Math.ceil(data.importance)].name }}</span></i></template>
                    <span
                      class="nodeName"
                      :style="{
                        cursor:
                          data.types != 1 && data.types != 2
                            ? 'not-allowed'
                            : 'pointer',
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
                <!-- <span v-if="data.types === 2" class="custom-checkbox" :class="{ 'checked': node.checked }"></span> -->
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <!-- 专题右边内容 -->
      <div class="user-content-right min-height750">
        <item-one
          :is-special="true"
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
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import ItemOne from './components/one-selection-knowledge'
import FilterItem from './components/filterItem.vue'
export default {
  name: 'Special',
  components: {
    ItemOne,
    FilterItem,
  },
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
          text: '按知识点',
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: function(data) {
          return data.types != 1 && data.types != 2
        },
      },
      expandedKeys: [],
      treeDataList: [],
      currScence: {},
      scenceList: [],
      questionTypes: [],
      selectData: [],
      cache: false,
      queue: [],
      colors: [
        {},
        { name: '非常重要', color: '#ed7764' },
        { name: '非常重要', color: '#ed7764' },
        { name: '重要', color: '#ef8944' },
        { name: '一般', color: '#f4bd41' },
        { name: '不重要', color: '#999' },
      ],
    }
  },
  watch: {
    // currSubject(val, old) {
    //   this.getRelationCategoryId(val.subjectCode)
    // },
  },
  setup() {
    const lemonTree = ref(null)
    
    onActivated(() => {
      if (!props.cache) {
        // getTreeDataList() // 获取侧边栏数据
        lemonTree.value.store._getAllNodes().map(n => (n.expanded = false))
      }
    })
  deactivated() {},
  computed: {
    ...mapState(['currSubject']),
    // tabActiveName() {
    //   return this.$route.query.tabActiveName
    //     ? this.$route.query.tabActiveName
    //     : 'first'
    // },
  },
  created() {
    this.getTreeDataList() // 获取侧边栏数据
  },
  methods: {
    changeCurrScence(item) {
      currScence.value = item
      checkClick()
      lemonTree.value.filter()
    },
    filterNode(v, data) {
      return !(data.types === 2 && [3, 4].includes(this.currScence.paperTypeId))
    },
    // 获取侧边栏数据
    async getTreeDataList() {
      const params = {
        catalogueType: 12,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      // const url = { urlPath: '/paper-generator/subjectCatalogueTree/getSubjectCatalogueData' }
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
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
      }
    },
    // 全部清空知识点
    deleteAll() {
      console.log('deleteAll', '')
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
      this.$refs['lemonTree'].setChecked(node.id, false)
      this.checkClick()
    },
    // 复选框点击
    checkClick() {
      this.selectData = []
      const testType = this.currScence.testType
      let nodes = this.getSimpleCheckedNodes(this.$refs['lemonTree'].store)
      console.log(nodes, 'nodes')
      nodes.forEach(v => {
        const node = lemonTree.value.getNode(v.id)
        // if (testType) {
        //   // 大考
        //   if (v.children) {
        //     v.children.forEach((c) => {
        //       const sNode = lemonTree.value.getNode(c.id)
        //       examTransform(sNode.parent, sNode)
        //     })
        //   } else {
        //     examTransform(node.parent, node)
        //   }
        //   // examTransform(node.parent, node)
        // } else {
        // 普通
        const flag = this.transformNode(node.parent, node)
        console.log(flag, 'flag')
        if (!flag && v.children && v.children.length) {
          this.queue.push(...v.children)
          this.findDown()
        }
        // }
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
        // 直接选择知识点,下面的题模都被选中
        const cNode = { ...data, selChildren: data.children || [] }
        this.selectData.push(cNode)
        return true
      } else if (pData.isKnowledge) {
        // 父节点是知识点 把当前子节点加进去
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
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
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
    right: -30px;
    top: -2px;
    line-height: 20px;
    height: 18px;
  }
}
.content-container {
  margin-top: 12px;
}

.flex {
  display: flex;
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

    :deep(.scsne_tip)) {
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

    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;
      border-radius: 10px 10px 10px 10px;

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
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 59px;
        line-height: 60px;
        padding: 0 14px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        box-sizing: border-box;
        border-bottom: 1px solid $color-background-l;
        position: relative;
        .span_text {
          cursor: pointer;
          color: #487fff;
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
    height: min-content;

    :deep(.el-tabs .el-tabs__header)) {
      padding: 0 20px;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar)) {
      background-color: $color-theme;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active)) {
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
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.node-selected .nodeName {
      color: #487fff;
    }
  }
  .el-tree-node__content .el-checkbox {
    display: none;
  }

  .el-icon-circle-check {
    display: none;
    color: #70b503;
    &.ischeck {
      display: inline-block;
    }
  }
  /* 自定义圆形勾选框 */
  .custom-checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #dcdfe6;
    border-radius: 50%;
    margin-left: 5px;
    cursor: pointer;
  }

  .custom-checkbox.checked {
    background-color: #409eff;
    border-color: #409eff;
  }

  .knowledge {
    color: #ff7928;
    background: #ff792826;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 4px;
    margin-right: 6px;
    &:hover {
      //background: rgba(72, 127, 255, 0.3);
      //color: #ffffff;
      //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
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
</style>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
/* SCSS styles */
</style>
