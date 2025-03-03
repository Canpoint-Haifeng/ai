<template>
  <div class="ai-container">
    <div class="container-card">
      <div class="header">
        <div class="m_title">
          <p class="title_border">
            教案参数设置
          </p>
        </div>
      </div>
      <div class="select-area">
        <ul>
          <li
            v-for="(item, index) in smartRadioList"
            :key="index"
          >
            <RadioGroup
              v-model="serachData[item.value]"
              :title="item.title"
              :options="item.list"
            />
          </li>
          <li class="input-with-text-area">
            <div>
              <div class="input-with-text">
                <span>例题总量</span>
                <el-input-number
                  v-model="defaultTotalCount"
                  :formatter="formatter"
                  :parser="parser"
                  :min="totalMin"
                  :max="10"
                  @change="totalChangeHandler"
                />/例
              </div>
              <div class="input-with-text">
                <span>课内练习</span>
                <el-input-number
                  v-model="defaultInClassCount"
                  :formatter="formatter"
                  :parser="parser"
                  :min="1"
                  :max="10"
                  @change="updateAllCounts('inClass')"
                />/例
                <!-- <span style="margin-left: -50px; pointer-events: none;">题</span> -->
              </div>
              <div class="input-with-text">
                <span>课后作业</span>
                <el-input-number
                  v-model="defaultAfterClassCount"
                  :formatter="formatter"
                  :parser="parser"
                  :min="1"
                  :max="100"
                  @change="updateAllCounts('afterClass')"
                />/例
              </div>
            </div>
            <!-- <RadioGroup :title="item.title" :options="item.list" v-model="serachData[item.value]"/> -->
          </li>
        </ul>
      </div>
      <div class="operation-area">
        <div class="m_title">
          <span>试题设置</span>
          <div class="flex">
            <span
              class="clear"
              @click="handleResetToDefault"
            ><i class="el-icon-refresh" />恢复默认值
            </span>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="advanced = !advanced"
            >
              {{ advanced ? '普通' : '高级' }}设置
            </el-button>
          </div>
        </div>
      </div>
      <!-- 智能组卷高级设置 -->
      <div
        v-if="advanced"
        class="smart-setting-card-advanced"
      >
        <div class="head-setting-card">
          <span>知识点</span>
          <span>考点</span>
          <span class="normal-setting">
            <span>例题设置</span>
            <span class="type">
              <span>难度</span>
              <span>题型</span>
            </span>
          </span>
          <span>课内练习</span>
          <span>课后作业</span>
        </div>
        <div class="advanced_setting-card high-advanced_setting-card">
          <div
            v-for="(item, index) in interCheckNodeCodeKnowledgeArr"
            :key="index"
            class="card-wrap"
          >
            <div class="zsd-title">
              {{ item.name }}
            </div>
            <div class="card-content">
              <div
                v-for="(v, i) in item.selChildren"
                :key="i"
                class="flex flex-row"
              >
                <div class="testing_point-wrap flex flex-row">
                  <div class="testing_point">
                    <i
                      class="el-icon-star-on coefficient"
                      style="color: #ff6e5d"
                    >
                      <span
                        v-if="v.importance"
                        class="tooltip-text"
                        :style="{
                          background: colors[Math.ceil(v.importance)].color,
                        }"
                      >{{ colors[Math.ceil(v.importance)].name }}</span>
                    </i>
                    <span>{{ v.name }}</span>
                  </div>
                  <!-- <i
                    v-if="!advanced"
                    class="el-icon-circle-plus-outline"
                    style="color:#487FFF"
                    @click="addExampleQue(item, v)"
                  ></i> -->
                </div>
                <div class="flex flex-col example-config-wrap">
                  <div
                    v-for="(config, c_i) in v.questionConfigList"
                    :key="c_i"
                    class="example-config flex flex-row"
                  >
                    <div class="example-setting">
                      <div class="text">
                        例题{{ getGlobalExampleIndex(index, i) + c_i + 1 }}
                      </div>
                      <el-select
                        v-model="config.questionExample.difficulty"
                        placeholder="选择难度"
                      >
                        <el-option
                          label="选择难度"
                          :value="''"
                          disabled
                        />
                        <el-option
                          v-for="y in difficultyList"
                          :key="y.id"
                          :label="y.label"
                          :value="y.value"
                          @change="changeQuesDifficulty(config, v)"
                        />
                      </el-select>
                      <el-select
                        v-model="config.questionExample.quesType"
                        placeholder="选择题型"
                      >
                        <el-option
                          label="选择题型"
                          :value="''"
                          disabled
                        />
                        <el-option
                          v-for="y in questionTypes"
                          :key="y.id"
                          :label="y.name"
                          :value="y.id"
                        />
                      </el-select>
                    </div>
                    <div
                      class="incalss class-difficulty"
                      style="border-right: none;"
                    >
                      <div
                        v-for="(after, after_i) in config.inClassQuestion"
                        :key="after_i"
                        class="class-difficulty-item"
                        style="border-bottom: none;"
                      >
                        <span>{{ after_i + 1 }}.</span>
                        <el-select
                          v-model="after.difficulty"
                          placeholder="选择难度"
                        >
                          <el-option
                            label="选择难度"
                            :value="''"
                            disabled
                          />
                          <el-option
                            v-for="y in difficultyList"
                            :key="y.id"
                            :label="y.label"
                            :value="y.value"
                          />
                        </el-select>
                      </div>
                    </div>
                    <div class="aftercalss class-difficulty">
                      <div
                        v-for="(after, after_i) in config.afterClassQuestion"
                        :key="after_i"
                        class="class-difficulty-item"
                        style="border-bottom:none"
                      >
                        <span>{{ after_i + 1 }}.</span>
                        <el-select
                          v-model="after.difficulty"
                          placeholder="选择难度"
                        >
                          <el-option
                            label="选择难度"
                            :value="''"
                            disabled
                          />
                          <el-option
                            v-for="y in difficultyList"
                            :key="y.id"
                            :label="y.label"
                            :value="y.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!advanced"
        class="smart-setting-card"
      >
        <div class="head-setting-card">
          <span>知识点</span>
          <span>考点</span>
          <span>例题</span>
          <div>
            <span>课内练习</span>
            <!-- <div class="input-with-text">
                <el-input-number v-model="defaultInClassCount" :min="1" :max="10"  @change="updateAllCounts('inClass')"></el-input-number>
              </div> -->
          </div>
          <div>
            <span>课后作业</span>
            <!-- <div class="input-with-text">
                <el-input-number v-model="defaultAfterClassCount" :min="1" :max="100"  @change="updateAllCounts('afterClass')"></el-input-number>
              </div> -->
          </div>
          <span>操作</span>
        </div>
        <div class="advanced_setting-card">
          <div
            v-for="(item, index) in interCheckNodeCodeKnowledgeArr"
            :key="index"
            class="card-wrap"
          >
            <div class="zsd-title">
              {{ item.name }}
            </div>
            <div class="card-content">
              <div
                v-for="(v, i) in item.selChildren"
                :key="i"
                class="flex flex-row"
              >
                <div class="testing_point-wrap flex flex-row">
                  <div class="testing_point">
                    <i
                      v-if="v.importance"
                      class="el-icon-star-on coefficient"
                      :style="{ color: colors[Math.ceil(v.importance)].color }"
                    >
                      <span
                        class="tooltip-text"
                        :style="{
                          background: colors[Math.ceil(v.importance)].color,
                        }"
                      >{{ colors[Math.ceil(v.importance)].name }}</span>
                    </i>
                    <span>{{ v.name }}</span>
                  </div>
                  <!-- <i
                    class="el-icon-circle-plus-outline"
                    style="color:#487FFF"
                    @click="addExampleQue(item, v)"
                  ></i> -->
                </div>
                <div class="flex flex-col example-config-wrap">
                  <div
                    v-for="(config, c_i) in v.questionConfigList"
                    :key="c_i"
                    class="example-config flex flex-row"
                  >
                    <div class="short-text example-num">
                      例题{{ getGlobalExampleIndex(index, i) + c_i + 1 }}
                    </div>
                    <div class="count">
                      <div class="input">
                        <!-- normalChild: {{ config }} -->
                        <!-- v-model="config.inClassQuestion[0].count" -->
                        <el-input-number
                          v-model="config.inClassQuestion[0].count"
                          :min="1"
                          :max="10"
                          @change="changeExercisesQues(config, 'in', v)"
                        />
                      </div>
                    </div>
                    <div class="count">
                      <div class="input">
                        <el-input-number
                          v-model="config.afterClassQuestion[0].count"
                          :min="1"
                          :max="10"
                          @change="changeExercisesQues(config, 'after', v)"
                        />
                      </div>
                    </div>
                    <div class="operation">
                      <span
                        style="color: #487fff;    line-height: 40px;
    margin-right: 4px;"
                        @click="addExampleQue(item, v, c_i, config)"
                      >新增</span>
                      <span
                        class="short-text"
                        @click="deleteExampleQue(v, c_i)"
                      >删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="interCheckNodeCodeKnowledgeArr.length <= 0"
        class="smart-setting-empty"
      >
        <div class="text-wrap">
          <img
            src="../../../assets//images/smart/smart-empty.png"
            alt=""
          >
          <p>您还未选择知识点，请在左侧选择需要备课的知识点范围~</p>
        </div>
      </div>

      <!-- <div class="container-card mt-16">
        <div class="card-body">
          <div class="ope-btn-box">
            <el-button type="primary" class="product-paper" @click="makeQuestionMethod">生成教案</el-button>
          </div>
        </div>
      </div> -->
      <!-- 纠错提示框 -->
      <report-dialog
        ref="reportDialog"
        @report-error="onReportError"
      />
      <!-- 登录弹窗 -->
      <app-login ref="appLogin" />
      <!-- 无知识点提示框 -->
      <no-que-message ref="knowledgeMessage" />
      <!---->
      <el-dialog
        v-model:visible="visible"
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
        v-model:visible="questionTypeVisible"
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

      <base-dialog
        ref="resetDialog"
        title="恢复默认值提示"
        @comfirm="resetToDefault"
      >
        <template #dialogTips>
          <div class="dialog-tips">
            确定要恢复默认值吗？
          </div>
        </template>
      </base-dialog>
    </div>
    <div class="container-card-btn">
      <div class="card-body">
        <div class="ope-btn-box">
          <el-button
            type="primary"
            class="product-paper"
            @click="makeQuestionMethod"
          >
            生成教案
          </el-button>
        </div>
      </div>
    </div>
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
import RadioGroup from './RadioGroup.vue'
import { smartRadioList } from '../hooks/index'
import state from '@/store/state'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import router from '@/router'
import { throttle } from '@/common/helper/throttle-debounce'

export default {
  components: {
    NoresultCommon,
    NoQueMessage,
    Difficulty,
    CpNationalRegions,
    RadioGroup,
    BaseDialog,
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
      wrapperThrottle: null,
      tempCount: 0,
      advancedList: [],
      checkList: [],
      questionTypeVisible: false,
      currentPoint: [],
      questionTypes: [],
      checkNodeCodeKnowledge: '',
      interCheckNodeCodeKnowledgeArr: [],
      SelectObj: {},
      typesList: [],
      colors: [
        {},
        { name: '非常重要', color: '#ed7764' },
        { name: '非常重要', color: '#ed7764' },
        { name: '重要', color: '#ef8944' },
        { name: '一般', color: '#f4bd41' },
        { name: '不重要', color: '#999' },
      ],
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
      advanced: false, //高级设置
      smartRadioList: smartRadioList,
      cityOptions: [
        { label: '上海' },
        { label: '北京' },
        { label: '广州' },
        { label: '深圳' },
      ],
      serachData: {
        suitType: 2, //试用阶段,
        type: 1, //页面类型 章节1  知识点2 专题3
      },
      // afterClassQuestion: { count: 3, difficulty: 0, quesType: 0 },
      // inClassQuestion: { count: 5, difficulty: 0, quesType: 0 },
      // questionExample: { count: 1, difficulty: '', quesType: 0 },
      // 例题初始化//普通设置例题
      questionConfigList: [],
      //高级设置例题配置
      // questionConfigSeniorList: [],
      defaultTotalCount: 0,
      totalMin: 1,
      defaultInClassCount: 3,
      defaultAfterClassCount: 2,
      defaultDifficulty: '',
      defaultQuesType: '',
      versionCode: '',
      volumeCode: '',
      gradeCode: '',
      volumeName: '',
      gradeName: '',
      versionName: '',
    }
  },
  watch: {
    'serachData.suitType': function(newSuitType) {
      console.log('newSuitType', newSuitType)
      console.log('serachData.suitType', this.serachData.suitType)

      // 当 suitType 改变时，重新计算所有例题的难度
      this.updateAllDifficulties(newSuitType)
    },
    currScence(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        console.log('currScence', val)
        this.getQuestTypes()
      }
    },
    questionTypes: {
      handler() {
        // if(!advanced) return
        console.log('questionTypesquestionTypes', this.questionTypes)
        this.numChange()
        this.delayChange()
      },
      deep: true,
    },
    total() {
      if (this.advanced) return
      this.getInit()
    },
    advanced(v) {},
    interCheckNodeCodeKnowledgeArr: {
      handler(list) {
        console.log('list----handler', list)
        this.defaultTotalCount = this.currentQuestionNum()

        if (!this.advanced) return
        const res = []
        list.forEach(v => {
          console.log('高级设置', 'v', v)

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
        // this.$refs.difficultyRef.seting.forEach((v, i) => {
        //   v.value = difficulty[i]
        // })
        console.log('questionTypes我的题型', this.questionTypes)
        // console.log('314----handler', list)
      },
      deep: true,
    },
  },
  activated() {
    const obj = sessionStorage.getItem('questionParams')
    if (!obj) {
      // this.Bus.$on('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
      this.interCheckNodeCodeKnowledgeArr = []
      this.count = {
        little: 0,
        normal: 0,
        importan: 0,
        heavy: 0,
      }
      // this.$refs.difficultyRef.initialize()
      this.yearType = 0
      // this.$refs.regionsRef.initCreated()
      // this.$refs.regionsRef.cityList = []
      // this.$refs.regionsRef.areaList = []
    }
  },
  beforeUnmount() {
    this.Bus.$off('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
  },
  unmounted() {
    this.Bus.$off('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
  },
  computed: {
    afterClassCount: {
      get() {
        return this.config.afterClassQuestion.length
          ? this.config.afterClassQuestion[0].count
          : this.tempCount
      },
      set(value) {
        if (this.config.afterClassQuestion.length) {
          // 如果数组有内容，更新数组中的 count
          this.config.afterClassQuestion[0].count = value
        } else {
          // 如果数组为空，更新 tempCount
          this.tempCount = value
        }
      },
    },
    inClassCount: {
      get() {
        return this.config.inClassQuestion.length
          ? this.config.inClassQuestion[0].count
          : this.tempCount
      },
      set(value) {
        if (this.config.inClassQuestion.length) {
          // 如果数组有内容，更新数组中的 count
          this.config.inClassQuestion[0].count = value
        } else {
          // 如果数组为空，更新 tempCount
          this.tempCount = value
        }
      },
    },
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
    // 例题的默认值
    defaultValue() {
      return {
        inClassQuestion: [
          {
            count: 3,
            difficulty: this.defaultDifficulty,
            quesType: this.defaultQuesType,
          },
        ],
        afterClassQuestion: [
          {
            count: 2,
            difficulty: this.defaultDifficulty,
            quesType: this.defaultQuesType,
          },
        ],
        questionExample: {
          count: 1,
          difficulty: this.serachData.suitType,
          quesType: this.defaultQuesType,
        },
      }
    },
    // 遍历 questionConfigList，计算总的例题数量
    getExampleOrder() {
      let order = 1 // 从1开始计数
      return (item, v, index) => {
        let totalExamples = 0
        v.questionConfigList.forEach((config, c_i) => {
          totalExamples +=
            config.inClassQuestion.length + config.afterClassQuestion.length
          if (c_i < index) {
            order +=
              config.inClassQuestion.length + config.afterClassQuestion.length
          }
        })
        return order
      }
    },
  },
  mounted() {
    // 监听添加试题
    this.Bus.$on('interCheckNodeCodeKnowledge', this.OnCheckNodeCodeKnowledge)
    // 获取题型
    this.getQuestionTypes()
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
    getQuestionTypes() {
      let data = {
        subject: this.currSubject.subjectCode,
        stage: this.currSubject.periodCode,
      }
      this.apiGet(
        { urlPath: '/lesson-app/config/getQuestionTypeTree' },
        data,
      ).then(res => {
        console.log('res', res)
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.questionTypes = res.data
          // this[k] = res.data.records || []
          console.log(res)
        }
      })
    },
    formatter(value) {
      return `${value}题`
    },
    // 解析去掉“题”后返回数字
    parser(value) {
      return value.replace(/[题]/g, '')
    },
    /* 动态计算全局序号 */
    calculateQuestionOrder(v) {
      let questionOrder = []
      // 用于存储带有全局序号的对象

      let count = 1
      // 初始全局序号
      v.questionConfigList.forEach(config => {
        // 课内练习
        config.inClassQuestion.forEach(inClass => {
          questionOrder.push({
            question: inClass,
            order: count++,
          })
        })

        // 课外练习
        config.afterClassQuestion.forEach(afterClass => {
          questionOrder.push({
            question: afterClass,
            order: count++,
          })
        })
      })
      return questionOrder
    },
    /* 获取全局例题序号 */
    getGlobalExampleIndex(itemIndex, vIndex) {
      let count = 0
      for (let i = 0; i < itemIndex; i++) {
        count += this.interCheckNodeCodeKnowledgeArr[i].selChildren.reduce(
          (acc, cur) => acc + cur.questionConfigList.length,
          0,
        )
      }
      count += this.interCheckNodeCodeKnowledgeArr[itemIndex].selChildren
        .slice(0, vIndex)
        .reduce((acc, cur) => acc + cur.questionConfigList.length, 0)
      return count
    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    /* 新增例题 */
    addExampleQue(item, v, index, config) {
      /// return
      const newExample = {
        afterClassQuestion: Array.from(
          { length: config.afterClassQuestion.length },
          (_, i) => ({
            count: config.afterClassQuestion.length,
            difficulty: this.calculateDifficulty(
              this.serachData.suitType,
              v.difficulty,
              i + 1,
              false,
            ),
            quesType: this.defaultQuesType,
          }),
        ),
        inClassQuestion: Array.from(
          { length: config.inClassQuestion.length }, //this.defaultInClassCount
          (_, i) => ({
            count: config.inClassQuestion.length,
            difficulty: this.calculateDifficulty(
              this.serachData.suitType,
              v.difficulty,
              i + 1,
              true,
            ),
            quesType: this.defaultQuesType,
          }),
        ),

        questionExample: {
          count: 1,
          difficulty:
            v.difficulty === 0 ? this.serachData.suitType : 6 - v.difficulty,
          quesType: this.defaultQuesType,
        },
      }
      // 将新例题推入 questionConfigList
      if (index != undefined) {
        v.questionConfigList.splice(index + 1, 0, newExample)
      } else {
        v.questionConfigList.push(newExample)
      }
      //

      // 重新计算所有例题的难度
      // this.updateAllDifficulties(v)
    },
    /* 删除指定的例题 */
    deleteExampleQue(v, exampleIndex) {
      // 删除指定例题
      v.questionConfigList.splice(exampleIndex, 1)

      // 如果 questionConfigList 为空，则删除该考点 v
      if (v.questionConfigList.length === 0) {
        const selChildrenIndex = this.interCheckNodeCodeKnowledgeArr.findIndex(
          item => item.selChildren.includes(v),
        )

        if (selChildrenIndex !== -1) {
          // 删除考点 v
          const item = this.interCheckNodeCodeKnowledgeArr[selChildrenIndex]
          const vIndex = item.selChildren.indexOf(v)
          if (vIndex !== -1) {
            item.selChildren.splice(vIndex, 1)
          }

          // 如果考点数组 selChildren 为空，则删除知识点 item
          if (item.selChildren.length === 0) {
            this.interCheckNodeCodeKnowledgeArr.splice(selChildrenIndex, 1)
          }
        }
      }
      // 当删除的例题项的下标小于等于3的时候重新计算这个下标是练习在例题中的下标不再是这个下标了？
      // if (exampleIndex <= 3) this.updateAllDifficulties(v)
    },
    /* 当练习的数量改变时 有新增和删除，那么更新练习的数量的时候才需要去更新每道例题的难度 */
    changeExercisesQues(normalChild, type, y) {
      // if (type == 'in') {
      //   this.defaultInClassCount = null
      // } else {
      //   this.defaultAfterClassCount = null
      // }
      console.log('changeExercisesQues', y)

      const questionTypes = {
        in: { questions: normalChild.inClassQuestion },
        after: { questions: normalChild.afterClassQuestion },
      }

      const currentType = questionTypes[type]

      // if (!currentType || !currentType.questions) return
      if (
        !currentType ||
        !currentType.questions ||
        currentType.questions.length === 0
      ) {
        // 当数组为空时，执行需要的逻辑
        // console.log('No questions available to modify')
        return
      }

      const questionList = currentType.questions

      const targetCount = questionList[0].count

      if (questionList.length < targetCount) {
        for (let i = questionList.length; i < targetCount; i++) {
          questionList.push({
            count: targetCount,
            difficulty: this.calculateDifficulty(
              this.serachData.suitType,
              y.difficulty,
              i + 1,
              type === 'in',
            ),
            quesType: this.defaultQuesType,
          })
        }
      }

      if (questionList.length > targetCount) {
        questionList.splice(targetCount)
      }

      // 每次修改都更新所有项的 count 和 difficulty
      questionList.forEach((question, idx) => {
        question.count = questionList.length // 让所有项的 count 变为当前项数
        question.difficulty = this.calculateDifficulty(
          this.serachData.suitType,
          y.difficulty,
          idx + 1,
          type === 'in',
        )
      })

      // 如果条件满足，触发更新难度的逻辑
      const lengthLimit = type === 'in' ? 3 : 2
      if (questionList.length <= lengthLimit) {
        this.updateAllDifficulties(this.serachData.suitType)
      }
    },
    handleResetToDefault() {
      this.$refs.resetDialog.show()
    },
    /* 恢复默认值 */
    resetToDefault() {
      this.defaultInClassCount = 3
      this.defaultAfterClassCount = 2
      this.interCheckNodeCodeKnowledgeArr.forEach(v => {
        v.selChildren.forEach(y => {
          // 遍历每个 questionConfigList 项目，根据当前项的 index 重置
          y.questionConfigList.forEach((config, index) => {
            // 重置 afterClassQuestion 的每个项
            this.$set(
              config,
              'afterClassQuestion',
              Array.from({ length: this.defaultAfterClassCount }, (_, i) => ({
                count: this.defaultAfterClassCount,
                difficulty: this.calculateDifficulty(
                  this.serachData.suitType,
                  y.difficulty,
                  i + 1,
                  false,
                ), // 按当前项的位置传入 index
                quesType: this.defaultQuesType,
              })),
            )

            // 重置 inClassQuestion 的每个项
            this.$set(
              config,
              'inClassQuestion',
              Array.from({ length: this.defaultInClassCount }, (_, i) => ({
                count: this.defaultInClassCount,
                difficulty: this.calculateDifficulty(
                  this.serachData.suitType,
                  y.difficulty,
                  i + 1,
                  true,
                ), // 按当前项的位置传入 index
                quesType: this.defaultQuesType,
              })),
            )

            // 重置 questionExample
            // this.$set(config, 'questionExample', {
            //   count: 1,
            //   difficulty: y.difficulty || this.serachData.suitType,
            //   quesType: this.defaultQuesType
            // })
            this.$set(config, 'questionExample', {
              count: config.questionExample.count,
              difficulty:
                y.difficulty === 0
                  ? this.serachData.suitType
                  : 6 - y.difficulty, // 根据规则反转难度
              quesType: this.defaultQuesType,
            })
          })
        })
      })
      this.$refs.resetDialog.hide()
    },
    async totalChangeHandler() {
      if (!this.wrapperThrottle) {
        this.wrapperThrottle = throttle(1000, this.getTableInfo)
      }
      this.wrapperThrottle()
      // await this.getTableInfo()
    },
    updateDefaultAfterClassCount(newCount) {
      this.defaultAfterClassCount = newCount
      this.updateAllAfterClassCounts()
      this.totalChangeHandler()
    },
    updateDefaultInClassCount(newCount) {
      this.defaultInClassCount = newCount
      this.updateAllInClassCounts()
      this.totalChangeHandler()
    },
    updateAllAfterClassCounts() {
      this.interCheckNodeCodeKnowledgeArr.forEach(item => {
        item.selChildren.forEach(child => {
          child.questionConfigList.forEach(config => {
            config.afterClassQuestion.forEach(question => {
              question.count = this.defaultAfterClassCount
            })
          })
        })
      })
    },
    updateAllInClassCounts() {
      this.interCheckNodeCodeKnowledgeArr.forEach(item => {
        item.selChildren.forEach(child => {
          child.questionConfigList.forEach(config => {
            config.inClassQuestion.forEach(question => {
              question.count = this.defaultInClassCount
            })
          })
        })
      })
    },
    updateAllCounts(type) {
      const isInClass = type === 'inClass' // 判断是 inClass 还是 afterClass
      const defaultCount = isInClass
        ? this.defaultInClassCount
        : this.defaultAfterClassCount

      this.interCheckNodeCodeKnowledgeArr.forEach(item => {
        item.selChildren.forEach(child => {
          child.questionConfigList.forEach(config => {
            // 获取当前的 question 数组
            const questionList = isInClass
              ? config.inClassQuestion
              : config.afterClassQuestion
            const currentLength = questionList.length

            // 如果当前项数小于默认值，新增项
            if (currentLength < defaultCount) {
              for (let i = currentLength; i < defaultCount; i++) {
                questionList.push({
                  count: defaultCount,
                  difficulty: this.calculateDifficulty(
                    this.serachData.suitType,
                    child.difficulty,
                    i + 1,
                    isInClass,
                  ),
                  quesType: this.defaultQuesType,
                })
              }
            }

            // 如果当前项数大于默认值，删除多余的项
            if (currentLength > defaultCount) {
              questionList.splice(defaultCount)
            }

            // 更新所有现有项的 count
            questionList.forEach(question => {
              question.count = defaultCount
            })
          })
        })
      })
    },
    changeQuestionType(v) {
      this.checkList = v.questionTypes.map(
        item => item.id + '-' + item.questionTypeName,
      )
      this.questionTypeVisible = true
      this.currentPoint = v
    },
    countChange(config) {},
    /* 计算所有 questionConfigList 的难度 */
    updateAllDifficulties(newSuitType) {
      console.log(newSuitType, 'updateAllDifficulties是否触发')

      this.interCheckNodeCodeKnowledgeArr.forEach(v => {
        v.selChildren.forEach(y => {
          y.questionConfigList.forEach((config, index) => {
            const inClassLength = config.inClassQuestion.length
            const afterClassLength = config.afterClassQuestion.length

            console.log('y.difficulty', y.difficulty)

            config.inClassQuestion.forEach((question, i) => {
              const newDifficulty = this.calculateDifficulty(
                newSuitType,
                y.difficulty,
                i + 1,
                true,
              )
              this.$set(question, 'difficulty', newDifficulty)
            })

            config.afterClassQuestion.forEach((question, i) => {
              const newDifficulty = this.calculateDifficulty(
                newSuitType,
                y.difficulty,
                i + 1,
                false,
              )
              this.$set(question, 'difficulty', newDifficulty)
            })
          })
        })
      })
    },
    /* 计算 difficulty 核心计算难度的算法 的方法 */
    calculateDifficulty(type, baseDifficulty, index, isInClass) {
      let result = baseDifficulty
      console.log('jisuan======', type, baseDifficulty, index, isInClass)
      // console.log(type, 'type', 'isInClass', isInClass)
      // console.log('baseDifficulty', baseDifficulty, '下标', index)
      // 定义规则映射为函数，动态返回规则，确保难度不会低于1
      const inClassRules = {
        1: () => [
          Math.max(baseDifficulty - 1, 1),
          Math.max(baseDifficulty, 1),
          Math.min(baseDifficulty + 1, 5),
        ],
        2: () => [
          Math.max(baseDifficulty, 1),
          Math.max(baseDifficulty, 1),
          Math.min(baseDifficulty + 1, 5),
        ],
        3: () => [
          Math.min(baseDifficulty + 1, 5),
          Math.min(baseDifficulty + 1, 5),
          Math.min(baseDifficulty + 2, 5),
        ], // 第3项规则
      }

      const afterClassRules = {
        1: () => [
          Math.max(baseDifficulty, 1),
          Math.max(baseDifficulty, 1),
          Math.min(baseDifficulty + 1, 5),
        ],
        2: () => [
          Math.min(baseDifficulty + 1, 5),
          Math.min(baseDifficulty + 1, 5),
          Math.min(baseDifficulty + 2, 5),
        ], // 第2项及以后的规则
      }

      // 根据 isInClass 判断选择的规则
      const rules = isInClass ? inClassRules : afterClassRules

      // 对 index 进行处理，大于等于指定值时，使用最后一个规则
      const ruleIndex = isInClass ? Math.min(index, 3) : Math.min(index, 2)

      // 动态计算规则，获取对应的 difficulty 值
      if (rules[ruleIndex]) {
        const dynamicRules = rules[ruleIndex]()
        result = dynamicRules[type - 1] // 获取对应的 type 值
      }

      // 确保 difficulty 不超出 1 - 5 的范围
      if (result < 1) result = 1
      if (result > 5) result = 5

      console.log('result', result)

      console.log('type', type, 'isInClass', isInClass)
      console.log('baseDifficulty', baseDifficulty, '下标', index)
      console.log('ruleIndex', ruleIndex, 'rules', rules)
      console.log(
        'dynamicRules',
        rules[ruleIndex] ? rules[ruleIndex]() : '规则不存在',
      )
      return result
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
    currentQuestionNum() {
      console.log('========', this.interCheckNodeCodeKnowledgeArr)
      return this.interCheckNodeCodeKnowledgeArr.reduce((pre, cur) => {
        // 计算当前项的 selChildren 中所有 questionConfigList 长度之和
        const childrenTotal = cur.selChildren.reduce((childPre, childCur) => {
          return (
            childPre +
            (childCur.questionConfigList
              ? childCur.questionConfigList.length
              : 1)
          )
        }, 0)
        return pre + childrenTotal
      }, 0)
    },
    async getQuestTypes() {
      if (!this.currScence.quesTypeCount) return
      this.questionTypes = this.currScence.quesTypeCount.map(v => {
        return {
          ...v,
          id: v.questionTypeId,
          num: v.questionNum,
          questTypeName: v.questionTypeName,
        }
      })
      this.checkList = this.questionTypes.map(v => v.id)

      // this.allQuestionTypes = this.currScence.recommends.map(v => {
      //   return {
      //     ...v,
      //     id: v.questionTypeId,
      //     activated: v.questionNum ? true : false,
      //     num: v.questionNum,
      //     questTypeName: v.questionTypeName,
      //   }
      // })
      // this.questionTypes = this.allQuestionTypes.filter(v => v.activated)

      // console.log('this.allQuestionTypes', this.allQuestionTypes)

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
    filterList(list) {
      //过滤数据
      const loop = arr => {
        arr.forEach(v => {
          v.isKnowledge = true
          v.children && loop(v.children)
        })
      }
      loop(list)
      const selectData = []
      while (list.length !== 0) {
        const data = list.shift()
        const index = selectData.findIndex(v => v.id === data.id)
        const cNode = { ...data, selChildren: data.children || [] }
        if (index !== -1) {
          if (data.children) {
            selectData[index].selChildren.push(data.children)
          }
        } else {
          selectData.push(cNode)
        }
      }
      return selectData
    },
    // 选择知识点
    async OnCheckNodeCodeKnowledge(val) {
      console.log(val, '=======================')

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
        this.interCheckNodeCodeKnowledgeArr = val //原有本地生成
        this.defaultTotalCount = this.currentQuestionNum()
        await this.getTableInfo()
        this.defaultTotalCount = this.totalMin = this.currentQuestionNum()

        this.getInit()
        this.countHnalde(val)
      }
    },
    // 初始化默认值
    getInit() {
      // 深层拷贝 interCheckNodeCodeKnowledgeArr，防止直接修改原始数据
      const copiedData = JSON.parse(
        JSON.stringify(this.interCheckNodeCodeKnowledgeArr),
      )
      console.log('copiedData', copiedData)
      const arr = []
      copiedData.forEach(v => {
        let init_que = this.defaultValue
        console.log('v.selChildren', v.selChildren)
        v.selChildren.forEach(y => {
          console.log('yyyyy', y)
          y.questionTypes = this.questionTypes
          if (!y.questionConfigList) {
            this.$set(y, 'questionConfigList', [])
          }
          if (y.questionConfigList.length === 0) {
            this.$set(y, 'questionConfigList', [
              {
                afterClassQuestion: Array.from(
                  { length: this.defaultAfterClassCount },
                  (_, i) => ({
                    count: this.defaultAfterClassCount,
                    difficulty: this.calculateDifficulty(
                      this.serachData.suitType,
                      y.difficulty,
                      i + 1,
                      false,
                    ),
                    quesType: this.defaultQuesType,
                  }),
                ),
                inClassQuestion: Array.from(
                  { length: this.defaultInClassCount },
                  (_, i) => ({
                    count: this.defaultInClassCount,
                    difficulty: this.calculateDifficulty(
                      this.serachData.suitType,
                      y.difficulty,
                      i + 1,
                      true,
                    ),
                    quesType: this.defaultQuesType,
                  }),
                ),
                questionExample: { ...init_que.questionExample },
              },
            ])
          }

          y.questionConfigList.forEach((config, index) => {
            this.$set(
              config,
              'inClassQuestion',
              config.inClassQuestion.map((ques, idx) => ({
                count: ques.count,
                difficulty: this.calculateDifficulty(
                  this.serachData.suitType,
                  y.difficulty,
                  idx + 1,
                  true,
                ),
                quesType: this.defaultQuesType,
              })),
            )

            this.$set(
              config,
              'afterClassQuestion',
              config.afterClassQuestion.map((ques, idx) => ({
                count: ques.count,
                difficulty: this.calculateDifficulty(
                  this.serachData.suitType,
                  y.difficulty,
                  idx + 1,
                  false,
                ),
                quesType: this.defaultQuesType,
              })),
            )

            this.$set(config, 'questionExample', {
              count: config.questionExample.count,
              difficulty:
                y.difficulty === 0
                  ? this.serachData.suitType
                  : 6 - y.difficulty, // 根据规则反转难度
              quesType: this.defaultQuesType,
            })
          })

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

      this.interCheckNodeCodeKnowledgeArr = copiedData
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
    deleteAll() {
      // this.interCheckNodeCodeKnowledgeArr = []
      // this.count = {
      //   little: 0,
      //   normal: 0,
      //   importan: 0,
      //   heavy: 0,
      // }
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

    //试题总量生成
    async getTableInfo() {
      if (!this.interCheckNodeCodeKnowledgeArr.length)
        return this.$refs.knowledgeMessage.showMessage('请选择知识点！')
      const knowLedgeList = this.interCheckNodeCodeKnowledgeArr.map(
        knowledge => {
          return {
            id: knowledge.id || '',
            importance: knowledge.importance || 0,
            name: knowledge.name || '',
            type: knowledge.types || 0,
            questionConfigList: knowledge.questionConfigList || [],
            // questionConfigSeniorList: [],

            children: knowledge.selChildren
              ? knowledge.selChildren.map(child => {
                  console.log('child', child)
                  return {
                    difficulty: child.difficulty,
                    id: child.id || '',
                    importance: child.importance || 0,
                    name: child.name || '',
                    type: child.types || 0,
                    questionConfigList: child.questionConfigList || [],
                    // questionConfigSeniorList: [],

                    // 如果有更深层次的children，递归处理
                    children: child.children
                      ? child.children.map(grandChild => {
                          return {
                            id: grandChild.id || '',
                            importance: grandChild.importance || 0,
                            name: grandChild.name || '',
                            type: grandChild.types || 0,
                            questionConfigList:
                              grandChild.questionConfigList || [],
                            // questionConfigSeniorList: [],
                            children: [],
                          }
                        })
                      : [],
                  }
                })
              : [],
          }
        },
      )
      console.log('knowLedgeList======', knowLedgeList)
      const smartGenerateBo = {
        // configType:'';//设置类型 1普通设置 2高级设置
        configType: this.advanced ? 2 : 1,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        knowLedgeList,
        type: this.isChapter ? 1 : this.isSpecial ? 3 : 2,
        suitType: this.serachData.suitType,
        version: this.versionCode,
        volume: this.volumeCode,
        grade: this.gradeCode,
        volumeName: this.volumeName || '2',
        gradeName: this.gradeName || '2',
        versionName: this.versionName || '2',
        inClassCount: this.defaultInClassCount,
        afterClassCount: this.defaultAfterClassCount,
        totalExampleCount: this.defaultTotalCount,
      }

      const res = await this.newPost(
        { urlPath: '/lesson-app/smartLesson/generateConfig' },
        smartGenerateBo,
      )

      if (res.code === 200 && res.data) {
        const list = this.filterList(res.data)
        this.interCheckNodeCodeKnowledgeArr = list
        this.updateAllAfterClassCounts()
        this.updateAllInClassCounts()
        this.getInit()
        this.countHnalde(list)
      }
      return res
    },
    // 生成试题
    makeQuestionMethod() {
      if (!this.interCheckNodeCodeKnowledgeArr.length) {
        this.$refs.knowledgeMessage.showMessage('请选择知识点！')
        return false
      }
      const knowLedgeList = this.interCheckNodeCodeKnowledgeArr.map(
        knowledge => {
          return {
            id: knowledge.id || '',
            importance: knowledge.importance || 0,
            name: knowledge.name || '',
            type: knowledge.types || 0,
            questionConfigList: knowledge.questionConfigList || [],
            // questionConfigSeniorList: [],

            children: knowledge.selChildren
              ? knowledge.selChildren.map(child => {
                  return {
                    id: child.id || '',
                    importance: child.importance || 0,
                    name: child.name || '',
                    type: child.types || 0,
                    questionConfigList: child.questionConfigList || [],
                    // questionConfigSeniorList: [],

                    // 如果有更深层次的children，递归处理
                    children: child.children
                      ? child.children.map(grandChild => {
                          return {
                            id: grandChild.id || '',
                            importance: grandChild.importance || 0,
                            name: grandChild.name || '',
                            type: grandChild.types || 0,
                            questionConfigList:
                              grandChild.questionConfigList || [],
                            // questionConfigSeniorList: [],
                            children: [],
                          }
                        })
                      : [],
                  }
                })
              : [],
          }
        },
      )
      const smartGenerateBo = {
        // configType:'';//设置类型 1普通设置 2高级设置
        configType: this.advanced ? 2 : 1,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        knowLedgeList,
        type: this.isChapter ? 1 : this.isSpecial ? 3 : 2,
        suitType: this.serachData.suitType,
        version: this.versionCode,
        volume: this.volumeCode,
        grade: this.gradeCode,
        volumeName: this.volumeName || '2',
        gradeName: this.gradeName || '2',
        versionName: this.versionName || '2',
        inClassCount: this.defaultInClassCount,
        afterClassCount: this.defaultAfterClassCount,
        totalExampleCount: this.defaultTotalCount,
        // grade:
        // grade 年级
        // version 版本
        // volume 册别
        // scene: this.currScence.paperTypeId,
        // mode: 1,
        // quesCountTotal: this.total || total,
        // diffDistList: numInfo,
        // questionTypes: quesTypeInfo,
        // knowLedges: modeShowInfo,
      }
      console.log('smartGenerateBo', smartGenerateBo)

      //console.log('最后提交的数据', this.interCheckNodeCodeKnowledgeArr)
      sessionStorage.setItem('pathType', smartGenerateBo.type)
      sessionStorage.advanced = +this.advanced
      // if (this.advanced) {
      //   params.knowledgeQuesType = this.advancedList
      // }
      sessionStorage.setItem('questionParams', JSON.stringify(smartGenerateBo))
      sessionStorage.removeItem('pageId')
      // 跳转编辑页面TODO
      // this.$router.push('')
      this.newPost(
        { urlPath: '/lesson-app/smartLesson/smartGenerate' },
        smartGenerateBo,
      ).then(res => {
        console.log('res', res)

        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$router.push({
            path: '/teachingPlanEdit',
            query: {
              id: res.data,
              type: this.isChapter ? 1 : this.isSpecial ? 3 : 2,
            },
          })

          // this.$message.success(res.msg)

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
        } else {
          this.$message.error(res.msg)
        }
      })
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
      // if (this.fullpath == 'chapter') {
      //   nodes.forEach(v => {
      //     arr.push({
      //       chapterId: v.id,
      //       code: v.id,
      //       children: v.selChildren.map(c => {
      //         return {
      //           chapterId: c.id,
      //           code: c.id,
      //           parentId: c.parentChapterCode
      //         }
      //       }),
      //       parentId: v.parentChapterCode
      //     })
      //   })
      // } else if (this.fullpath == 'knowledge') {
      //   nodes.forEach(v => {
      //     arr.push({
      //       chapterId: v.chapterId,
      //       code: v.chapterCode,
      //       children: v.selChildren.map(c => {
      //         return {
      //           chapterId: c.chapterId,
      //           code: c.chapterCode,
      //           parentId: c.parentId
      //         }
      //       }),
      //       parentId: v.parentId
      //     })
      //   })

      // } else {
      //   nodes.forEach(v => {
      //     arr.push({
      //       chapterId: v.catalogueId,
      //       code: v.code,
      //       children: v.selChildren.map(c => {
      //         return {
      //           chapterId: c.catalogueId,
      //           code: c.code,
      //           parentId: c.parentId
      //         }
      //       }),
      //       parentId: v.parentId
      //     })
      //   })
      // }

      // return arr
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
.none-right-border {
  border-right: none !important;
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
    left: -5px;
    top: -19px;
    line-height: 18px;
    height: 18px;
    width: max-content;
  }
}
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

  .input-with-text-area {
    margin-top: 30px;
    display: flex;
    .input-with-text:first-child {
      margin-right: 40px;
    }
    > div {
      display: flex;
      justify-content: center;
      align-content: center;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      span {
        margin-right: 20px;
        font-weight: bold;
      }
    }
  }
  .container-card-btn {
    background-color: #ffffff;
    border-top: 1px solid #e2e2e2;
  }

  .container-card {
    padding: 30px 20px 50px;
    background: $color-white;
    //margin-bottom: 16px;
    .select-area {
      min-height: 90px;
      padding: 30px 0;
    }
    .operation-area {
      .head-btn {
        display: flex;
      }
    }

    font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: normal;
    font-size: 12px;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;
    > .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e2e2;

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

    .container {
      margin-top: 30px;
    }

    .head-setting-card {
      width: fit-content;
      margin-top: 10px;
      //height: 80px;
      background-color: #eceff3;
      display: flex;
      text-align: center;
      //justify-content: center;
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;

      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: normal;
      font-size: 14px;
      color: #333333;
      //text-align: left;
      font-style: normal;
      text-transform: none;

      .input-with-text {
        width: 150px;
        position: relative;
        //display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
        //padding: 8px 0;
        border-top: 1px solid #e2e2e2;
        height: 50%;
      }
      .normal-setting {
        display: flex;
        flex-direction: column;
        span {
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        & > span {
          width: 100%;
          height: 50%;
        }
        span.type {
          border-top: 1px solid #e2e2e2;
          span {
            display: inline-block;
            width: 50%;
            height: 100%;
            line-height: 40px;
            text-align: center;
            &:first-of-type {
              border-right: 1px solid #e2e2e2;
            }
          }
        }
      }
      .class {
        // height: 80px;
      }
      .input-with-text::after {
        content: ''; //题/例
        position: absolute;
        right: 10px;
        top: 50%;
        color: #487fff;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 14px;
      }
      .el-input-number {
        width: 121px;
        margin-right: 0px;
      }
      & > span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #e2e2e2;
        &:last-of-type {
          border-right: none;
        }
      }
      & > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        border-right: 1px solid #e2e2e2;
        & > span {
          display: flex;
          text-align: center;
          justify-content: center;
          line-height: 40px;
        }
      }
      & > *:nth-child(1) {
        border-left: 1px solid #e2e2e2;
        width: 160px;
      }
      & > *:nth-child(2) {
        width: 238px;
      }
      & > *:nth-child(3) {
        width: 100px;
      }
      & > *:nth-child(4) {
        width: 150px;
        //height: 80px
      }
      & > *:nth-child(5) {
        width: 150px;
        //height: 80px
      }
      & > *:nth-child(6) {
        width: 60px;
      }
    }
    .advanced_setting-card {
      width: fit-content;
      display: flex;
      flex-direction: column;
      //border: 1px solid #E2E2E2;
      border-top: none;
      .card-wrap {
        display: flex;
        flex-direction: row;
        .zsd-title {
          display: flex;
          align-items: center;
          width: 160px;
          border-right: 1px solid #e2e2e2;
          border-bottom: 1px solid #e2e2e2;
          border-left: 1px solid #e2e2e2;
          padding: 0 10px;
        }
        .card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          .flex {
            display: flex;
          }
          .flex-row {
            flex-direction: row;
          }
          .flex-col {
            flex-direction: column;
          }
          .example-config {
            & > div {
              // border-right: 1px solid #e2e2e2;
              border-bottom: 1px solid #e2e2e2;
            }
            .example-num {
              width: 100px;
              border-bottom: none;
            }
          }
          //控制练习题这一块的css
          .example-config-wrap {
            border-bottom: 1px solid #e2e2e2;
            .example-config:last-child > div {
              border-bottom: 1px solid transparent;
            }
          }
          .testing_point-wrap {
            width: 238px;
            padding: 14px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-right: 1px solid #e2e2e2;
            border-bottom: 1px solid #e2e2e2;
            .el-icon-circle-plus-outline {
              margin-left: 8px;
              cursor: pointer;
              //width: 20px;
              //height: 20px;
              font-size: 16px;
            }
          }
          //例题
          .testing_point {
            //width: 238px
          }
          .short-text {
            display: flex;
            justify-content: center;
            align-items: center;
            //min-width: 100px;
            // border-right: 1px solid #e2e2e2;
            //border-bottom: 1px solid #E2E2E2;
          }
          .operation {
            display: flex;
            justify-content: center;
            border-bottom: none;
            span {
              border: none;
              text-align: center;
              color: #ff4b36;
            }
          }
          .example {
            width: 100px;
          }

          .count {
            padding: 5px 0;
            width: 150px;
            justify-content: center;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            .input {
              width: 119px;
              height: 30px;
            }
          }
          .operation {
            cursor: pointer;
            width: 60px;
          }
          //.difficulty {
          //  width: 230px;
          //}
        }
      }
    }
    // 缺省页
    .smart-setting-empty {
      width: 100%;
      display: flex;
      justify-content: center;
      height: 438px;
      align-items: center;
      img {
        width: 140px;
        height: 140px;
      }
      .text-wrap {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p {
          margin-top: 20px;
        }
      }
    }
    //高级设置
    .smart-setting-card-advanced {
      .head-setting-card {
        height: 80px;
        & > span {
          box-sizing: border-box;
        }
        & > *:nth-child(1) {
          width: 120px;
        }
        & > *:nth-child(2) {
          width: 240px;
        }
        & > *:nth-child(3) {
          width: 246px;
        }
        & > *:nth-child(4) {
          width: 130px;
          height: 80px;
        }
        & > *:nth-child(5) {
          width: 130px;
          height: 80px;
        }
      }
      .high-advanced_setting-card.advanced_setting-card {
        border: none;
        .card-wrap {
          .card-content {
            :deep(.el-icon-arrow-up:before) {
              color: #333333;
            }
            :deep(.el-select) {
              height: 32px;
              margin: 5px 0;
              width: 82px;
              font-family: MicrosoftYaHei, MicrosoftYaHei;
              font-weight: normal;
              font-size: 14px;
              color: #333333;
              //background-color: rgba(72, 127, 255, 0.1);
              border-radius: 4px;
              .el-input__icon {
                line-height: 28px;
              }
              .el-input__suffix {
              }

              .el-input--suffix .el-input__inner {
                font-family: MicrosoftYaHei, MicrosoftYaHei;
                font-weight: normal;
                font-size: 14px;
                color: #333333;
                border-radius: 4px;
                border: 1px solid #e2e2e2;
                //background: rgba(72, 127, 255, 0.1); /* 使用 rgba 设置背景色和透明度 */
              }
              .el-input__inner {
                border: none;
                padding: 0 25px 0 10px;
                border-radius: 4px;
              }
            }
            .testing_point-wrap {
              width: 240px;
            }
            .example-setting .el-select:first-of-type {
              margin-right: 10px;
            }
            .example-setting {
              width: 246px;
              display: grid;
              grid-template-columns: repeat(3, auto);
              gap: 10px;
              align-items: center;
              .text {
                line-height: 43px;
                margin-left: 10px;
              }
            }
            .class-difficulty {
              width: 130px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              &.aftercalss {
                .class-difficulty-item {
                }
              }
              .class-difficulty-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 100%;
                border-bottom: 1px solid #e2e2e2;
                // height: 100%;
                &:last-of-type {
                  border-bottom: none;
                }
                span {
                  width: 16px;
                  height: 16px;
                  // background-color: #487fff;
                  // border-radius: 50%;
                  font-family: DIN, DIN;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 16px;
                  color: #333;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin-right: 4px;
                }
              }
            }
          }
          .zsd-title {
            width: 120px;
          }
        }
      }
      i {
        cursor: pointer;
      }
    }

    > .border {
      //padding: 20px;
      //border-radius: 8px;
      //border: 1px solid #e2e2e2;
      //margin-top: 8px;
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
          &:nth-child(6) {
            width: 60px;
          }

          &:nth-child(7) {
            width: 60px;
          }
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

                :deep(.el-select) {
                  padding: 5px 0;
                  width: 82px;
                  font-family: MicrosoftYaHei, MicrosoftYaHei;
                  font-weight: normal;
                  font-size: 14px;
                  color: #333333;
                  background-color: rgba(72, 127, 255, 0.1);

                  .el-input__icon {
                    line-height: 28px;
                  }

                  .el-input--suffix .el-input__inner {
                    &:first-of-type {
                      margin-right: 10px;
                    }
                    font-family: MicrosoftYaHei, MicrosoftYaHei;
                    font-weight: normal;
                    font-size: 14px;
                    color: #333333;
                    border-radius: 4px;
                    background: rgba(
                      72,
                      127,
                      255,
                      0.1
                    ); /* 使用 rgba 设置背景色和透明度 */
                  }
                  .el-input__inner {
                    border: none;
                    padding: 0 25px 0 10px;
                    border-radius: 4px;
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

              :deep(.el-input-number) {
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
    font-weight: bold;

    .clear {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 20px;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #487fff;
      line-height: 0px;
      text-align: left;
      font-style: normal;
      text-transform: none;

      i {
        font-size: 12px;
        margin-right: 4px;
      }

      color: #487fff;
    }
  }

  .card-body {
    //padding: 12px;
  }

  .ai-choose-box {
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

  .ope-btn-box {
    justify-content: center;
    display: flex;
    width: 100%;
    text-align: center;
    padding: 12px 0;
    //padding: 20px 0;

    .product-paper {
      width: 140px;
      height: 36px;
      // background: rgba(97, 156, 245, 1);
      background: #487fff;
    }
  }
}

:deep(.el-input-number) {
  width: 120px;
  line-height: 30px;
  margin-right: 12px;

  .el-input__inner {
    //height: 30px;
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

:deep(.questionWrap) {
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

:deep(.regionWrap) {
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

:deep(.nameTag) {
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

:deep(.el-dialog__body) {
  padding: 30px 20px;
}

:deep(.el-dialog__footer) {
  text-align: center;
}

.checkboxItem {
  margin-bottom: 10px;
}
</style>
