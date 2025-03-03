<template>
  <div>
    <el-drawer
      v-model:visible="visible"
      title="请选择备课范围"
      direction="ltr"
      size="320px"
      class="examination_direction"
    >
      <div>
        <div
          v-if="type == 1"
          class="version_grade"
        >
          <span>{{ version.name }}/{{ grade.name }}</span>
          <el-popover
            v-if="versionGrade[0] && versionGrade[0].children.length"
            v-model="popoverVisible"
            placement="bottom"
            width="400"
            trigger="click"
            popper-class="version_grade_popover"
          >
            <div class="version_grade_popover_content">
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
            <section class="version_grade_popover_btn">
              <el-button
                size="small"
                @click="popoverVisible = false"
              >
                取消
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="onOk"
              >
                确认
              </el-button>
            </section>
            <template #reference>
              <i class="iconfont icon-transfer_line" />
            </template>
          </el-popover>
        </div>
        <div class="content">
          <div class="title">
            <b>选择备课范围</b>
            <span @click="resetTree">重置</span>
          </div>
          <div class="tree mytree">
            <el-tree
              ref="tree"
              :data="treeDataList"
              :indent="0"
              :props="defaultProps"
              show-checkbox
              empty-text="暂无数据"
              icon-class="icon-expand el-icon-plus"
              check-on-click-node
              node-key="uuid"
              :default-expanded-keys="expandedKeys"
              :expand-on-click-node="false"
              @check="checkClick"
            >
              <!-- :filter-node-method="filterNode" -->
              <template #default="{ data, node }">
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
                      :style="{
                        cursor:
                          type == 1
                            ? node.level == 1
                              ? 'not-allowed'
                              : 'pointer'
                            : data.types != 1 && data.types != 2
                              ? 'not-allowed'
                              : 'pointer',
                      }"
                      v-html="data.name"
                    />
                    <b
                      v-if="data.types === 2"
                      class="icon el-icon-circle-check"
                    />
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="footer">
          <el-button @click="cancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submit"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      v-model:visible="dialogVisible"
      title="提示"
      width="450px"
      custom-class="confirm_dialog"
    >
      <div class="content">
        <i class="icon el-icon-warning-outline" />
        <div>
          <p>
            确定要切换至“{{ popoverData.version.name }}-{{
              popoverData.grade.name
            }}”吗？
          </p>
          <p>切换可能会清空当前教案中部分内容，请谨慎操作！</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">暂不切换</el-button>
          <el-button
            type="primary"
            @click="confirm"
          >确认切换</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { mapState } from 'vuex'
export default {
  inject: ['app'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    ids: {
      default: () => [],
    },
    lessonInfoId: {
      default: '',
    },
  },
  setup() {
    const treeRef = ref(null)
  data() {
    return {
      type: '',
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
        disabled: (data, node) => {
          if (this.type == 1) {
            return node.level == 1
          } else {
            return data.types != 1 && data.types != 2
          }
        },
      },
      popoverVisible: false,
      dialogVisible: false,
      treeDataList: [],
      version: { name: '', code: '' },
      grade: { name: '', code: '' },
      popoverData: {
        version: { name: '', code: '' },
        grade: { name: '', code: '' },
      },
      expandedKeys: [],
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
    value(v) {
      if (v) {
        console.log(this.ids, 111)
        const id = []
        const loop = arr => {
          arr.forEach(item => {
            if (item.type === 2) {
              id.push(item.id)
            }
            if (item.children && item.children.length) {
              loop(item.children)
            }
          })
        }
        loop(this.ids)
        nextTick(() => {
          treeRef.value.setCheckedKeys(id.filter(Boolean))
        })
        this.init()
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
    this.type = this.$route.query.type || 1
  },
  methods: {
    init() {
      if (this.version.name) return
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
        this.getTreeDataList()
        return
      }
      if (this.versionGrade.length) {
        this.version = { ...this.versionGrade[0].children[0] }
        this.grade = { ...this.version.children[0] }
        this.popoverData.version = { ...this.versionGrade[0].children[0] }
        this.popoverData.grade = { ...this.version.children[0] }
        this.getTreeDataList()
      }

      this.$emit('selectGrade', { grade: this.grade, version: this.version })
    },
    versionChange(v) {
      this.popoverData.version = { ...v }
      this.popoverData.grade = { ...this.popoverData.version.children[0] }
    },
    gradeChange(v) {
      this.popoverData.grade = { ...v }
    },
    onOk() {
      if (this.popoverData.grade.code !== this.grade.code) {
        this.dialogVisible = true
        return
      }
      this.popoverVisible = false
    },
    confirm() {
      this.dialogVisible = false
      this.version = this.popoverData.version
      this.grade = this.popoverData.grade
      this.$emit('selectGrade', this.popoverData)
      this.getTreeDataList()
    },
    getTreeDataList() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        version: this.version.code,
        volume: this.grade.code,
        catalogueType: 9 + +this.type,
      }
      this.apiGet(
        { urlPath: '/lesson-app/config/getCatalogueTree' },
        params,
      ).then(res => {
        console.log('res======', res)
        if (res.code != 200) return this.$message.warning(res.msg)
        function attachParentInfo(
          node,
          parentId,
          parentName,
          parentImportance,
        ) {
          node.pId = parentId
          node.pName = parentName
          node.pImportance = parentImportance
          if (node.children && node.children.length) {
            node.children.forEach(child => {
              attachParentInfo(child, node.uuid, node.name, node.importance)
            })
          }
        }
        res.data = res.data || []
        res.data.forEach(v => {
          attachParentInfo(v, null, null)
        })
        this.treeDataList = res.data
        this.expandedKeys = this.treeDataList.map(v => v.uuid)
      })
    },
    resetTree() {
      treeRef.value.setCheckedKeys([])
    },
    checkClick(done) {},
    cancel() {
      this.$emit('input', false)
    },
    submit() {
      // console.log(this.$refs.tree.getCheckedNodes())
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getCurrentNode())
      const arr = treeRef.value.getCheckedNodes().filter(v => v.types === 2)
      if (arr.length === 0) {
        this.$message.warning('请选择考向')
        return
      }
      console.log(arr, 11)
      const res = [],
        obj = {}
      arr.forEach(v => {
        if (!obj[v.pId]) {
          obj[v.pId] = {
            name: v.pName,
            id: v.pId,
            type: 1,
            importance: v.pImportance,
            // children: this.expandedKeys.includes(v.uuid)? [] : [{...v}]
            children: [{ ...v, type: 2, id: v.uuid }],
          }
          res.push(obj[v.pId])
        } else {
          // !this.expandedKeys.includes(v.uuid) && obj[v.pId].children.push({...v})
          obj[v.pId].children.push({ ...v, type: 2, id: v.uuid })
        }
      })
      const data = {
        lessonGenerateType: this.$route.query.lessonType || 1,
        lessonInfoId: this.lessonInfoId,
        knowledgeList: res,
        lessonConditionBo: this.app.versionData,
      }
      this.newPost({ urlPath: '/lesson-app/lessonApp/addKnowledge' }, data, {
        showLoading: true,
      }).then(res => {
        if (res.code === 200) {
          this.$emit('submit', res)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/* SCSS styles */
</style>
