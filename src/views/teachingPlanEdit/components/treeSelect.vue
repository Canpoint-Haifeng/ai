<template>
  <div
    class="tree_select"
    @click="close"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="按章节"
        name="1"
      >
        <div class="version_grade">
          <span>{{ version.name }}/{{ grade.name }}</span>
          <el-popover
            v-if="versionGrade[0] && versionGrade[0].children.length"
            ref="versionRef"
            v-model="popoverVisible"
            placement="bottom"
            width="320"
            trigger="click"
            popper-class="tree_select_version_grade"
          >
            <div
              class="tree_select_version_grade_content"
              @click.stop=""
            >
              <h6>教材版本</h6>
              <div class="version">
                <span
                  v-for="(v, i) in versionGrade[0].children"
                  :key="i"
                  :class="{ active: v.code === popoverData.version.code }"
                  @click="versionChange(v)"
                >{{ v.name }}</span>
              </div>
              <h6>年级册</h6>
              <div>
                <span
                  v-for="(v, i) in popoverData.version.children"
                  :key="i"
                  :class="{ active: v.code === popoverData.grade.code }"
                  @click="gradeChange(v)"
                >{{ v.name }}</span>
              </div>
            </div>
            <template #reference>
              <i
                class="iconfont icon-transfer_line"
              
                @click.stop=""
              />
            </template>
          </el-popover>
        </div>
        <div
          class="tree chapter_tree mytree"
          @click="popoverVisible = false"
        >
          <el-tree
            ref="tree0"
            :data="treeDataList0"
            :indent="0"
            :props="defaultProps"
            empty-text="暂无数据"
            icon-class="icon-expand el-icon-plus"
            check-on-click-node
            node-key="id"
            :expand-on-click-node="false"
            @check="checkClick"
          >
            <!-- :filter-node-method="filterNode" -->
            <template #default="{ data }">
              <div class="custom-tree-node">
                <span class="tree-node-label">
                  <span
                    v-if="data.types == 1"
                    class="knowledge"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  >知</span>
                  <i
                    v-if="data.importance && data.types === 2"
                    class="el-icon-star-on coefficient"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  />
                  <span
                    class="nodeName"
                    :title="data.name"
                    v-html="data.name"
                  />
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="按知识点"
        name="2"
      >
        <div class="tree mytree">
          <el-tree
            ref="tree1"
            :data="treeDataList1"
            :indent="0"
            :props="defaultProps"
            empty-text="暂无数据"
            icon-class="icon-expand el-icon-plus"
            check-on-click-node
            node-key="id"
            :expand-on-click-node="false"
            @check="checkClick"
          >
            <!-- :filter-node-method="filterNode" -->
            <template #default="{ data }">
              <div class="custom-tree-node">
                <span class="tree-node-label">
                  <span
                    v-if="data.types == 1"
                    class="knowledge"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  >知</span>
                  <i
                    v-if="data.importance && data.types === 2"
                    class="el-icon-star-on coefficient"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  />
                  <span
                    class="nodeName"
                    :title="data.name"
                    v-html="data.name"
                  />
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="按专题"
        name="3"
      >
        <div class="tree mytree">
          <el-tree
            ref="tree2"
            :data="treeDataList2"
            :indent="0"
            :props="defaultProps"
            empty-text="暂无数据"
            icon-class="icon-expand el-icon-plus"
            check-on-click-node
            node-key="id"
            :expand-on-click-node="false"
            @check="checkClick"
          >
            <!-- :filter-node-method="filterNode" -->
            <template #default="{ data }">
              <div class="custom-tree-node">
                <span class="tree-node-label">
                  <span
                    v-if="data.types == 1"
                    class="knowledge"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  >知</span>
                  <i
                    v-if="data.importance && data.types === 2"
                    class="el-icon-star-on coefficient"
                    :style="{ color: colors[Math.ceil(data.importance)].color }"
                  />
                  <span
                    class="nodeName"
                    :title="data.name"
                    v-html="data.name"
                  />
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { mapState } from 'vuex'
import mixin from './mixin'
let oldGrade = null //记录第一次选择，后续变化更新
let oldVersion = null
export default {
  mixins: [mixin],
  inject: ['app', 'treeSelectInfo'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: '1',
      colors: [
        {},
        { name: '非常重要', color: '#ed7764' },
        { name: '非常重要', color: '#ed7764' },
        { name: '重要', color: '#ef8944' },
        { name: '一般', color: '#f4bd41' },
        { name: '不重要', color: '#999' },
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        // disabled: function (data) {
        //   return !data.isClick
        // }
      },
      popoverVisible: false,
      treeDataList0: [],
      treeDataList1: [],
      treeDataList2: [],
      version: { name: '', code: '' },
      grade: { name: '', code: '' },
      popoverData: {
        version: { name: '', code: '' },
        grade: { name: '', code: '' },
      },
    }
  },
  computed: {
    ...mapState(['currSubject', 'versionGrade']),
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    value(val) {
      if (val) {
        const { version, grade } = this.treeSelectInfo()
        console.log('grade', version, grade)
        if (version && grade && version != oldVersion && grade != oldGrade) {
          //外层选择变化重新赋值
          this.popoverData.version = this.version = version
          this.popoverData.grade = this.grade = grade
        }
      }
    },
    popoverVisible(v) {
      if (!v) {
        this.popoverData.version = this.version
        this.popoverData.grade = this.grade
      }
    },
  },
  created() {
    const versionData = this.app.versionData
    if (versionData.version) {
      this.version = this.versionGrade[0].children.find(
        item => item.code === versionData.version,
      )
      this.grade = this.version.children.find(
        item => item.code === versionData.volume,
      )
      this.popoverData.version = this.versionGrade[0].children.find(
        item => item.code === versionData.version,
      )
      this.popoverData.grade = this.version.children.find(
        item => item.code === versionData.volume,
      )
    } else {
      this.version = { ...this.versionGrade[0].children[0] }
      this.grade = { ...this.version.children[0] }
      this.popoverData.version = { ...this.versionGrade[0].children[0] }
      this.popoverData.grade = { ...this.version.children[0] }
    }
    // if(this.versionGrade.length) {
    // }
    this.activeName = String(this.app.type || 1)
    this.getTreeDataList(0)
    this.getTreeDataList(1)
    this.getTreeDataList(2)
  },
  mounted() {
    const { grade, version } = this.treeSelectInfo()
    if ((grade, version)) {
      oldVersion = this.version.code
      oldGrade = this.grade.code
      this.popoverData.version = this.version = version
      this.popoverData.grade = this.grade = grade
    }
  },
  setup() {
    const versionRef = ref(null)
    
    const close = () => {
      versionRef.value?.doClose()
    }
    
    return {
      versionRef,
      close
    }
  },
  methods: {
    versionChange(v) {
      this.popoverData.version = { ...v }
      // this.popoverData.grade = {...this.popoverData.version.children[0]}
    },
    gradeChange(v) {
      this.popoverData.grade = { ...v }
      if (this.popoverData.grade.code === this.grade.code) {
        this.popoverVisible = false
        return
      }
      this.version = this.popoverData.version
      this.grade = this.popoverData.grade
      this.getTreeDataList(0)
      this.popoverVisible = false
    },
    getTreeDataList(i) {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        version: this.version.code,
        volume: this.grade.code,
        catalogueType: 10 + i,
      }
      this.apiGet(
        { urlPath: '/lesson-app/config/getCatalogueTree' },
        params,
      ).then(res => {
        if (res.code == 200) {
          this[`treeDataList${i}`] = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleClick(v) {},
    checkClick(v) {
      this.$emit('select', { ...v, catalogType: this.activeName })
    },
  },
}
</script>

<style lang="scss" scoped>
/* SCSS styles */
</style>
<style lang="scss" scoped>
  
.tree_select {
  .version_grade {
    padding-bottom: 15px;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    > span {
      font-weight: bold;
      margin-right: 10px;
    }
    .iconfont {
      color: #487fff;
      cursor: pointer;
    }
  }
  .tree {
    height: 300px;
    overflow: auto;
    :deep(.el-tree) {
      .el-tree-node {
        .custom-tree-node {
          .knowledge {
            color: #ff7928;
            background: #ff792826;
            line-height: 18px;
            padding: 0 4px;
            border-radius: 4px;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
