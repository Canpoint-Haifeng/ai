<template>
  <div class="ai-container">
    <div class="container-card">
      <div class="header">
        <div>
          <i class="el-icon-warning" />
          <span>中高考复习试卷更适合细目表组卷或平行组卷</span>
        </div>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-setting"
          @click="advanced = !advanced"
        >
          {{ advanced ? '普通' : '高级' }}设置
        </el-button>
      </div>
      <div
        v-if="!advanced"
        class="border"
      >
        <div class="m_title">
          <p class="title_border">
            已选考点
          </p>
          <span
            class="clear"
            @click="deleteAll"
          >
            <i class="el-icon-delete" />
            全部清空
          </span>
        </div>
        <ul class="ai-choose-box">
          <li
            v-for="v in interCheckNodeCodeKnowledgeArr"
            :key="v.id"
            class="li-item"
          >
            <div class="pNmae">
              {{ v.name }}
              <i
                class="el-icon-delete"
                style="color: #ff6e5d; cursor: pointer;"
                @click="delParent(v)"
              />
            </div>
            <div class="nameWrap">
              <!-- 循环children -->
              <el-tag
                v-for="c in v.selChildren"
                :key="c.id"
                class="nameTag"
                :class="[
                  formatClass(c.importance),
                  c.required ? 'tagClass1' : '',
                ]"
                size="medium"
                closable
                effect="plain"
                @close="delChildren(c)"
                @click="requiredHandle(c)"
              >
                <!-- <i
                  v-if="c.modelLevel || c.importance"
                  class="el-icon-star-on coefficient"
                  :class="formatClass(c.importance)"
                ></i></template> -->
                <i
                  v-if="c.types === 2"
                  class="el-icon-star-on coefficient"
                  style="color:#ed7764"
                />
                {{ c.name }}
                <i
                  v-if="c.num"
                  class="num"
                >{{ c.num }}</i>
              </el-tag>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
              </el-tag>
            </div>
          </li>
          <p v-if="!interCheckNodeCodeKnowledgeArr.length">
            未选择，请从左侧列表中选择知识点。
          </p>
        </ul>
        <div class="py-15">
          <div class="title_border mb-24">
            题型数量：
          </div>
          <div class="questionWrap">
            <div
              v-for="v in questionTypes"
              :key="v.id"
              class="flex align-center"
            >
              <div class="questTypeName">
                {{ v.questTypeName }}：
              </div>
              <div>
                <el-input-number
                  v-model="v.num"
                  :min="0"
                  :max="100"
                />
              </div>
              <i
                class="el-icon-delete"
                @click="deleteItem(v)"
              />
            </div>
          </div>
          <div class="addWrap">
            <div
              class="addBtn"
              @click="addQuestionType"
            >
              <i class="el-icon-plus" />
              添加题型
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="advanced_setting"
      >
        <div class="table">
          <div class="thead">
            <span>题号</span>
            <span>知识点</span>
            <span>考点</span>
            <span>题量</span>
            <span>题型难度</span>
            <span>操作</span>
          </div>
          <div
            v-for="(item, index) in interCheckNodeCodeKnowledgeArr"
            :key="index"
            class="tr"
          >
            <div>{{ index + 1 }}</div>
            <div>{{ item.name }}</div>
            <div class="content">
              <div
                v-for="(v, i) in item.selChildren"
                :key="i"
              >
                <div class="testing_point">
                  <i
                    class="el-icon-star-on"
                    style="color: #ff6e5d;"
                  />
                  <span>{{ v.name }}</span>
                </div>
                <div class="count">
                  <div class="input">
                    <i @click="countChange(0)" />
                    <!-- <s @click="countChange(1)"></s> -->
                    <s />
                    <el-input-number
                      v-model="v.num"
                      :min="v.num"
                      :max="100"
                      @change="countChange(v)"
                    />
                  </div>
                </div>
                <!-- <div class="question_types">
                  <el-select v-model="v.questionType" placeholder="请选择">
                    <el-option v-for="y in allQuestionTypes" :key="y.id"
                      :label="y.questTypeName"
                      :value="y.id">
                    </el-option>
                  </el-select>
                </div> -->
                <div class="difficulty">
                  <div
                    v-for="(y, j) in v.quesType"
                    :key="j"
                    class="item"
                  >
                    <span>{{ j + 1 }}.</span>
                    <el-select
                      v-model="y.typeId"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="y in allQuestionTypes"
                        :key="y.id"
                        :label="y.questTypeName"
                        :value="y.id"
                      />
                    </el-select>
                    <el-select
                      v-model="y.difficulty"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="k in difficultyList"
                        :key="k.value"
                        :label="k.label"
                        :value="k.value"
                      />
                    </el-select>
                    <i
                      class="el-icon-circle-close"
                      style="color: #487FFF;"
                      @click="delQuesType(v.quesType, j, v)"
                    />
                  </div>
                </div>
                <div class="operation">
                  <span @click="delChildren(v)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="question_num">
          <p class="title_border">
            题型数量
          </p>
          <div>
            <!-- <div v-for="v in 7" :key="v">
              <span>10</span>
              <p>选择题</p>
            </div> -->
            <div
              v-for="(v, i) in questionTypes"
              :key="i"
            >
              <p>{{ v.questTypeName }}: {{ v.num }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-card mt-16">
      <div class="card-body">
        <!-- 题型和数量 -->
        <!-- 难度 -->
        <div :class="{ disabled: advanced }">
          <Difficulty
            ref="difficultyRef"
            :total="total"
            :advanced="advanced"
          />
        </div>
        <!-- 所在地区 -->
        <!-- <div class="py-15 flex align-center">
          <div class="title mr-10">考试所在地区：</div>
          <div class="regionWrap">
            <cp-national-regions
              ref="regionsRef"
              @changeRegions="changeRegions"
            ></cp-national-regions>
          </div>
        </div> -->
        <div class="btn-box">
          <el-button
            type="primary"
            class="product-paper"
            @click="makeQuestionMethod"
          >
            生成试卷
          </el-button>
        </div>
      </div>
    </div>
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
    <!---->

    <!---->
    <!---->
    <!-- 无知识点提示框 -->
    <no-que-message ref="knowledgeMessage" />
    <!---->
    <el-dialog
      :visible="visible"
      @update:visible="visible = $event"
      title="添加题型"
      width="30%"
      @close="visible = false"
    >
      <div>
        <el-checkbox
          v-for="item in allQuestionTypes"
          :key="item.id"
          v-model="item.activated"
          class="checkboxItem"
        >
          {{ item.questTypeName }}
        </el-checkbox>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmHandle"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="questionTypeVisible"
      @update:visible="questionTypeVisible = $event"
      title="添加题型"
      width="30%"
      @close="questionTypeVisible = false"
    >
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in allQuestionTypes"
            :key="item.id"
            :label="item.id + '-' + item.questTypeName"
          >
            {{ item.questTypeName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="questionTypeVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmCheck"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { getToken, isLogin } from '@/common/js/util'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import NoQueMessage from '@/components/NoQueMessage/NoQueMessage'
import Difficulty from './Difficulty.vue'
import { CpNationalRegions } from '@/components/CpFan/index'

export default {
  components: {
    NoresultCommon,
    NoQueMessage,
    Difficulty,
    CpNationalRegions,
  },
  mixins: [questionItemMixin],
  props: {
    currScence: {
      type: Object,
      default: () => {},
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
    isChapter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      advancedList: [],
      checkList: [],
      questionTypeVisible: false,
      currentPoint: [],
      questionTypes: [],
      checkNodeCodeKnowledge: '',
      interCheckNodeCodeKnowledgeArr: [],
      SelectObj: {},
      typesList: [],
      difficultyList: [
        { label: '容易', value: 1 },
        { label: '较易', value: 2 },
        { label: '中等', value: 3 },
        { label: '较难', value: 4 },
        { label: '困难', value: 5 },
      ],
      yearList: [
        {
          label: '不限',
          value: 0,
        },
        {
          label: '一年内',
          value: 1,
        },
        {
          label: '两年内',
          value: 2,
        },
        {
          label: '三年内',
          value: 3,
        },
        {
          label: '五年内',
          value: 5,
        },
      ],
      yearType: 0,
      region: {
        province: '',
        city: '',
        area: '',
      },
      total: 0,
      count: {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      },
      visible: false,
      allQuestionTypes: [],
      advanced: false,
    }
  },
  watch: {
    currScence(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.getQuestTypes()
      }
    },
    questionTypes: {
      handler() {
        // if(!advanced) return
        console.log('questionTypesquestionTypes')
        this.numChange()
        this.delayChange()
      },
      deep: true,
    },
    total() {
      if (this.advanced) return
      this.getNum()
    },
    advanced(v) {},
    interCheckNodeCodeKnowledgeArr: {
      handler(list) {
        if (!this.advanced && !this.advancedLoaded) return
        const res = []
        list.forEach(v => {
          v.selChildren.forEach(y => {
            if (!y.quesType) {
              throw new Error('操作成功')
            }
            y.quesType.forEach(z => {
              res.push(z)
            })
          })
        })
        this.advancedList = res
        const obj = {}
        const difficulty = [0, 0, 0, 0, 0]
        res.forEach(v => {
          difficulty[v.difficulty - 1]++
          if (obj[v.typeId]) {
            obj[v.typeId]++
          } else {
            obj[v.typeId] = 1
          }
        })
        console.log(obj)
        console.log(difficulty)
        this.questionTypes = this.questionTypes.map(v => {
          return {
            ...v,
            num: obj[v.questionTypeId] || 0,
          }
        })
        // console.log(this.$refs.difficultyRef.seting,11)
        this.$refs.difficultyRef.seting.forEach((v, i) => {
          v.value = difficulty[i]
        })
        console.log(this.questionTypes)
      },
      deep: true,
    },
  },
  activated() {
    const obj = sessionStorage.getItem('questionParams')
    if (!obj) {
      this.Bus.$on('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
      this.interCheckNodeCodeKnowledgeArr = []
      this.count = {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      }
      this.$refs.difficultyRef.initialize()
      this.yearType = 0
      // this.$refs.regionsRef.initCreated()
      // this.$refs.regionsRef.cityList = []
      // this.$refs.regionsRef.areaList = []
    }
  },
  // deactivated() {

  // },
  beforeUnmount() {
    this.Bus.$off('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
  },
  computed: {
    ...mapState(['currSubject', 'fullpath']),
    formatClass() {
      return function(val) {
        let str = ''
        if (val) {
          if (1 <= val && val <= 2.5) {
            str = 'gray'
          } else if (val <= 3.5) {
            str = 'yellow'
          } else if (val <= 4.5) {
            str = 'orange'
          } else if (val <= 5) {
            str = 'red'
          }
        }
        return str
      }
    },
  },
  mounted() {
    // 监听添加试题
    this.Bus.$on('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
  },
  created() {
    // this.getQuestionDiffList() // 题目难度
    // this.getYearsList() // 题目年份
    // this.getRelationCategoryId() // 题目类型
  },
  unmounted() {
    this.Bus.$off('interCheckNodeCodeKnowledge')
  },
  methods: {
    changeQuestionType(v) {
      this.checkList = v.questionTypes.map(
        item => item.id + '-' + item.questionTypeName,
      )
      this.questionTypeVisible = true
      this.currentPoint = v
    },
    countChange(v) {
      console.log(v.quesType, 444444444)
      if (v !== 0) {
        if (v.quesType) {
          v.quesType.push({
            typeId: this.allQuestionTypes[0].id,
            difficulty: 1,
          })
        } else {
          this.$set(v, 'quesType', [
            { typeId: this.allQuestionTypes[0].id, difficulty: 1 },
          ])
        }
        return
      }
      this.$message.warning(
        ['所选题型题量少于标准试卷题量！', '所选题型题量已超出标准试卷题量！'][
          v
        ],
      )
    },
    delQuesType(v, i, item) {
      if (item.num === 1) {
        this.$message.warning('所选题型题量不能少于1')
        return
      }
      v.splice(i, 1)
      item.num--
    },
    confirmCheck() {
      if (!this.checkList.length) {
        return this.$message.warning('请至少选择一个题型')
      }
      this.currentPoint.questionTypes = this.checkList.map(v => {
        return {
          id: v.split('-')[0],
          questionTypeName: v.split('-')[1],
        }
      })
      console.log(this.currentPoint.questionTypes)
      this.questionTypeVisible = false
    },
    async getQuestTypes() {
      this.allQuestionTypes = this.currScence.recommends.map(v => {
        return {
          ...v,
          id: v.questionTypeId,
          activated: v.questionNum ? true : false,
          num: v.questionNum,
          questTypeName: v.questionTypeName,
        }
      })
      this.questionTypes = this.allQuestionTypes.filter(v => v.activated)
      // const res = await this.apiGet({ urlPath: '/paper-generator/testPaper/sceneType/getSceneQuestTypes' }, { sceneTypeId: this.currScence.id })
      // if (res.code === CTS.constant.SUCCESS_CODE) {
      //     this.allQuestionTypes = res.data.map(v => {
      //         return {
      //             ...v,
      //             activated: v.defaultNum ? true : false,
      //             num: v.defaultNum
      //         }
      //     })
      //     this.questionTypes = this.allQuestionTypes.filter(v => v.activated)
      // }
    },
    // 选择知识点
    OnCheckNodeCodeKnowledge(val) {
      // console.log(val,10000)
      this.count = {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      }
      if (!val.length) {
        // this.checkNodeCodeKnowledge = ''
        this.interCheckNodeCodeKnowledgeArr = []
      } else {
        // console.log(val,1111)
        this.interCheckNodeCodeKnowledgeArr = val
        this.getNum()
        // this.checkNodeCodeKnowledge = this.reQuids(JSON.stringify(val), 'id')
        this.countHnalde(val)
      }
    },
    getNum() {
      const arr = []
      this.interCheckNodeCodeKnowledgeArr.forEach(v => {
        v.selChildren.forEach(y => {
          y.questionTypes = this.questionTypes
          arr.push({
            catalogId: y.id,
            difficulty: y.difficulty,
            importance: y.importance,
          })
        })
      })
      const data = {
        knowledgeInfos: arr,
        total: this.total,
      }
      this.newPost(
        { urlPath: '/paper-builder/paper-generate/recommend-question-num' },
        data,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          res.data.forEach(item => {
            this.interCheckNodeCodeKnowledgeArr.forEach(v => {
              const index = v.selChildren.findIndex(
                y => y.id === item.catalogId,
              )
              if (~index) {
                this.$set(v.selChildren[index], 'num', item.num)
                this.$set(v.selChildren[index], 'count', item.num)
              }
            })
          })
          this.advancedSetting(data.total)
          // this.$forceUpdate()
        }
      })
    },
    countHnalde(val) {
      val.forEach(v => {
        if (v.selChildren && v.selChildren.length) {
          this.countHnalde(v.selChildren)
        } else {
          if (this.fullpath == 'chapter') {
            this.levelHanlde(v.importance)
          } else {
            this.levelHanlde(v.modelLevel)
          }
        }
      })
    },
    levelHanlde(val) {
      if (1 <= val && val <= 2) {
        this.count.little += 1
      } else if (val <= 3) {
        this.count.normal += 1
      } else if (val <= 4) {
        this.count.importan += 1
      } else if (val <= 5) {
        this.count.heavy += 1
      }
    },
    // 全部删除
    deleteAll() {
      this.interCheckNodeCodeKnowledgeArr = []
      this.count = {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      }
      this.countHnalde(this.interCheckNodeCodeKnowledgeArr)
      this.$emit('deleteAll')
    },
    // 删除父类
    delParent(parent) {
      this.$emit('delParent', parent)
    },
    // 删除子类
    delChildren(children) {
      this.$emit('delChildren', children)
    },
    deleteCheckNode(val) {
      this.interCheckNodeCodeKnowledgeArr.splice(
        this.interCheckNodeCodeKnowledgeArr.findIndex(
          item => String(item.id) === String(val.id),
        ),
        1,
      )
      this.count = {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      }
      this.countHnalde(this.interCheckNodeCodeKnowledgeArr)
      this.$emit('deleteOneNodeKnowledge', this.interCheckNodeCodeKnowledgeArr)
    },
    changeRegions(params) {
      this.region.province = params.province
      this.region.city = params.city
      this.region.area = params.area
    },
    numChange() {
      this.total = this.questionTypes.reduce((pre, cur) => {
        return pre + cur.num
      }, 0)
    },
    delayChange() {
      const timer = setTimeout(() => {
        this.$refs.difficultyRef &&
          this.$refs.difficultyRef.getQuestionDiffNum()
        clearTimeout(timer)
      }, 50)
    },
    addQuestionType() {
      this.visible = true
    },
    deleteItem(v) {
      v.activated = !v.activated
      this.questionTypes = this.allQuestionTypes.filter(item => item.activated)
      this.delayChange()
    },
    confirmHandle() {
      this.questionTypes = this.allQuestionTypes.filter(item => {
        if (item.activated) {
          const obj = this.questionTypes.find(
            v => v.questTypeCode === item.questTypeCode,
          )
          if (!obj) {
            item.num = item.defaultNum
          }
        }
        return item.activated
      })
      this.visible = false
      this.delayChange()
    },
    // 什么高级设置
    advancedSetting(total) {
      const numInfo = this.$refs.difficultyRef.seting.map(v => v.value)
      const quesTypeInfo = []
      this.questionTypes.forEach(v => {
        quesTypeInfo.push({ deviation: 1, id: v.id, num: v.num })
      })
      const info = {}
      this.interCheckNodeCodeKnowledgeArr.forEach(v => {
        v.selChildren.forEach(c => {
          info[c.id] = [c.importance - 0, c.difficulty - 0, c.required ? 1 : 0]
        })
      })
      const modeShowInfo = this.convert(this.interCheckNodeCodeKnowledgeArr)
      const knowLedgeModeShow = this.interCheckNodeCodeKnowledgeArr.map(v => {
        return {
          children: v.selChildren.map(y => {
            return {
              // children: [],
              difficulty: y.difficulty,
              id: y.id,
              importance: y.importance,
              keyDifficultPoints: y.keyDifficultPoints,
              name: y.name,
              teachingTarget: y.teachingTarget,
              testFrequency: y.testFrequency,
              testOutline: y.testOutline,
            }
          }),
          difficulty: v.difficulty,
          id: v.id,
          importance: v.importance,
          keyDifficultPoints: v.keyDifficultPoints,
          name: v.name,
          teachingTarget: v.teachingTarget,
          testFrequency: v.testFrequency,
          testOutline: v.testOutline,
        }
      })
      const params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        scene: this.currScence.paperTypeId,
        mode: 1,
        quesCountTotal: this.total || total,
        diffDistList: numInfo,
        questionTypes: quesTypeInfo,
        knowLedgeModeShow,
        knowLedges: modeShowInfo,
        type: this.isChapter ? 1 : this.isSpecial ? 3 : 2,
      }
      this.newPost(
        { urlPath: '/paper-builder/paper-generate/smart-generate/seniorQuery' },
        params,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.advancedList = res.data.knowledgeQuesType
          const obj = {}
          res.data.knowledgeQuesType.forEach(v => {
            v.quesType.forEach(y => {
              y.typeId = +y.typeId
            })
            obj[v.uuid] = v.quesType
          })
          const list = JSON.parse(
            JSON.stringify(this.interCheckNodeCodeKnowledgeArr),
          )
          list.forEach(v => {
            v.selChildren.forEach(y => {
              y.quesType = obj[y.id]
            })
            this.interCheckNodeCodeKnowledgeArr = list
          })
        }
      })
    },
    // 生成试题
    makeQuestionMethod() {
      if (!this.interCheckNodeCodeKnowledgeArr.length) {
        this.$refs.knowledgeMessage.showMessage('请选择知识点！')
        return false
      }
      if (!this.yearType && this.yearType !== 0) {
        this.$refs.knowledgeMessage.showMessage('请选择试题年份！')
        return false
      }
      // if (!this.region.province || !this.region.city || !this.region.area) {
      //   this.$refs.knowledgeMessage.showMessage('请选择考试所在地区！')
      //   return false
      // }
      if (this.total === 0) {
        this.$refs.knowledgeMessage.showMessage('试题数量不能全部都为空')
        return false
      }
      if (this.total > 100) {
        this.$refs.knowledgeMessage.showMessage('试题总题数不能超过100题！')
        return
      }
      if (!this.advanced && this.total - this.$refs.difficultyRef.num !== 0) {
        this.$refs.knowledgeMessage.showMessage('请检查未分配试题数量！')
        this.$refs.difficultyRef.showOption = true
        return
      }
      const numInfo = this.$refs.difficultyRef.seting.map(v => v.value)
      const quesTypeInfo = []
      this.questionTypes.forEach(v => {
        // quesTypeInfo[v.id] = [v.num, v.difficultyCode]
        quesTypeInfo.push({ deviation: 1, id: v.id, num: v.num })
      })
      const info = {}
      this.interCheckNodeCodeKnowledgeArr.forEach(v => {
        v.selChildren.forEach(c => {
          info[c.id] = [c.importance - 0, c.difficulty - 0, c.required ? 1 : 0]
        })
      })
      const modeShowInfo = this.convert(this.interCheckNodeCodeKnowledgeArr)
      console.log(this.interCheckNodeCodeKnowledgeArr)
      const knowLedgeModeShow = this.interCheckNodeCodeKnowledgeArr.map(v => {
        return {
          children: v.selChildren.map(y => {
            return {
              // children: [],
              difficulty: y.difficulty,
              id: y.id,
              importance: y.importance,
              keyDifficultPoints: y.keyDifficultPoints,
              name: y.name,
              teachingTarget: y.teachingTarget,
              testFrequency: y.testFrequency,
              testOutline: y.testOutline,
            }
          }),
          difficulty: v.difficulty,
          id: v.id,
          importance: v.importance,
          keyDifficultPoints: v.keyDifficultPoints,
          name: v.name,
          teachingTarget: v.teachingTarget,
          testFrequency: v.testFrequency,
          testOutline: v.testOutline,
        }
      })
      const params = {
        // ...this.region,
        // yearType: this.yearType,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        scene: this.currScence.paperTypeId,
        mode: 1,
        quesCountTotal: this.total,

        diffDistList: numInfo,
        // difficultInfo: numInfo,
        questionTypes: quesTypeInfo,
        // knowledgeInfo: knowledgeInfo,
        // knowledgeShowInfo: knowledgeShowInfo,
        knowLedgeModeShow,
        knowLedges: modeShowInfo,
        type: this.isChapter ? 1 : this.isSpecial ? 3 : 2,
      }
      // if (this.fullpath == 'chapter') {
      //     // 2章节组卷
      //     params.type = 2
      //     params.chapterInfo = info
      // } else if (this.fullpath == 'knowledge') {
      //     // 1知识点组卷
      //     params.type = 1
      //     params.knowledgeInfo = info
      // } else {
      //     // 3专题组卷
      //     params.type = 3
      //     params.specialCatalogInfo = info
      // }
      // const advancedParams = {
      //   stage: this.currSubject.periodCode,
      //   subject: this.currSubject.subjectCode,
      //   scene: this.currScence.paperTypeId,
      //   quesCountTotal: this.total,
      //   modeShowInfo: this.interCheckNodeCodeKnowledgeArr.map(v => {
      //     return {
      //       modelShowId: v.id,
      //       children: v.children.map(y => {
      //         return {
      //           modelShowId: y.id,
      //           difficulty: v.difficulty,
      //           quesCount: v.num,
      //           questionTypeId: y.questionTypes.map(z => z.id)
      //         }
      //       })
      //     }
      //   }),
      // }
      sessionStorage.setItem('pathType', params.type)
      sessionStorage.advanced = +this.advanced
      if (this.advanced) {
        params.knowledgeQuesType = this.advancedList
      }
      sessionStorage.setItem('questionParams', JSON.stringify(params))
      // sessionStorage.advancedParams = JSON.stringify({knowledgeQuesType:this.advancedList})
      sessionStorage.removeItem('pageId')
      this.$router.push('/smartpaper/paperView')
    },
    convert(nodes) {
      const arr = []
      nodes.forEach(v => {
        v.selChildren.forEach(y => {
          const item = {
            difficulty: y.difficulty,
            id: y.id,
            importance: y.importance,
            num: y.num,
            // name: y.name,
          }
          arr.push(item)
        })
      })
      return arr
      if (this.fullpath == 'chapter') {
        nodes.forEach(v => {
          arr.push({
            chapterId: v.id,
            code: v.id,
            children: v.selChildren.map(c => {
              return {
                chapterId: c.id,
                code: c.id,
                parentId: c.parentChapterCode,
              }
            }),
            parentId: v.parentChapterCode,
          })
        })
      } else if (this.fullpath == 'knowledge') {
        nodes.forEach(v => {
          arr.push({
            chapterId: v.chapterId,
            code: v.chapterCode,
            children: v.selChildren.map(c => {
              return {
                chapterId: c.chapterId,
                code: c.chapterCode,
                parentId: c.parentId,
              }
            }),
            parentId: v.parentId,
          })
        })
      } else {
        nodes.forEach(v => {
          arr.push({
            chapterId: v.catalogueId,
            code: v.code,
            children: v.selChildren.map(c => {
              return {
                chapterId: c.catalogueId,
                code: c.code,
                parentId: c.parentId,
              }
            }),
            parentId: v.parentId,
          })
        })
      }

      return arr
    },
    // 获取当前学段试卷类型关联id
    getRelationCategoryId() {
      let parms = {
        categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
        code: this.currSubject.subjectCode,
        level: '2',
      }
      this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.currTypeCode = 0
          this.currSubTypeCode = 0
          if (res.data.length) {
            this.getTypesList(res.data[1].relationCategoryId)
          } else {
            this.typesList = []
          }
        }
      })
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
      this.wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arr = []
          res.data.forEach(item => {
            arr.push(Object.assign({ inNum: 0 }, item))
          })
          this.typesList = arr
        }
      })
    },
    selectType(item) {
      this.currTypeId = item.id
    },
    requiredHandle(item) {
      this.$set(item, 'required', !item.required)
      // item.required = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.disabled {
  pointer-events: none;
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.py-15 {
  padding: 15px 0;
}
.mb-20 {
  margin-bottom: 20px;
}
.mr-30 {
  margin-right: 30px;
}
.mb-24 {
  margin-bottom: 24px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}
.mr-10 {
  margin-right: 10px;
}
.ml-10 {
  margin-left: 10px;
}
.ai-container {
  width: 914px;
  box-sizing: border-box;
  .container-card {
    padding: 20px;
    background: $color-white;
    margin-bottom: 16px;
    > .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
        i {
          font-size: 16px;
          color: #ff8c48;
          margin-right: 8px;
        }
        span {
          font-size: 12px;
        }
      }
    }
    > .border {
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e2e2;
      margin-top: 8px;
    }
    .advanced_setting {
      .table {
        border-top: 1px solid #e2e2e2;
        border-left: 1px solid #e2e2e2;
      }
      margin-top: 10px;
      .thead {
        background: #eceff3;
      }
      .thead,
      .tr {
        display: flex;
        > span {
          border-bottom: 1px solid #e2e2e2;
          border-right: 1px solid #e2e2e2;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:nth-child(3) {
            width: 233px;
          }
          &:nth-child(4) {
            width: 110px;
          }
          &:nth-child(5) {
            width: 260px;
          }
          &:nth-child(6) {
            width: 60px;
          }
          // &:nth-child(7) {
          //   width: 60px;
          // }
        }
        > span,
        > div {
          &:nth-child(1) {
            width: 50px;
          }
          &:nth-child(2) {
            width: 160px;
          }
        }
      }
      .tr {
        > div {
          &:nth-child(1),
          &:nth-child(2) {
            border-bottom: 1px solid #e2e2e2;
            border-right: 1px solid #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &:nth-child(2) {
            padding: 0 30px;
            line-height: 18px;
          }
        }
        .content {
          flex: 1;
          > div {
            display: flex;
            > div {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: flex;
              align-items: center;
              justify-content: center;
              &:nth-child(1) {
                width: 233px;
              }
              &:nth-child(2) {
                width: 110px;
                padding: 6px 0;
              }
              // &:nth-child(3) {
              //   width: 150px;
              //   padding: 0 10px;
              //   color: #487FFF;
              //   >div {
              //     flex: 1;
              //     overflow: hidden;
              //     padding-right: 5px;
              //   }
              //   i {
              //     cursor: pointer;
              //   }
              // }
              &:nth-child(3) {
                width: 260px;
                padding: 0 12px;
                :deep(.el-select)) {
                  width: 80px;
                  .el-input__icon {
                    line-height: 28px;
                  }
                  .el-input__inner {
                    border: none;
                    padding: 0 25px 0 10px;
                  }
                }
              }
              &:nth-child(4) {
                width: 60px;
                color: #ff4b36;
                cursor: pointer;
              }
              border-bottom: 1px solid #e2e2e2;
              border-right: 1px solid #e2e2e2;
              :deep(.el-input-number)) {
                width: 100px;
                margin: 0;
                height: 28px;
                .el-input__inner {
                  padding-left: 35px;
                  padding-right: 35px;
                }
                .el-input-number__increase,
                .el-input-number__decrease {
                  width: 28px;
                }
              }
              &.count {
                .input {
                  position: relative;
                  i,
                  s {
                    position: absolute;
                    top: 1px;
                    width: 28px;
                    height: 28px;
                    z-index: 2;
                    cursor: pointer;
                  }
                  i {
                    left: 0;
                  }
                  s {
                    left: 29px;
                    width: 43px;
                  }
                }
              }
              &.difficulty {
                display: block;
                > .item {
                  > span {
                    margin-right: 10px;
                  }
                  > i {
                    margin-left: 10px;
                    font-size: 16px;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
      .question_num {
        margin-top: 30px;
        > div {
          // display: flex;
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          // >div {
          //   padding: 0 20px;
          //   text-align: center;
          //   position: relative;
          //   color: #666;
          //   &:not(:last-child)::before {
          //     content: '';
          //     position: absolute;
          //     right: 0;
          //     top: 19px;
          //     width: 1px;
          //     height: 12px;
          //     background: #E2E2E2;
          //   }
          //   span {
          //     font-weight: bold;
          //     font-size: 22px;
          //     line-height: 26px;
          //   }
          //   p {
          //     margin-top: 4px;
          //   }
          // }
        }
      }
    }
  }
  .mt-16 {
    margin-top: 16px;
  }
  .title_border {
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    padding-left: 10px;
    position: relative;
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
  .m_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .clear {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 16px;
        margin-right: 4px;
      }
      color: #487fff;
    }
  }
  .card-body {
    padding: 20px;
  }
  .ai-choose-box {
    padding: 20px;
    width: 874px;
    height: 360px;
    overflow: auto;
    li {
      padding: 10px 0;
      margin-bottom: 20px;
      width: 100%;
      border: 1px solid #eeeeee;
      border-radius: 6px;
      box-sizing: border-box;
      .pNmae {
        padding: 0 20px 10px 20px;
        width: 100%;
        border-bottom: 1px solid #eeeeee;
        box-sizing: border-box;
      }
      .nameWrap {
        padding: 20px 20px 10px 20px;
        display: flex;
        flex-wrap: wrap;
      }
      .nameTag {
        margin-right: 10px;
        margin-bottom: 15px;
        cursor: pointer;
        i.num {
          width: 14px;
          height: 14px;
          line-height: 14px;
          text-align: center;
          display: inline-block;
          border-radius: 50%;
          background: #487fff;
          color: #fff;
        }
      }
      .tagClass {
        position: relative;
        &::before {
          content: '必选';
          position: absolute;
          top: -12px;
          left: 0;
          width: 40px;
          height: 18px;
          color: #fff;
          text-align: center;
          line-height: 18px;
          font-size: 12px;
          background: linear-gradient(134deg, #ff8000 0%, #ff5844 100%);
          border-radius: 10px 0px 10px 0px;
        }
      }
      .coefficient {
        vertical-align: middle;
        padding-bottom: 3px;
        margin-left: 0;
        font-size: 18px;
      }
    }
  }
  .btn-box {
    text-align: center;
    padding: 20px 0;
    .product-paper {
      width: 130px;
      height: 40px;
      // background: rgba(97, 156, 245, 1);
      background: #487fff;
    }
  }
}
:deep(.el-input-number)) {
  width: 120px;
  line-height: 30px;
  margin-right: 12px;
  .el-input__inner {
    height: 30px;
    border-radius: 4px;
    line-height: 30px;
    padding-left: 45px;
    padding-right: 45px;
    color: #4b8ff5;
  }
  .el-input-number__increase,
  .el-input-number__decrease {
    display: inline-block;
    box-sizing: border-box;
    width: 30px;
    height: 28px;
    /*line-height: 28px;*/
    background: $color-white;
  }
}
:deep(.questionWrap)) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  grid-gap: 20px;
  .questTypeName {
    width: 82px;
    // margin-right: 20px;
    // text-align: right;
  }
  .el-icon-delete {
    font-size: 16px;
    color: #ff6e5d;
    cursor: pointer;
  }
  .el-icon-plus {
    font-size: 14px;
  }
}
:deep(.regionWrap)) {
  .el-input__inner {
    border-radius: 4px;
  }

  .el-input__icon {
    line-height: normal;
  }
}
.gray {
  color: #999999;
}
.yellow {
  color: #ffbc00;
}
.orange {
  color: #ff8400;
}
.red {
  color: #ff0000;
}
:deep(.nameTag)) {
  &.gray {
    background: rgba(153, 153, 153, 0.05);
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    color: #666;
    .el-tag__close {
      color: #666;
    }
  }
  &.yellow {
    background: rgba(254, 166, 0, 0.05);
    border-radius: 4px;
    border: 1px solid #ffd991;
    color: #feba00;
    .el-tag__close {
      color: #feba00;
    }
  }
  &.orange {
    background: rgba(255, 128, 54, 0.05);
    border-radius: 4px;
    border: 1px solid #ffccaa;
    color: #ff822e;
    .el-tag__close {
      color: #ff822e;
    }
  }
  &.red {
    background: rgba(255, 110, 93, 0.05);
    border-radius: 4px;
    border: 1px solid #ffcec8;
    color: #ff6e5d;
    .el-tag__close {
      color: #ff6e5d;
    }
  }
}
.addWrap {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .addBtn {
    width: 160px;
    height: 30px;
    line-height: 30px;
    background: #eff5fe;
    border-radius: 4px 4px 4px 4px;
    font-size: 16px;
    color: #4b8ff5;
    text-align: center;
    cursor: pointer;
  }
}
:deep(.el-dialog__body)) {
  padding: 30px 20px;
}
:deep(.el-dialog__footer)) {
  text-align: center;
}
.checkboxItem {
  margin-bottom: 10px;
}
</style>
