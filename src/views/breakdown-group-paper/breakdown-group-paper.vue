<template>
  <div class="breakdown-group-paper">
    <!-- <ul class="my-resources-list">
      <li :class="{ active: activeName == 'classBooks' }" @click="activeName = 'classBooks'">
        <i class="el-icon-office-building"></i>课时卷
      </li>
      <li :class="{ active: activeName == 'unitBooks' }" @click="activeName = 'unitBooks'">
        <i class="el-icon-office-building"></i>单元卷
      </li>
      <li :class="{ active: activeName == 'monthBooks' }" @click="activeName = 'monthBooks'">
        <i class="el-icon-office-building"></i>月考卷
      </li>
      <li :class="{ active: activeName == 'interimBooks' }" @click="activeName = 'interimBooks'">
        <i class="el-icon-office-building"></i>期中卷
      </li>
      <li :class="{ active: activeName == 'endBooks' }" @click="activeName = 'endBooks'">
        <i class="el-icon-office-building"></i>期末卷
      </li>
    </ul> -->
    <!-- <breadcrumb :crumbsData="crumbsData"></breadcrumb> -->
    <div class="my-breakdown">
      <h1 class="tit-my">
        <span>细目表组卷</span>
        <!-- {{ type }} -->
        <!-- <div class="icon-div" @click="goMyBreakdown">
          <i class="icon iconfont iconwodezujuan"></i>
          <span>我的细目表</span>
        </div> -->
      </h1>
      <div class="breakdown-content">
        <h3 class="tit-item">
          <span />
          <i>*</i>
          试卷标题
        </h3>
        <div class="paper-name">
          <el-input
            v-model="forms.paperName"
            placeholder="请输入试卷标题"
            maxlength="50"
            show-word-limit
          />
        </div>
        <h3 class="tit-item">
          <span />
          试卷要求
        </h3>
        <div class="paper-requirement">
          <div class="grade">
            <span>年级选择</span>
            <el-select
              v-model="forms.grade"
              placeholder="请选择年级"
            >
              <el-option
                v-for="item in gradeArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="province">
            <span>省份选择</span>
            <el-select
              v-model="forms.location"
              placeholder="请选择省份"
            >
              <el-option
                v-for="item in provinceArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div
          v-if="0"
          class="book-chapter"
        >
          <div class="condition">
            <el-checkbox v-model="forms.isLimit">
              限定教材章节范围
            </el-checkbox>
          </div>
          <div
            v-if="forms.isLimit"
            class="chapter-wrap"
          >
            <div class="edition">
              <el-select
                v-model="forms.version"
                placeholder="请选择版本"
                @change="versionChange"
              >
                <el-option
                  v-for="item in versionArr"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </div>
            <div class="volume-list">
              <el-checkbox
                v-for="item in registerArr"
                :key="item.volumeCode ? item.volumeCode : item.gradeCode"
                v-model="forms.register"
                :label="item.volumeCode ? item.volumeCode : item.gradeCode"
                @change="getPaperList($event, item)"
              >
                {{ item.gradeName + item.volumeName }}
              </el-checkbox>
            </div>
            <div
              v-if="chaptersResData.length && isShowChapter"
              class="chapter-list"
            >
              <div
                v-for="item in chaptersResData"
                v-show="item.textBookId && item.chapters.length"
                :key="item.textBookId"
                class="chapter-item"
              >
                <div class="grade">
                  {{ item.name }}
                </div>
                <!-- <el-checkbox-group v-model="forms.chapterId">
                  <el-checkbox v-for="itemChild in item.chapters" :key="itemChild.id" :label="itemChild.id">{{ itemChild.chapterName }}</el-checkbox>
                </el-checkbox-group> -->
                <div class="check-box">
                  <el-checkbox
                    v-for="itemChild in item.chapters"
                    :key="itemChild.id"
                    v-model="itemChild.check"
                    :label="itemChild.id"
                  >
                    {{ itemChild.chapterName }}
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 class="tit-item">
          <span />
          试卷题型题量
          <div class="icon-div">
            <span
              class="cur-span"
              @click="clearData"
            >
              <i class="el-icon-delete" />
              一键清除
            </span>
          </div>
        </h3>
        <div class="ques-type-num clearfix">
          <ul>
            <li
              v-for="(item, idx) in querTypeData"
              :key="item.code"
            >
              <span>{{ item.name }}：</span>
              <el-input-number
                v-model="item.questionNum"
                size="small"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
                step-strictly
                @change="
                  (a, b) => {
                    editQuesNum(a, b, item, idx)
                  }
                "
              />
            </li>
          </ul>
        </div>
        <h3
          class="tit-item"
          style="margin-top: 40px"
        >
          <span />
          细目表明细
        </h3>
        <div
          class="page-table"
          style="margin-bottom: 40px"
        >
          <el-table
            :data="quesAttrData"
            border
            style="width: 100%"
          >
            <!-- <el-table-column prop="titleNumber" label="题号" align="center" :resizable="false" width="90"></el-table-column> -->
            <el-table-column
              label="题号"
              :resizable="false"
              type="index"
              width="90"
              align="center"
            >
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="题型"
              align="center"
              :resizable="false"
            />
            <el-table-column
              prop="knowledge"
              label="知识点"
              align="center"
              :resizable="false"
              min-width="550"
            >
              <template #default="scope">
                <check-knowledge
                  v-if="row.knowledge.length"
                  :knowledge="row.knowledge"
                  :show-close="true"
                  @delete-check-node="deleteCheckNode"
                />
                <div
                  v-if="row.knowledge.length < 5"
                  class="knowledge"
                  @click="addKnowLedge(row)"
                >
                  <i class="el-icon-plus" />
                  <span>添加知识点</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="difficulty"
              label="难度"
              align="center"
              :resizable="false"
              min-width="150"
            >
              <template #default="scope">
                <el-select
                  v-model="row.difficulty"
                  placeholder="请选择难度"
                >
                  <el-option
                    v-for="(v, key) in diffsData"
                    :key="key"
                    :label="v.label"
                    :value="v.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="score" label="分值" align="center" :resizable="false" min-width="150">
              <template v-v-slot:scope>
                <el-input-number size="small" v-model="row.score" :precision="1" :min="1"
                  :max="100"></el-input-number>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="cz"
              label="操作"
              align="center"
              :resizable="false"
              width="112"
            >
              <template #default="scope">
                <i
                  class="el-icon-delete"
                  @click="deletQuesItem(row)"
                />
              </template>
            </el-table-column>
            <template #empty>
              <noresult-common
                text="暂无数据！"
              
                :show-img="false"
              />
            </template>
          </el-table>
        </div>
        <div class="bottom-body-fixed-switch">
          <div
            class="btn-wrap"
            :class="{ 'bottom-fixed': !buttomFixed }"
          >
            <!-- <el-button type="primary" class="btn1" round @click="submitForm">保存细目表</el-button> -->
            <el-button
              class="btn1"
              @click="reset"
            >
              重置细目表
            </el-button>
            <el-button
              type="primary"
              class="btn2"
              @click="submitForm('nextStep')"
            >
              生成试卷
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        v-model:visible="addDialog.visible"
        title="添加知识点"
        custom-class="knowledge-dia"
        :modal-append-to-body="false"
        :lock-scroll="false"
        :show-close="addDialog.showClose"
        :width="addDialog.width"
        @close="closes"
      >
        <div class="dialog-content">
          <div
            v-loading="treeLoading"
            class="tree-wrap mytree"
          >
            <!-- <div class="header">选择知识点</div> -->
            <!-- versionsList -->
            <div
              v-if="type === 0"
              style="padding: 12px 20px;"
            >
              <el-cascader
                v-model="versions"
                style="width: 100%;"
                :options="versionsList"
                :props="{ expandTrigger: 'hover' }"
                @change="versionsChange"
              />
            </div>
            <el-tree
              ref="lemonTree"
              :data="treeDataList"
              :indent="0"
              show-checkbox
              :check-strictly="checkStrictly"
              :props="defaultProps"
              :highlight-current="false"
              :expand-on-click-node="false"
              empty-text="暂无数据"
              icon-class="icon-expand el-icon-plus"
              node-key="code"
              @check="checkClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <span
                    class="tree-node-label"
                    @click="handleRowClick(node, data)"
                  >
                    <span v-html="data.name" />
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
          <div class="knowledge-wrap">
            <ul class="ai-choose-box">
              <li
                v-for="(value, index) in diaKnowArr"
                :key="index"
              >
                <span v-html="value.name" />
                <i
                  class="iconfont icon-close_line"
                  @click="deleteCheckNode(value)"
                />
              </li>
              <p v-if="!diaKnowArr.length" />
            </ul>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              class="btn btn-gray"
              @click="determine('empty')"
            >
              清 空
            </el-button>
            <el-button
              class="btn btn-shadow"
              @click="determine('determine')"
            >
              确 定
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
        v-model:visible="reminderDialog.visible"
        title="温馨提示"
        custom-class="reminder-dia"
        :modal-append-to-body="false"
        :show-close="reminderDialog.showClose"
        :width="reminderDialog.width"
      >
        <div
          class="dialog-content"
          style="flex-direction: column"
        >
          <h1 class="stip">
            <i class="el-icon-warning" />
            题号为{{
              noResultNum.join(',')
            }}在题库中未找到符合条件的目标试题，请老师知悉!
          </h1>
          <div
            class="page-table"
            style="width: 100%; overflow-y: auto"
          >
            <el-table
              :data="quesAttrNoData"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="titleNumber"
                label="题号"
                align="center"
                :resizable="false"
                width="90"
              />
              <el-table-column
                prop="name"
                label="题型"
                align="center"
                :resizable="false"
              />
              <el-table-column
                prop="knowledge"
                label="知识点"
                align="center"
                :resizable="false"
                min-width="500"
              >
                <template #default="scope">
                  <check-knowledge
                    v-if="row.knowledge.length"
                    :knowledge="row.knowledge"
                  />
                  <div v-else>
                    未选择知识点
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="difficulty"
                label="难度"
                align="center"
                :resizable="false"
                min-width="150"
              >
                <template #default="scope">
                  {{ diffsData[row.difficulty] || '不限' }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
                :resizable="false"
                min-width="150"
              >
                <template>
                  未查询到目标要求试题
                </template>
              </el-table-column>
              <template #empty>
                <noresult-common
                  class="noresult"
                  text="暂无数据！"
                />
              </template>
            </el-table>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              class="btn btn-shadow"
              @click="nextTo"
            >
              确 定
            </el-button>
          </div>
        </template>
      </el-dialog>
      <app-login ref="appLogin" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { arrayListSlice3, isLogin } from '@/common/js/util'
import { mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import windowScrollResetMixin from '@/common/mixins/windowScrollResetMixin'
import CheckKnowledge from './components/check-knowledge.vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
export default {
  name: 'BreakdownGroupPaper',
  components: { Breadcrumb, NoresultCommon, CheckKnowledge },
  mixins: [windowScrollResetMixin],
  data() {
    return {
      activeName: 'classBooks',
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '细目表组卷 ',
        },
      ],
      forms: {
        paperName: null,
        grade: null,
        location: '',
        version: null,
        isLimit: false,
        register: [],
        chapterId: [],
        paperQuestionNum: null,
        paperQuestionAttr: null,
      },
      textBookId: null,
      chapters: [],
      gradeArr: [],
      versionArr: [],
      registerArr: [],
      provinceArr: [],
      chaptersResData: [],
      querTypeData: [],
      quesAttrData: [],
      quesAttrNoData: [],
      noResultNum: [],
      quesAttrObj: {},
      diffsData: [
        { label: '不限', value: 0 },
        { label: '容易', value: 1 },
        { label: '较易', value: 2 },
        { label: '中等', value: 3 },
        { label: '较难', value: 4 },
        { label: '困难', value: 5 },
      ],
      addDialog: {
        visible: false,
        showClose: true,
        width: '1000px',
      },
      reminderDialog: {
        visible: false,
        showClose: true,
        width: '1050px',
      },
      checkStrictly: false, // 控制可选和不可选
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return !data.type
        },
      },
      treeLoading: true,
      treeDataList: [],
      diaKnowArr: [],
      checkItem: null,
      isCheck: false,
      isHavaId: null,
      isShowChapter: false,
      buttomFixed: true,
      versionsList: [],
      versions: '',
    }
  },
  computed: {
    ...mapState(['currSubject']),
    type() {
      return this.$route.query.type || 0
    },
  },
  watch: {
    type() {
      this.treeDataList = []
      this.getRelationKnowledgeCategoryId()
      this.clearData()
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'nextStepBreakdown') {
      this.forms = {
        paperName: null,
        grade: null,
        location: '',
        version: this.forms.version,
        isLimit: false,
        register: [],
        chapterId: [],
        paperQuestionNum: null,
        paperQuestionAttr: null,
      }
      this.isHavaId = null
      for (let item of this.querTypeData) {
        item.questionNum = 0
        this.quesAttrObj[item.questionType] = []
      }
      for (let items of this.chaptersResData) {
        items.chapters = []
      }
      this.quesAttrData = []
      this.isShowChapter = false
      this.$destroy()
      next()
    } else {
      this.$destroy()
      next()
    }
  },
  mounted() {
    // console.log(this.currSubject)
    this.getAreaList()
    this.getGradeData()
    // this.getVersionData()
    this.getRelationCategoryId()
    this.getRelationKnowledgeCategoryId(this.currSubject.subjectCode) // 获取关联id
    this.renderScrollFixed()
  },
  created() {
    this.initWindowsEvent()
  },
  unmounted() {
    this.unmountedWindowsEvent()
  },
  methods: {
    // render buttomFixed
    renderScrollFixed(e) {
      this.$nextTick(() => {
        let comparisonTop = window.innerHeight + this.getPageScrollTop() - 80
        let offsetTop = this.offsetDis(
          document.querySelector('.bottom-body-fixed-switch'),
        ).top
        if (comparisonTop >= offsetTop) {
          this.buttomFixed = true
        } else {
          this.buttomFixed = false
        }
      })
      // 获取 地址的高度
    },
    // 获取省级区域
    getAreaList() {
      this.apiGet({ urlPath: '/paper-builder/config/getAreas' }).then(res => {
        this.provinceArr = [{ id: '', name: '全国' }, ...res.data]
      })
    },
    // 获取年级数据
    getGradeData() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/paper-builder/config/getGrades' }, params).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.gradeArr = res.data
          }
        },
      )
    },
    // 获取版本数据
    getVersionData() {
      let parms = {
        categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
        code: this.currSubject.subjectCode,
      }
      this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data && res.data.length) {
            for (let item of res.data) {
              item.name =
                this.currSubject.periodName +
                this.currSubject.subjectName +
                item.name
            }
            this.versionArr = res.data
            this.forms.version = res.data[0].code
            this.getGradeCategoryId()
          }
        }
      })
    },
    // 版本change
    versionChange() {
      this.getGradeCategoryId()
      this.forms.register = []
      this.chaptersResData = []
    },
    // 获取年级和册列表
    getGradeCategoryId() {
      // 需求分解 查询教材版本下的所有类
      var classArrVom = []
      let parms = {
        categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
        code: this.forms.version,
      }
      this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // 判断是否是高中学段
          if (String(this.currSubject.periodCode) === '13') {
            res.data.forEach(item => {
              let currItem = {
                gradeCode: item.code,
                gradeName: item.name,
                volumeCode: '',
                volumeName: '',
              }
              classArrVom.push(currItem)
              this.chaptersResData.push({
                name: item.name,
                code: item.code,
                textBookId: null,
                chapters: [],
              })
            })
          } else {
            res.data.forEach(item => {
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
                  this.chaptersResData.push({
                    name: item.name + value.name,
                    code: value.code,
                    textBookId: null,
                    chapters: [],
                  })
                })
              }
            })
          }
          this.registerArr = classArrVom
          // console.log(this.chaptersResData, '566666666666')
        }
      })
    },
    // 获取章节数据
    getPaperList(check, itemAgument) {
      if (check) {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          versions: this.forms.version,
          grade: itemAgument.gradeCode,
          volume: itemAgument.volumeCode === '' ? 0 : itemAgument.volumeCode,
        }
        this.wayGet(API.BOOK_API_QUERY_CHAPTER_LAZY, parms, {
          showLoading: true,
        }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              if (
                res.data.bookText &&
                res.data.bookText.id &&
                res.data.chapters &&
                res.data.chapters.length
              ) {
                this.isShowChapter = true
                for (let item of res.data.chapters) {
                  item.check = false
                }
                // console.log(this.chaptersResData, 'this.chaptersResData', itemAgument)
                if (String(this.currSubject.periodCode) === '13') {
                  for (let it of this.chaptersResData) {
                    if (it.code === itemAgument.gradeCode) {
                      it.textBookId = res.data.bookText.id
                      it.chapters = res.data.chapters
                    }
                  }
                } else {
                  for (let it of this.chaptersResData) {
                    if (it.code === itemAgument.volumeCode) {
                      it.textBookId = res.data.bookText.id
                      it.chapters = res.data.chapters
                    }
                  }
                }
              }
            }
          } else {
            this.chaptersResData = []
            if (this.forms.register.length) {
              for (let item of this.forms.register) {
                this.chaptersResData.push({
                  name: null,
                  code: item,
                  textBookId: null,
                  chapters: [],
                })
              }
            }
          }
        })
      } else {
        this.isShowChapter = false
        for (let i = 0; i < this.chaptersResData.length; i++) {
          if (
            this.chaptersResData[i].name ===
            itemAgument.gradeName + itemAgument.volumeName
          ) {
            this.chaptersResData[i].chapters = []
            // this.chaptersResData.splice(i, 1)
          }
          if (this.chaptersResData[i].chapters.length) {
            this.isShowChapter = true
          }
        }
      }
    },
    // 获取当前学段试卷类型关联id
    getRelationCategoryId() {
      this.getTypesList()
      // let parms = {
      //   categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
      //   code: this.currSubject.subjectCode,
      //   level: '2',
      // }
      // this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     if (res.data.length) {
      //       this.getTypesList(res.data[1].relationCategoryId)
      //     } else {
      //       this.typesList = []
      //     }
      //   }
      // })
    },
    // 获取当前学段试卷类型
    getTypesList(relationCategoryId) {
      const data = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/lesson-app/config/getQuestionType' }, data).then(
        res => {
          const list = res.data || []
          list.forEach(item => {
            item.label = item.name
            item.value = item.id
          })
          this.querTypeData = list.map(v => {
            this.quesAttrObj[v.id] = []
            return {
              name: v.name,
              questionType: v.id,
              questionNum: 0,
            }
          })
        },
      )
    },
    // 题型设置数量
    editQuesNum(newV, oldV, item, idx) {
      let arr = []
      if (this.quesAttrData.length && this.isCheck) {
        if (newV > oldV) {
          for (let i = 0; i < newV - oldV; i++) {
            this.quesAttrObj[item.questionType].push({
              name: item.name,
              questionType: item.questionType,
              knowledge: [],
              difficulty: 0,
              score: 1,
            })
          }
          // console.log(this.quesAttrObj)
        } else if (newV < oldV) {
          for (let i = 0; i < oldV - newV; i++) {
            this.quesAttrObj[item.questionType].pop()
          }
          // console.log(this.quesAttrObj)
        }
        for (let key in this.quesAttrObj) {
          arr.push(...this.quesAttrObj[key])
        }
        this.quesAttrData = arr
      } else {
        if (newV > oldV) {
          for (let i = 0; i < newV - oldV; i++) {
            this.quesAttrObj[item.questionType].push({
              name: item.name,
              questionType: item.questionType,
              id: new Date().getTime(),
              knowledge: [],
              difficulty: 0,
              score: 1,
            })
          }
        } else if (newV < oldV) {
          let o = oldV - newV
          for (let s = 0; s < o; s++) {
            this.quesAttrObj[item.questionType].pop()
          }
        }
        // console.log(this.quesAttrObj)
        for (let key in this.quesAttrObj) {
          arr.push(...this.quesAttrObj[key])
        }
        this.quesAttrData = arr
        this.renderScrollFixed()
      }
    },
    // 删除行
    deletQuesItem(row) {
      this.quesAttrData.splice(this.quesAttrData.indexOf(row), 1)
      this.quesAttrObj[row.questionType].splice(
        this.quesAttrData.indexOf(row),
        1,
      )
      // console.log(this.quesAttrObj)
      for (let item of this.querTypeData) {
        if (item.name === row.name) {
          item.questionNum = item.questionNum - 1
        }
      }
      this.renderScrollFixed()
    },
    reset() {
      this.clearData()
    },
    // 删除所有
    clearData() {
      for (let itemQuerType of this.querTypeData) {
        itemQuerType.questionNum = 0
      }
      for (let key in this.quesAttrObj) {
        this.quesAttrObj[key] = []
      }
      // console.log(this.querTypeData)
      this.quesAttrData = []
      this.renderScrollFixed()
    },
    // 获取当前学段知识点关联id
    getRelationKnowledgeCategoryId(isSubjectCode, quescode) {
      if (this.type) {
        this.getTreeDataList()
      } else {
        this.treeLoading = false
        const url = { urlPath: '/lesson-app/config/getInvokeInfo' }
        const params = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        this.apiGet(url, params).then(res => {
          this.versionsList =
            res.data &&
            res.data.map(v => {
              return {
                label: v.name,
                value: v.id,
                children: v.gradeList.map(y => {
                  return {
                    label: y.volumeName,
                    value: `${v.id}-${y.gradeId}-${y.volumeId}`,
                  }
                }),
              }
            })
        })
      }
      // let parms = {
      //   categoryId: CTS.cfgDict.CID_KNOWLEDGE_PERIOD_SUBJECT,
      //   code: isSubjectCode,
      //   level: '2',
      // }
      // this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     if (res.data.length) {
      //       this.getTreeDataList(res.data[1].relationCategoryId, quescode)
      //     } else {
      //       this.treeLoading = false
      //     }
      //   }
      // })
    },
    versionsChange(v) {
      this.diaKnowArr = []
      this.getTreeDataList()
    },
    // 获取侧边栏数据
    getTreeDataList(knowledge, quescode) {
      this.treeLoading = true
      const versions = (this.versions[1] && this.versions[1].split('-')) || []
      const params = {
        catalogueType: [10, 11, 12][this.type],
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        version: versions[0],
        grade: versions[1],
        volume: versions[2],
      }
      // const url = { urlPath: '/paper-generator/knowledgeTree/getKnowledgeData' }
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      this.apiGet(url, params)
        .then(res => {
          const list = res.data || []
          const loop = arr => {
            arr.forEach(v => {
              v.code = v.uuid
              v.children && loop(v.children)
            })
          }
          loop(list)
          this.treeDataList = list
          this.$nextTick(() => {
            this.$refs['lemonTree'] &&
              this.$refs['lemonTree'].setCheckedKeys(this.diaKnowArr)
          })
        })
        .finally(() => {
          this.treeLoading = false
        })
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
    // 点击返回
    checkClick(data, isChecked) {
      let noMore = []
      let checkNodeList = this.$refs['lemonTree'].getCheckedNodes()
      for (let item of checkNodeList) {
        if (!item.children) {
          noMore.push({
            code: item.code,
            name: item.name,
          })
        }
      }
      if (noMore.length <= 5) {
        this.diaKnowArr = noMore
      } else {
        noMore = noMore.slice(0, 5)
        let arr = noMore.map(item => {
          return item.code
        })
        this.diaKnowArr = noMore
        this.$refs['lemonTree'].setCheckedKeys(arr)
        this.$message({
          type: 'warning',
          showClose: true,
          message: '所选知识点不能超过5条,为您选择前五条',
        })
      }
    },
    // 单个删除
    deleteCheckNode(val) {
      this.diaKnowArr.splice(
        this.diaKnowArr.findIndex(
          item => String(item.code) === String(val.code),
        ),
        1,
      )
      this.$refs['lemonTree'].setCheckedNodes(this.diaKnowArr)
    },
    // 打开添加知识点弹窗
    addKnowLedge(row) {
      this.addDialog.visible = true
      this.checkItem = row
      if (row.knowledge.length) {
        this.diaKnowArr = JSON.parse(JSON.stringify(row.knowledge))
        let arr = row.knowledge.map(item => {
          return item.code
        })
        this.$refs['lemonTree'].setCheckedKeys(arr)
      }
    },
    // 弹窗关闭
    closes() {
      this.addDialog.visible = false
      this.diaKnowArr = []
      this.checkItem = null
      this.$refs['lemonTree'].setCheckedKeys([])
    },
    // 弹窗确认
    determine(type) {
      if (type === 'determine') {
        if (this.diaKnowArr.length) {
          this.isCheck = true
        }
        this.$set(this.checkItem, 'knowledge', this.diaKnowArr)
        this.addDialog.visible = false
      } else {
        this.diaKnowArr = []
        this.$refs['lemonTree'].setCheckedKeys(this.diaKnowArr)
      }
    },
    submitForm(type) {
      if (!this.forms.paperName) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请输入试卷名称',
        })
        return
      }
      // if (!this.forms.grade) {
      //   this.$message({
      //     type: 'warning',
      //     showClose: true,
      //     message: '请选择年级',
      //   })
      //   return
      // }
      // if (!this.forms.location) {
      //   this.$message({
      //     type: 'warning',
      //     showClose: true,
      //     message: '请选择省份',
      //   })
      //   return
      // }
      var totalNum = this.querTypeData.reduce(function(prev, cur) {
        return cur.questionNum + prev
      }, 0)
      if (totalNum > 100) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '试卷总题数不能超过100题',
        })
        return
      }
      // console.log(this.quesAttrData, this.querTypeData, this.chaptersResData)
      let registerArr = []
      let querTypeData = []
      let quesAttrData = []
      for (let item of this.querTypeData) {
        if (item.questionNum > 0) {
          querTypeData.push({
            questionType: item.questionType,
            questionNum: item.questionNum,
          })
        }
      }
      if (querTypeData.length < 1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请设置试卷题型题量',
        })
        return
      }
      for (let i = 0; i < this.chaptersResData.length; i++) {
        let item = this.chaptersResData[i]
        if (
          this.forms.register &&
          this.forms.register.indexOf(item.code) !== -1
        ) {
          let itemRegister = {
            register: item.code,
            textBookId: item.textBookId,
            chapterCode: [],
          }
          registerArr.push(itemRegister)
          if (item.chapters && item.chapters.length) {
            for (let n = 0; n < item.chapters.length; n++) {
              if (item.chapters[n].check) {
                itemRegister.chapterCode.push(item.chapters[n].chapterCode)
              }
            }
            itemRegister.chapterCode = itemRegister.chapterCode.join(',')
          }
        }
      }
      // console.log(registerArr,this.forms.register)
      for (let i = 0; i < this.quesAttrData.length; i++) {
        let item = this.quesAttrData[i]
        if (!item.knowledge.length) {
          this.$message.warning('请选择知识点')
          return
        }
        quesAttrData.push({
          questionTypeIds: [item.questionType],
          knowledgePointIds: item.knowledge.map(v => v.code),
          difficulty: item.difficulty ? [item.difficulty] : null,
          // score: item.score,
          questionNum: 1,
        })
      }
      // console.log(registerArr, querTypeData, quesAttrData)
      let url = {
        urlPath:
          import.meta.env.VITE_PAPER_GENERATOR +
          '/paperGroupCatalogue/creatCatalogue',
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperName: this.forms.paperName,
        grade: this.forms.grade,
        location: this.forms.location,
        // version: this.forms.isLimit ? this.forms.version : null,
        // register: this.forms.isLimit ? JSON.stringify(registerArr) : null,
        // chapterId: this.forms.chapterId,
        // paperQuestionNum: querTypeData,
        details: quesAttrData,
      }
      if (this.isHavaId) {
        url = {
          urlPath:
            import.meta.env.VITE_PAPER_GENERATOR +
            '/paperGroupCatalogue/editCatalogue',
        }
        parms.id = this.isHavaId
      }
      // delete parms.location
      // console.log(parms)
      if (type && type === 'nextStep') {
        this.isNextStep(parms)
      } else {
        this.apiPost(url, parms, {
          showLoading: true,
        }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data && res.data.id) {
              this.isHavaId = res.data.id
            }
            this.$message.success('保存成功!')
          }
        })
      }
    },
    // 点击下一步判断是否能跳转
    isNextStep(parms) {
      let url = {
        urlPath:
          import.meta.env.VITE_PAPER_GENERATOR +
          '/paper-generate/v2/details-generate',
      }
      this.newPost(url, parms, {
        showLoading: true,
      }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$router.push('/paper/maker')
          // if (res.data) {
          //   let result = res.data
          //   if (result.isNoResult === 0) {
          //     // window.sessionStorage.setItem('questionData', JSON.stringify(result.result))
          //     this.$router.push({
          //       path: './nextstepbreakdown',
          //     })
          //   } else if (result.isNoResult === 1) {
          //     this.reminderDialog.visible = true
          //     // console.log(this.quesAttrData, result)
          //     // noResult: "1,2,3,4"
          //     this.noResultNum = result.noResult.split(',')
          //     this.quesAttrNoData = []
          //     for (let i = 0; i < this.noResultNum.length; i++) {
          //       if (this.quesAttrData[this.noResultNum[i] - 1]) {
          //         let nrNum = this.noResultNum[i] - 1
          //         this.quesAttrData[nrNum].titleNumber = this.noResultNum[i]
          //         this.quesAttrNoData.push(this.quesAttrData[nrNum])
          //       }
          //     }
          //   }
          // }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 部分帅选出试题
    nextTo() {
      this.reminderDialog.visible = false
      if (this.quesAttrNoData.length !== this.quesAttrData.length) {
        this.$router.push({
          path: './nextstepbreakdown',
        })
      }
    },
    // 我的细目表
    goMyBreakdown() {
      if (isLogin()) {
        this.$router.push('./mybreakdowngroup')
      } else {
        this.$refs.appLogin.showLogin()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.breakdown-group-paper {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  margin-bottom: 30px;

  .my-resources-list {
    margin: 20px 0;
    display: flex;
    background-color: $color-white;

    li {
      width: 88px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      margin: 10px;

      i {
        font-size: 16px;
        margin-right: 6px;
      }
    }

    li.active {
      color: white;
      background-color: rgb(0, 157, 255);
      border-radius: 15px;
    }

    li:hover {
      color: black;
    }
  }

  .my-breakdown {
    clear: both;
    background: #fff;
    overflow: hidden;

    .tit-my {
      font-size: 20px;
      font-family: Microsoft YaHei;
      color: #333333;
      height: 80px;
      border-bottom: 1px solid #eeeeee;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .icon-div {
        font-size: 14px;
        color: #487fff;
        display: flex;
        align-items: center;
        margin-top: 10px;

        .iconwodezujuan {
          font-size: 14px;
          font-weight: 100;
          padding-right: 5px;
        }

        > span {
          font-weight: 400;
          cursor: pointer;
        }
      }
    }

    .breakdown-content {
      padding: 0 30px;

      .tit-item {
        font-size: 16px;
        color: #333333;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 16px;
        position: relative;

        > i {
          color: #ff4b36;
        }

        > span {
          display: inline-block;
          width: 4px;
          height: 20px;
          background: #487fff;
          border-radius: 2px;
          margin-right: 8px;
        }

        .icon-div {
          flex: 1;
          text-align: left;
          padding-left: 40px;
          font-size: 14px;
          font-weight: 100;
          color: #487fff;

          .cur-span {
            cursor: pointer;
          }

          .el-button {
            padding: 8px 20px;
          }
        }
      }

      .paper-name {
        width: 560px;
        padding-bottom: 20px;

        :deep(.el-input) {
          .el-input__inner,
          .el-input__icon {
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
          }
        }
      }

      .paper-requirement {
        display: flex;

        .grade,
        .province {
          display: flex;
          flex-direction: column;

          > span {
            font-size: 14px;
            color: #999;
            padding-bottom: 10px;
          }

          :deep(.el-select) {
            width: 270px;
            margin-right: 20px;
            margin-bottom: 30px;

            .el-input__inner,
            .el-input__icon {
              line-height: 30px;
              height: 30px;
              border-radius: 4px;
            }
          }
        }
      }

      .book-chapter {
        margin-bottom: 40px;

        .condition {
          margin-bottom: 15px;
        }

        .chapter-wrap {
          border: 1px solid #e2e2e2;
          padding: 20px 30px;

          .edition {
            :deep(.el-select) {
              width: 270px;
              margin-bottom: 20px;

              .el-input__inner,
              .el-input__icon {
                line-height: 30px;
                height: 30px;
                border-radius: 4px;
              }
            }
          }

          .volume-list {
            margin-bottom: 5px;

            .el-checkbox {
              margin-bottom: 15px;
            }
          }

          .chapter-list {
            padding: 25px 25px 5px 25px;
            background: #f4f5fa;

            .chapter-item {
              display: flex;

              .grade {
                white-space: pre;
                padding-top: 5px;
                padding-right: 15px;
              }

              .check-box {
                .el-checkbox {
                  margin-bottom: 15px;
                }
              }
            }

            .el-checkbox-group {
              .el-checkbox {
                margin-bottom: 20px;
              }
            }
          }
        }
      }

      .ques-type-num {
        ul {
          li {
            width: 30%;
            float: left;
            // margin-right: 50px;
            margin-bottom: 20px;

            > span {
              display: inline-block;
              width: 140px;
              text-align: right;
            }

            :deep(.el-input-number) {
              span[role='button'] {
                height: 28px;
              }

              .el-input__inner,
              .el-input__icon {
                border-radius: 4px;
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }

      :deep(.page-table) {
        .el-table {
          thead {
            th:first-child {
              padding-left: 0;
            }
          }

          td:first-child {
            padding-left: 0;
          }

          .el-input__icon {
            line-height: 32px;
          }

          .el-input__inner {
            border-radius: 4px;
          }

          .knowledge {
            color: #487fff;
            display: inline-block;
            padding: 2px 11px;
            border: 1px dashed;
            border-radius: 4px;
            cursor: pointer;

            .el-icon-plus {
              font-size: 12px;
              padding-right: 10px;
            }
          }

          .el-input__inner,
          .el-input__icon {
            height: 30px;
            line-height: 30px;
            text-align: center;
          }

          span[role='button'] {
            height: 28px;
          }

          .el-icon-delete {
            font-size: 14px;
            cursor: pointer;
          }

          .el-icon-delete:hover {
            color: #487fff;
          }
        }

        .el-table__empty-block {
          border-bottom: 1px solid #ebeef5;
        }
      }

      .btn-wrap {
        padding-bottom: 40px;

        text-align: center;

        .el-button {
          width: 130px;
          border-color: #487fff;
        }

        .btn1 {
          background-color: #fff;
          color: #487fff;
        }

        .btn2 {
          color: #fff;
          background-color: #487fff;
          margin-left: 20px;
        }
      }
    }
  }

  .dialog-content {
    .stip {
      font-size: 14px;
      text-align: center;
      padding: 30px 0;

      i {
        color: #e6a23c;
        padding-right: 10px;
      }
    }

    text-align: left;
    background: #fff;
    border-bottom: 1px solid #ccc;
    display: flex;
    height: 100%;

    .mytree {
      width: 640px;
      background: #fff;
      overflow: hidden;
      overflow-y: auto;
      margin: 20px 0 0 20px;
      border: 1px solid #e2e2e2;
      border-radius: 6px;

      .el-tree {
        padding: 15px 0 15px 24px;
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
        background: #fff;
      }
    }

    .knowledge-wrap {
      background: #fff;
      width: calc(100% - 20px);
      margin: 20px;
      border: 1px solid #e2e2e2;
      border-radius: 6px;
      margin-bottom: 0;

      .ai-choose-box {
        padding: 20px 20px 42px 20px;

        li {
          display: inline-block;
          line-height: 28px;
          padding: 0 10px;
          margin-right: 10px;
          margin-bottom: 5px;
          background: #ebf2fb;
          border-radius: 16px;

          i {
            font-size: 10px;
            margin-left: 15px;
          }
        }

        li:hover {
          cursor: pointer;
          background: #dce9fb;

          i {
            color: $color-theme;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
  @use "@/assets/css/variables" as *;
.knowledge-dia,
.reminder-dia {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -49%);
  max-height: calc(100% - 325px);
  height: calc(100% - 325px);
  max-width: calc(100% - 325px);
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    overflow: hidden;
    height: calc(100% - 56px);
  }
}

.bottom-body-fixed-switch {
  position: relative;
  height: 80px;
  box-sizing: border-box;

  .bottom-fixed {
    position: fixed;
    bottom: 0;
    z-index: 10;
    margin-left: -30px;
    width: 1200px;
    background-color: #fff;

    padding-top: 20px;
  }
}
</style>
