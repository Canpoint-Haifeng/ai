<template>
  <div class="breakdown-group-paper">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="my-breakdown">
      <h1 class="tit-my">
        <span>细目表组卷</span>
        <div
          class="icon-div"
          @click="$router.push('./mybreakdowngroup')"
        >
          <i class="icon iconfont iconximubiaozujuan" />
          <span>我的细目表</span>
        </div>
      </h1>
      <div class="breakdown-content">
        <h3 class="tit-item">
          <span />
          试卷名称
        </h3>
        <div class="paper-name">
          <el-input
            v-model="forms.paperName"
            placeholder="请输入试卷名称"
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
                :key="item.code"
                :label="item.name"
                :value="item.code"
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
        <div class="book-chapter">
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
              v-for="item in querTypeData"
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
                    editQuesNum(a, b, item)
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
          试卷题型题量
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
                  v-if="scope.row.knowledge.length"
                  :knowledge="scope.row.knowledge"
                  :show-close="true"
                />
                <div
                  v-if="scope.row.knowledge.length < 5"
                  class="knowledge"
                  @click="addKnowLedge(scope.row)"
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
                  v-model="scope.row.difficulty"
                  placeholder="请选择难度"
                >
                  <el-option
                    v-for="(val, key) in diffsData"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              label="分值"
              align="center"
              :resizable="false"
              min-width="150"
            >
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.score"
                  size="small"
                  :min="1"
                  :max="100"
                />
              </template>
            </el-table-column>
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
                  @click="deletQuesItem(scope.row)"
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
        <div class="btn-wrap">
          <el-button
            type="primary"
            class="btn1"
            round
            @click="submitForm"
          >
            保存细目表
          </el-button>
          <el-button
            round
            class="btn2"
            @click="submitForm('nextStep')"
          >
            预览试卷
          </el-button>
        </div>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        :visible="addDialog.visible"
        title="添加知识点"
        custom-class="knowledge-dia"
        :modal-append-to-body="false"
        :lock-scroll="false"
        :show-close="addDialog.showClose"
        :width="addDialog.width"
        @update:visible="addDialog.visible = $event"
        @close="closes"
      >
        <div class="dialog-content">
          <div
            v-loading="treeLoading"
            class="tree-wrap mytree"
          >
            <!-- <div class="header">选择知识点</div> -->
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
                  class="iconfont iconclose"
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
        :visible="reminderDialog.visible"
        title="温馨提示"
        custom-class="reminder-dia"
        :modal-append-to-body="false"
        :lock-scroll="false"
        :show-close="reminderDialog.showClose"
        :width="reminderDialog.width"
        @update:visible="reminderDialog.visible = $event"
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
                    v-if="scope.row.knowledge.length"
                    :knowledge="scope.row.knowledge"
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
                  {{ diffsData[scope.row.difficulty] || '不限' }}
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
                <noresult-common text="暂无数据！" />
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import CheckKnowledge from './components/check-knowledge.vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
export default {
  components: { Breadcrumb, NoresultCommon, CheckKnowledge },
  data() {
    return {
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '试卷细目表',
        },
      ],
      forms: {
        paperName: null,
        grade: null,
        location: null,
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
      diffsData: {
        0: '不限',
      },
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
      isShowChapter: false,
    }
  },
  computed: {
    ...mapState(['currSubject', 'paperGroupCatalogue']),
  },
  mounted() {
    // console.log(this.currSubject)
    this.init()
  },
  methods: {
    // 获取细目表信息
    async getKnowledgeInfo() {
      let url = {
        urlPath:
          process.env.VUE_APP_PAPER_GENERATOR +
          '/paperGroupCatalogue/paperCatalogue',
      }
      let parms = {
        paperIdEnc: this.$route.query.paperIdEnc,
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        source: this.$route.query.source,
      }
      let res = {}

      if (this.$route.query.type && this.$route.query.type == '3') {
        if (this.paperGroupCatalogue) {
          res.code = 200
          res.data = this.paperGroupCatalogue
        } else {
          this.$router.push('/paper/maker')
          return
        }
      } else {
        if (parms.paperIdEnc && parms.source) {
          res = await this.apiGet(url, parms, { showLoading: true })
        }
      }
      if (res.code === CTS.constant.SUCCESS_CODE) {
        // console.log(res.data)
        this.forms.paperName = res.data.paperName
        if (res.data.grade) {
          this.forms.grade = res.data.grade + ''
        }
        this.forms.location = res.data.location || ''
        if (res.data.version) {
          // console.log(this.versionArr)
          this.forms.isLimit = true
          this.forms.version = res.data.version + ''
        }
        if (res.data.register) {
          let register = JSON.parse(res.data.register)
          for (let item of register) {
            this.forms.register.push(item.register)
            // console.log(this.registerArr)
            for (let it of this.registerArr) {
              if (
                item.register === it.gradeCode ||
                item.register === it.volumeCode
              ) {
                this.getPaperList(true, it, item.chapterCode)
              }
            }
          }
        }
        if (res.data.paperQuestionTypeNum) {
          let paperQuestionTypeNum = res.data.paperQuestionTypeNum
          for (let oQues of paperQuestionTypeNum) {
            // console.log(this.querTypeData)
            for (let nQues of this.querTypeData) {
              if (oQues.questionType.substr(0, 2) === nQues.questionType) {
                if (nQues.questionNum) {
                  nQues.questionNum += oQues.questionNum
                } else {
                  nQues.questionNum = oQues.questionNum
                }
              }
            }
          }
        }
        if (res.data.paperQuestionAttr) {
          let paperQuestionAttr = res.data.paperQuestionAttr
          for (let attr of paperQuestionAttr) {
            if (attr.knowledgeName) {
              attr.knowledge = JSON.parse(attr.knowledgeName)
            }
            if (attr.knowledge === '') {
              attr.knowledge = []
            }
            attr.questionType = attr.questionType.substr(0, 2)
            for (let type of this.querTypeData) {
              if (attr.questionType === type.questionType) {
                attr.name = type.name
              }
            }
          }
          // 合并
          let arr = []
          for (let p of paperQuestionAttr) {
            let attrobj = {
              name: p.name,
              questionType: p.questionType,
              knowledge: p.knowledge,
              difficulty: p.difficulty === null ? '0' : p.difficulty,
              score: p.score,
            }
            this.quesAttrObj[p.questionType].push(attrobj)
            arr.push(attrobj)
          }
          // let arr = []
          // for (let key in this.quesAttrObj) {
          //   arr.push(...this.quesAttrObj[key])
          // }
          this.quesAttrData = arr
        }
      } else if (res.code === CTS.constant.SYSTEM_ERROR_CODE) {
        this.$message.error(res.msg)
      }
    },
    init() {
      // 获取省级区域
      this.getAreaList()
      // 获取年级数据
      this.getGradeData()
      // 获取版本数据
      this.getVersionData()
      // 获取当前学段试卷类型关联id
      this.getRelationCategoryId()
      // 获取难度
      this.getQuestionDiffList()
      // 获取当前学段知识点关联id
      this.getRelationKnowledgeCategoryId(this.currSubject.subjectCode)
      // 获取细目表信息
      this.getKnowledgeInfo()
    },
    // 获取省级区域
    getAreaList() {
      this.apiGet({ urlPath: '/paper-builder/config/getAreas' }).then(res => {
        this.provinceArr = [{ id: '', name: '全国' }, ...res.data]
      })
    },
    // 获取年级数据
    async getGradeData() {
      let parms = {
        categoryId: CTS.cfgDict.CID_USER_PERIOD_GRADE,
        code: this.currSubject.periodCode,
      }
      let res = await this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        if (res.data) {
          let arrData = res.data.filter(item => item.code !== '1216')
          this.gradeArr = arrData
        }
      }
    },
    // 获取版本数据
    async getVersionData() {
      let parms = {
        categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
        code: this.currSubject.subjectCode,
      }
      let res = await this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms)
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
    },
    // 版本change
    versionChange() {
      this.getGradeCategoryId()
      this.forms.register = []
      this.chaptersResData = []
    },
    // 获取年级和册列表
    async getGradeCategoryId() {
      // 需求分解 查询教材版本下的所有类
      var classArrVom = []
      let parms = {
        categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
        code: this.forms.version,
      }
      let res = await this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms)
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
        // console.log(this.registerArr, '566666666666')
      }
    },
    // 获取章节数据
    async getPaperList(check, itemAgument, chapterCodes) {
      if (check) {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          versions: this.forms.version,
          grade: itemAgument.gradeCode,
          volume: itemAgument.volumeCode === '' ? 0 : itemAgument.volumeCode,
        }
        let res = await this.wayGet(API.BOOK_API_QUERY_CHAPTER_LAZY, parms, {
          showLoading: true,
        })
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
                if (
                  chapterCodes &&
                  chapterCodes.indexOf(item.chapterCode) !== -1
                ) {
                  item.check = true
                } else {
                  item.check = false
                }
              }
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
      } else {
        this.isShowChapter = false
        for (let i = 0; i < this.chaptersResData.length; i++) {
          if (
            this.chaptersResData[i].name ===
            itemAgument.gradeName + itemAgument.volumeName
          ) {
            // this.chaptersResData.splice(i, 1)
            this.chaptersResData[i].chapters = []
          }
          if (this.chaptersResData[i].chapters.length) {
            this.isShowChapter = true
          }
        }
      }
    },
    // 获取当前学段试卷类型关联id
    async getRelationCategoryId() {
      this.getTypesList()
      // let parms = {
      //   categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
      //   code: this.currSubject.subjectCode,
      //   level: '2',
      // }
      // let res = await this.wayGet(API.GET_CHILD_DICT, parms)
      // if (res.code === CTS.constant.SUCCESS_CODE) {
      //   if (res.data.length) {
      //     await this.getTypesList(res.data[1].relationCategoryId)
      //   } else {
      //     this.typesList = []
      //   }
      // }
    },
    // 获取当前学段试卷类型
    async getTypesList(relationCategoryId) {
      // if (!relationCategoryId) {
      //   return
      // }
      // let parms = {
      //   categoryId: relationCategoryId,
      //   level: '1,2',
      // }
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
            this.quesAttrObj[v.code] = []
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
    editQuesNum(newV, oldV, item) {
      let arr = []
      if (this.quesAttrData.length && this.isCheck) {
        if (newV > oldV) {
          for (let i = 0; i < newV - oldV; i++) {
            this.quesAttrObj[item.questionType].push({
              name: item.name,
              questionType: item.questionType,
              knowledge: [],
              difficulty: '0',
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
              difficulty: '0',
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
    },
    // 删除所有
    clearData() {
      for (let itemQuerType of this.querTypeData) {
        itemQuerType.questionNum = 0
      }
      for (let key in this.quesAttrObj) {
        this.quesAttrObj[key] = []
      }
      // console.log(this.quesAttrObj)
      this.quesAttrData = []
    },
    // 获取难度
    async getQuestionDiffList() {
      let parms = {
        categoryId: CTS.cfgDict.CID_QUESTION_DIFF,
        level: 1,
      }
      let res = await this.wayGet(API.GET_DICT_BY_LEVEL, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        let arrData = res.data
        for (let item of arrData) {
          this.diffsData[item.code] = item.name
        }
        // console.log(this.diffsData)
      }
    },
    // 获取当前学段知识点关联id
    getRelationKnowledgeCategoryId(isSubjectCode, quescode) {
      let parms = {
        categoryId: CTS.cfgDict.CID_KNOWLEDGE_PERIOD_SUBJECT,
        code: isSubjectCode,
        level: '2',
      }
      this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data.length) {
            this.getTreeDataList(res.data[1].relationCategoryId, quescode)
          } else {
            this.treeLoading = false
          }
        }
      })
    },
    // 获取侧边栏数据
    getTreeDataList(knowledge, quescode) {
      let parms = {
        categoryId: knowledge,
        isFilterDeprecated: 1,
      }
      this.wayGet(API.GET_ALL_BY_CID, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.treeLoading = false
          this.treeDataList = res.data
        } else {
          this.treeLoading = false
        }
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
        if (!item.type) {
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
          if (item.code) {
            return item.code
          } else {
            return item
          }
        })
        this.$nextTick(() => {
          // console.log(this.$refs['lemonTree'])
          this.$refs['lemonTree'].setCheckedKeys(arr)
        })
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
      if (!this.forms.grade) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请选择年级',
        })
        return
      }
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
          registerArr.push({
            register: item.code,
            textBookId: item.textBookId,
            chapterCode: [],
          })
          if (item.chapters && item.chapters.length) {
            for (let n = 0; n < item.chapters.length; n++) {
              if (item.chapters[n].check) {
                registerArr[i].chapterCode.push(item.chapters[n].chapterCode)
              }
            }
            registerArr[i].chapterCode = registerArr[i].chapterCode.join(',')
          }
        }
      }
      for (let i = 0; i < this.quesAttrData.length; i++) {
        let itemQuesAttr = this.quesAttrData[i]
        quesAttrData.push({
          questionType: itemQuesAttr.questionType,
          knowledge: itemQuesAttr.knowledge
            .map(it => {
              return it.code
            })
            .join(','),
          difficulty:
            itemQuesAttr.difficulty === '0' ? null : itemQuesAttr.difficulty,
          score: itemQuesAttr.score,
        })
      }
      // console.log(registerArr, querTypeData, quesAttrData)
      let url = {
        urlPath:
          process.env.VUE_APP_PAPER_GENERATOR +
          '/paperGroupCatalogue/creatCatalogue',
      }
      let parms = {
        paperName: this.forms.paperName,
        grade: this.forms.grade ? this.forms.grade.substring(2, 4) : null,
        location: this.forms.location,
        version: this.forms.isLimit ? this.forms.version : null,
        register: this.forms.isLimit ? JSON.stringify(registerArr) : null,
        // chapterId: this.forms.chapterId,
        paperQuestionNum: JSON.stringify(querTypeData),
        paperQuestionAttr: JSON.stringify(quesAttrData),
        // stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
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
            this.$message.success('保存成功!')
          }
        })
      }
    },
    // 点击下一步判断是否能跳转
    isNextStep(parms) {
      let url = {
        urlPath:
          process.env.VUE_APP_PAPER_GENERATOR + '/paperGroupCatalogue/nextStep',
      }
      this.apiPost(url, parms, {
        showLoading: true,
      }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data) {
            let result = res.data
            if (result.isNoResult === 0) {
              // window.sessionStorage.setItem('questionData', JSON.stringify(result.result))
              this.$router.push({
                path: './nextstepbreakdown',
              })
            } else if (result.isNoResult === 1) {
              this.reminderDialog.visible = true
              // console.log(this.quesAttrData, result)
              // noResult: "1,2,3,4"
              this.noResultNum = result.noResult.split(',')
              this.quesAttrNoData = []
              for (let i = 0; i < this.noResultNum.length; i++) {
                if (this.quesAttrData[this.noResultNum[i] - 1]) {
                  this.quesAttrData[
                    this.noResultNum[i] - 1
                  ].titleNumber = this.noResultNum[i]
                  this.quesAttrNoData.push(
                    this.quesAttrData[this.noResultNum[i] - 1],
                  )
                }
              }
            }
          }
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
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.breakdown-group-paper {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  margin-bottom: 30px;

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
        margin-top: 25px;
        .iconximubiaozujuan {
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

        > span {
          display: inline-block;
          width: 2px;
          height: 16px;
          background: #487fff;
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

        :deep(.el-input)) {
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

          :deep(.el-select)) {
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
            :deep(.el-select)) {
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
            width: 40%;
            float: left;
            // margin-right: 50px;
            margin-bottom: 20px;
            > span {
              display: inline-block;
              width: 140px;
              text-align: right;
            }
            :deep(.el-input-number)) {
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

      :deep(.page-table)) {
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
        margin-bottom: 40px;
        text-align: center;
        .el-button {
          width: 130px;
          border-color: #487fff;
        }
        .btn1 {
          background-color: #487fff;
        }
        .btn1:hover {
          background-color: #3e73cd;
          border-color: #3e73cd;
        }
        .btn2 {
          color: #487fff;
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
</style>
