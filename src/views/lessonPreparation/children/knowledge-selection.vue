<template>
  <div class="content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content_tree_box">
          <div
            v-show="isChapter === 1"
            class="user-content-left-route"
          >
            <div class="header">
              <span
                v-if="teachCurrentName && gradeCurrentName"
                class="title"
                :title="teachCurrentName + '/' + gradeCurrentName"
              >{{ teachCurrentName }} / {{ gradeCurrentName }}</span>
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
                <div>
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
                </div>
                <template #reference>
                  <i class="iconfont icon-transfer_line" />
                </template>
              </el-popover>
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
                :check-strictly="checkStrictly"
                :highlight-current="true"
                :empty-text="treeNotMsg"
                icon-class="icon-expand el-icon-plus"
                :filter-node-method="filterNode"
                :default-expanded-keys="openTreeKeys"
                node-key="uuid"
              >
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <i
                      v-if="data.types === 2"
                      class="icon_star el-icon-star-on"
                      :style="{ color: colors[1].color }"
                    />
                    <span
                      class="tree-node-label"
                      :title="data.chapterName"
                      @click="handleRowClick(node, data)"
                    >
                      <span :title="data.name">{{ data.name }}</span>
                    </span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
          <div
            v-show="isChapter === 2"
            class="user-content-left-route"
          >
            <div
              v-loading="ktreeLoading"
              class="content mytree"
            >
              <el-tree
                v-show="isIntersection == '0'"
                ref="klemonTree"
                :data="knowledgeTreeDataList"
                :indent="0"
                :check-strictly="checkStrictly"
                :show-checkbox="isMuliti === '1'"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :highlight-current="true"
                :auto-expand-parent="false"
                empty-text="暂无数据"
                icon-class="icon-expand el-icon-plus"
                :check-on-click-node="true"
                node-key="uuid"
              >
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <i
                      v-if="data.types === 2"
                      class="icon_star el-icon-star-on"
                      :style="{ color: colors[1].color }"
                    />
                    <span
                      class="tree-node-label"
                      @click="handleRowClick(node, data)"
                    >
                      <span
                        :title="data.name"
                        v-html="data.name"
                      />
                    </span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
          <div
            v-show="isChapter === 3"
            class="user-content-left-route"
          >
            <div
              v-loading="ktreeLoading"
              class="content mytree"
            >
              <el-tree
                v-show="isIntersection == '0'"
                ref="slemonTree"
                :data="specialTreeDataList"
                :indent="0"
                :check-strictly="checkStrictly"
                :show-checkbox="isMuliti === '1'"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :highlight-current="true"
                :auto-expand-parent="false"
                empty-text="暂无数据"
                icon-class="icon-expand el-icon-plus"
                node-key="uuid"
              >
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <i
                      v-if="data.types === 2"
                      class="icon_star el-icon-star-on"
                      :style="{ color: colors[1].color }"
                    />
                    <span
                      class="tree-node-label"
                      @click="handleRowClick(node, data)"
                    >
                      <span
                        :title="data.name"
                        v-html="data.name"
                      />
                    </span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
      </div>
      <div class="user-content-right">
        <div class="select-list">
          <!-- <PreparationType></PreparationType> -->
          <PaperAdaptive
            ref="resetLevel"
            :level="suitType"
            category-label="等级"
            :flag="false"
            @select-grade="selectLevel"
          />
        </div>
        <div class="data-list">
          <PaperSort
            :paper-count="pageData.totalCount"
            @select-sort="selectSort"
          />
          <ul
            v-if="pageData.list.length > 0"
            class="paper-list min-height500"
          >
            <ItemData
              v-for="(item, index) in pageData.list"
              :key="index"
              :paper-item="item"
              :is-show-paper="true"
              :is-chapter="isChapter"
              :is-my-paper="true"
              :subject-code="currSubject.subjectCode"
              @show-download-dialog="OnShowDownloadDialog"
              @show-edit-paper-dialog="OnShowEditPaperDialog"
              @check-paper-detail="onCheckPaperDetail"
              @show-delete-dialog="OnShowDeleteDialog"
              @show-contribute-dialog="OnhowContributeDialog"
            />
          </ul>
          <pagination
            v-if="pageData.list.length > 0"
            :page-data="pageData"
            @page-curr-change="handleCurrentChange"
          />
          <noresult-common
            v-else
            v-slot:empty
            text="很遗憾，没有找到您要的教案"
          />
        </div>
      </div>
    </div>
    <!-- 下载教案 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
      @download-paper="onDownloadPaper"
    />
    <!-- 投稿 -->
    <base-dialog
      ref="contributeDialog"
      title="投稿信息确认"
      @comfirm="onContributePaper"
    >
      <template #dialogTips>
        <el-form
        
          ref="ruleForm"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="稿件名称:">
            <div style="text-align: left;">
              {{ form.paperName }}
            </div>
          </el-form-item>
          <el-form-item label="学段学科:">
            <div style="text-align: left;">
              {{ form.stage }}
            </div>
          </el-form-item>
          <el-form-item label="教案类型:">
            <div style="text-align: left;">
              {{ form.type }}
            </div>
          </el-form-item>
          <el-form-item
            label="适用难度:"
            prop="period"
          >
            <el-radio-group
              v-model="form.period"
              style="display: flex;align-items: center;height: 32px;"
            >
              <el-radio
                value="1"
                label="基础课"
              />
              <el-radio
                value="2"
                label="标准课"
              />
              <el-radio
                value="3"
                label="拔高课"
              />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </base-dialog>
    <!-- 删除弹窗 -->
    <base-dialog
      ref="deleteDialog"
      title="教案删除提示"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          教案删除后，不可恢复，请谨慎操作，仍要删除教案？
        </div>
      </template>
    </base-dialog>
    <!-- 重新编辑提示框 -->
    <base-dialog
      ref="comfirmDialog"
      title="教案编辑提示"
      :show-cancel-btn="false"
      @comfirm="onEditPaper"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          确认编辑教案？
        </div>
      </template>
    </base-dialog>
    <download
      v-model="downloadVisible"
      :source="currPaper.source"
      :info="currPaper"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { getSimpleCheckedLeaf } from '@/common/js/util.js'
import { mapState } from 'vuex'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import PaperTime from '@/components/Category/PaperTime.vue'
import PaperAdaptive from '@/components/Category/PaperAdaptive.vue'
import PreparationType from '@/components/Category/PreparationType.vue'
import PaperSort from '../components/PaperSort.vue'
import ItemData from '../components/item-data.vue'
import paperShareMixin from '@/common/mixins/paperShareMixin'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import download from '@/views/teachingPlanEdit/components/download.vue'
export default {
  components: {
    ItemData,
    PaperTime,
    PaperAdaptive,
    PreparationType,
    PaperSort,
    BaseDialog,
    download,
  },
  mixins: [paperShareMixin, paperPayMixin],
  props: {
    isChapter: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      colors: [
        {},
        { name: '非常重要', color: '#ed7764' },
        { name: '非常重要', color: '#ed7764' },
        { name: '重要', color: '#ef8944' },
        { name: '一般', color: '#f4bd41' },
        { name: '不重要', color: '#999' },
      ],
      left: ['37px', '120px', '193px'],
      pageData: {
        list: [],
        pageSize: 5,
        currPage: 1,
        totalCount: 5,
      },
      form: {
        paperName: '',
        stage: '',
        type: '',
        period: '',
      },
      rules: {
        period: [
          { required: true, message: '请选择适用难度', trigger: 'blur' },
        ],
      },
      currSort: 1,
      suitType: 0,
      currPaper: {},
      checkStrictly: false, // 控制可选和不可选
      treeLoading: false,
      ktreeLoading: false,
      visible: false,
      downloadVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return !data.type
        },
      },
      treeDataList: [],
      knowledgeTreeDataList: [],
      teachData: [],
      teachCurrentCode: '',
      teachCurrentName: '',
      classData: [],
      gradeCurrentCode: '',
      gradeCurrentName: '',
      checkNodeCode: '',
      treeNotMsg: '暂无数据',
      openTreeKeys: [],
      wrapperThrottle: null,
      isMuliti: '2',
      isIntersection: '0',
      specialTreeDataList: [],
    }
  },
  watch: {
    currSubject(n, o) {
      if (n.periodCode === o.periodCode && n.subjectCode === o.subjectCode)
        return
      this.treeDataList = [] // 自控章节选题
      this.getBookCategoryId()
      this.getTreeDataList()
      this.getSpecialData()
    },
    // 这是人写的？
    // fullpath(v) {
    //   if (this.fullpath == 'chapterquesSelection') {
    //     this.isChapter = 1
    //   } else if (this.fullpath == 'knowledgeSelection') {
    //     this.isChapter = 0
    //   } else {
    //     this.isChapter = 2
    //   }
    // },
    isChapter(v) {
      this.checkNodeCode = ''
      this.$refs.resetLevel.currGradeCode = 0
      this.suitType = 0
      this.pageData.currPage = 1
      this.getTreeDataList()
      this.getDataList()
    },
  },
  computed: {
    ...mapState([
      'userInfo',
      'currSubject',
      'bookCurrent',
      'gradeCurrent',
      'volumeCurrent',
      'fullpath',
    ]),
    componentsIsIntersection() {
      if (this.isMuliti === '0') {
        return '0'
      } else {
        return this.isIntersection
      }
    },
  },
  mounted() {
    if (this.currSubject && this.currSubject.subjectCode) {
      this.getBookCategoryId()
    }
  },
  unmounted() {
    this.wrapperThrottle = null
  },
  created() {
    this.getTreeDataList()
    this.getSpecialData()
    this.getDataList()
  },
  methods: {
    filterNode(value, data) {
      return data.types > 2
    },
    // 选择年级版本
    selectGrade(item) {
      this.gradeCurrentCode = item.code
      this.gradeCurrentName = item.name
      // 重置数据
      this.treeDataList = []
      this.visible = false
      this.getChapter()
    },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.name
      this.teachCurrentCode = item.code
      this.gradeCurrentCode = item.children[0].code
      this.gradeCurrentName = item.children[0].name
      this.classData = item.children
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
          this.teachData = res.data[0].children
          this.teachCurrentCode = this.teachData[0].code
          this.teachCurrentName = this.teachData[0].name
          this.classData = this.teachData[0].children
          const data = this.classData[0]
          this.gradeCurrentCode = data.code
          this.gradeCurrentName = data.name
          this.getChapter()
        }
      } else {
        this.$message.error(res.msg)
      }
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
        this.treeDataList = res.data
        this.$nextTick(() => {
          this.$refs.lemonTree.filter()
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 获取侧边栏数据
    async getTreeDataList(knowledge) {
      // 知识点树
      const params = {
        catalogueType: 11,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        this.knowledgeTreeDataList = res.data
        this.$nextTick(() => {
          this.$refs.klemonTree.filter()
        })
      }
    },
    async getSpecialData() {
      const params = {
        catalogueType: 12,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        this.specialTreeDataList = res.data
        this.$nextTick(() => {
          this.$refs.slemonTree.filter()
        })
      }
    },
    async getDataList() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        pageNum: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
        sortType: this.currSort,
        suitType: this.suitType,
        catalogueIds: [],
        lessonType: this.isChapter,
      }
      if (this.checkNodeCode) {
        params.catalogueIds = [this.checkNodeCode]
      }
      const res = await this.newPost(
        { urlPath: '/lesson-app/lessonPreparation/lessonList' },
        params,
      )
      if (res.code === CTS.constant.SUCCESS_CODE) {
        this.pageData = {
          list: res.data.records,
          pageSize: res.data.size,
          currPage: res.data.current,
          totalCount: res.data.total,
        }
      }
    },
    selectLevel(val) {
      this.pageData.currPage = 1
      this.suitType = val.code
      this.getDataList()
    },
    selectSort(val) {
      this.pageData.currPage = 1
      this.currSort = val
      this.getDataList()
    },
    // 点击行的选中状态
    handleRowClick(node, data) {
      this.pageData.currPage = 1
      console.log(data, this.type)
      this.checkNodeCode = data.uuid
      this.getDataList()
    },
    // 分页
    handleCurrentChange(currPage) {
      this.pageData.currPage = currPage
      this.getDataList()
    },
    // 编辑教案
    OnShowEditPaperDialog(paperItem) {
      // 监听下载教案
      this.currPaperItem = paperItem
      this.$refs.comfirmDialog.show()
    },
    //投稿
    OnhowContributeDialog(paperItem) {
      this.form = { ...paperItem }
      this.$refs.contributeDialog.show()
    },
    // 删除下载
    OnShowDeleteDialog(paperId) {
      this.currPaperItem = paperId
      this.$refs.deleteDialog.show()
    },
    // 下载教案
    OnShowDownloadDialog(paperItem) {
      // 监听下载教案
      this.currPaper = paperItem
      this.currPaperItem = paperItem
      this.downloadVisible = true
      // this.queryOrder(paperItem)
    },
    //详情
    onCheckPaperDetail(paperItem) {
      this.$router.push({
        path: '/smartPaper/prePare',
        query: {
          id: paperItem.id,
          type: paperItem.lessonType,
          source: 1,
          ext: 1,
        },
      })
    },
    // 确认投稿
    onContributePaper() {
      this.$refs.contributeDialog.hide()
    },
    // 删除教案
    onDeleteBasket() {
      this.$refs.deleteDialog.hide()
    },
    // 编辑教案
    onEditPaper() {
      this.$refs.comfirmDialog.hide()
    },
  },
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.user-content {
  width: 1200px;
  min-height: 473px;
  padding-top: 12px;
  margin-bottom: 20px;
  display: flex;

  .user-content-left {
    width: 280px;
    margin-right: 12px;

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
        position: relative;
        box-sizing: border-box;
        border-bottom: 1px solid #e2e2e2;

        .title {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 48px;
          width: 200px;
        }

        i {
          position: absolute;
          right: 14px;
          cursor: pointer;
          color: $color-theme;
        }

        .t {
          font-weight: bold;
          color: #333333;
        }

        .muliti-action {
          color: $color-theme;
        }
      }

      .content {
        padding: 17px 14px 17px 0;
        box-sizing: border-box;
        overflow-y: auto;
        max-height: 500px;
      }
    }
  }

  .user-content-right {
    width: 914px;

    .select-list {
      background-color: $color-white;
      padding: 10px 20px 0px;
      margin-bottom: 12px;
    }

    .data-list {
      background-color: $color-white;
      padding: 0 20px 20px;
    }
  }
}

.tabs-fillet-corner {
  width: 100%;
  height: 60px;
  display: flex;
  // justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  box-sizing: border-box;
  // padding-top: 9px;
  overflow: hidden;
  position: relative;

  .holder {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: #f7f7f7;
  }

  > img {
    position: absolute;
    bottom: 0;
    left: 0px;
    width: 40px;
    height: 5px;
    z-index: 4;
    transition: all 0.2s;
  }

  .tabs-fillet-corner-item-wrap {
    flex: 1;
    height: 50px;
    padding: 0 12px;
    cursor: pointer;
  }

  .tabs-fillet-corner-item-wrap.first .tabs-fillet-corner-item {
    border-top-left-radius: 0;
  }

  .tabs-fillet-corner-item-wrap.first.active .tabs-fillet-corner-item::before {
    border-radius: 17px 0 0 0;
    transform: skew(0deg);
    left: -17px;
  }

  .tabs-fillet-corner-item-wrap.last .tabs-fillet-corner-item {
    border-top-right-radius: 0;
  }

  .tabs-fillet-corner-item-wrap.last.active .tabs-fillet-corner-item::after {
    border-radius: 0 17px 0 0;
    transform: skew(0deg);
    right: -17px;
  }

  .tabs-fillet-corner-item {
    border-radius: 8px 8px 0 0;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    // transition: all .2s;
    i {
      font-size: 20px;
      color: #487fff;
      display: none;
      margin-right: 4px;
    }
  }

  .tabs-fillet-corner-item-text {
    font-size: 16px;
    color: #7b7b7b;
    position: relative;
    z-index: 99;

    .new {
      position: absolute;
      top: -21px;
      right: -20px;
      width: 36px;
      text-align: center;
      line-height: 18px;
      background: #ff4b36;
      border-radius: 10px 10px 10px 0px;
      font-size: 12px;
      color: #fff;
      font-weight: normal;
    }
  }

  .active {
    height: 60px;
    flex: none;
    width: 120px;

    .tabs-fillet-corner-item {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      z-index: 2;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        width: 17px;
        height: 100%;
        background: #fff;
        border-radius: 17px 17px 0 0;
      }

      &::before {
        transform: skew(-10deg);
        left: -6.5px;
      }

      &::after {
        transform: skew(10deg);
        right: -6.5px;
      }

      i {
        display: block;
      }

      .tabs-fillet-corner-item-text {
        font-weight: bold;
        font-size: 16px;
        color: #487fff;
      }
    }
  }
}

.knowledge-search-input {
  margin: 15px 18px 5px 18px;
  width: 230px;

  :deep(.el-input__inner) {
      border-radius: 4px;
      height: 26px;
      line-height: 26px;
    }

    .el-input__suffix {
      padding-right: 5px;
      line-height: 26px;
      cursor: pointer;
    }
  }
}

.user-content_tree_box {
  position: sticky;
  top: 0;
  // height: 60vh;
}

.header {
  display: flex;

  .t {
    width: 100px;
  }

  .m {
    flex: 1;
    text-align: right;

    .switch {
      padding: 0 5px;
    }
  }
}

.iconbangzhu,
.el-icon-question {
  color: #bfc1c5;
  font-size: 16px;
  padding-left: 5px;
}

.question-tool-tips {
  color: #333333;
  line-height: 20px;

  .tips {
    color: $color-theme;
  }
}

.knowledge-intersection-set {
  margin: 5px 15px 5px 15px;
}

.icon_star {
  font-size: 20px;
  display: inline-block;
  margin: 0 4px 0 10px;
  vertical-align: text-top;
}
</style>
