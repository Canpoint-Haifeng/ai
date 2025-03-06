<template>
  <el-dialog
    v-model="questionVisible"
    class="question-seqarate-dialog"
    title="试题编辑"
    :append-to-body="true"
    :lock-scroll="false"
    :close-on-click-modal="false"
    top="50px"
    width="90%"
  >
    <template #header>
      <div class="question-seqarate-title">
        <div class="clearfix">
          <span class="q-title">试题编辑</span>
          <span class="q-select">
            目标题目结构：
            <el-cascader
              v-model="qStructureVal"
              class="popup-separate-question"
              :options="qStructureList"
              :show-all-levels="true"
              placeholder="请选择"
              separator="-"
              :props="{
                multiple: false,
                checkStrictly: false,
                label: 'name',
                value: 'code',
                expandTrigger: 'hover',
              }"
              @change="changeOption"
            />
          </span>
        </div>
      </div>
    </template>
    <div
      v-if="questionVisible"
      class="edit-question-content clearfix"
    >
      <div class="separate-left">
        <separate-sign-ckeditor
          :ref="wordSignEdit"
          :editid="wordSignEdit"
          :content="wordData"
          :showborder="false"
          :client-height="clientHeight"
          @updata-ck-editor-data="updataCkEditorData"
        />
      </div>
      <div class="separate-right">
        <div class="separate-questions">
          <div class="title">
            预览
          </div>
          <div
            class="content"
            :style="{ height: clientHeight - 230 + 'px' }"
          >
            <render-question
              style="padding: 5px"
              :ques="currentQues"
              :show-explain="true"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="save--separate-question-button">
        <el-button
          type="primary"
          class="btn popup-save-ques"
          @click="saveEditQuestion"
        >
          保存试题
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import CTS from '@/common/js/constant'
import { is } from '@/common/js/util'
import { separateQuestion, splitSeparateQuestion } from './common/common'
import { RenderQuestion } from '@/components/CpFan/index'
import separateSignCkeditor from '@/components/CkeditorText/separate-sign-ckeditor.vue'
import { throttle } from '@/common/helper/throttle-debounce'
import questionAttributeMixin from '@/common/mixins/questionAttributeMixin'

export default {
  name: 'PopupSeparateQuestion',
  components: { 
    RenderQuestion, 
    separateSignCkeditor 
  },
  mixins: [questionAttributeMixin],
  setup(props, { emit, refs }) {
    const store = useStore()
    
    // State
    const questionVisible = ref(false)
    const clientHeight = ref(600)
    const wordSignEdit = ref('wordSignEdit')
    const currentQues = ref(null)
    const wordData = ref('123123')
    const qStructureCid = ref('')
    const qStructureList = ref([])
    const qStructureVal = ref('')
    const targetQuesType = ref('')
    const wrapperThrottle = ref(null)
    const copyId = ref('')
    const stageSubject = ref('')
    const editType = ref('')
    const isSchoolType = ref(1) //word 导入 编辑试题
    
    // Computed
    const currSubject = computed(() => store.state.currSubject)
    
    // Methods
    const closeEditQuestion = () => {}
    
    const saveEditQuestion = () => {
      if (isSchoolType.value === 0) {
        saveSchoolEditQuestion()
      } else {
        saveEditTiQuestion()
      }
    }
    
    const saveEditTiQuestion = () => {
      let baseUrl = {
        urlPath:
          import.meta.env.VITE_PAPER_GENERATOR + '/selfQues/edit/quesRegroup',
      }
      let params = {
        id: copyId.value,
        quesData: JSON.stringify(currentQues.value),
        editType: editType.value,
      }
      saveHttpQuestion(baseUrl, params)
    }
    
    const saveSchoolEditQuestion = () => {
      let baseUrl = {
        urlPath:'/paper-builder/personal/quesRegroup',
      }
      let params = {
        id: copyId.value,
        quesData: JSON.stringify(currentQues.value),
      }
      saveHttpQuestion(baseUrl, params)
    }
    
    const saveHttpQuestion = (baseUrl, params) => {
      // Assuming apiPost is available through the mixin
      apiPost(baseUrl, params, { showLoading: true }).then(
        (res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            ElMessage({
              type: 'success',
              showClose: true,
              message: '保存成功',
            })
            questionVisible.value = false
            emit('changeQStructure')
          } else {
            ElMessage({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        },
        () => {
          ElMessage({
            type: 'error',
            showClose: true,
            message: '网络错误',
          })
        },
      )
    }
    
    const changeOption = (v) => {
      targetQuesType.value = v[v.length - 1]
      updataCkEditorData()
    }
    
    const initData = async () => {
      // Commented out in original code
      // let mCid = await getRelationCategoryId(
      //   CTS.cfgDict.CID_QUESTION_STRUCTURE,
      //   stageSubject.value,
      // )
      // if (mCid) {
      //   let list = await getCategoryAllData(mCid)
      //   dict2Indexes(list)
      //   if (list) {
      //     qStructureCid.value = mCid
      //     qStructureList.value = filteStructure17(list)
      //   }
      // }
    }
    
    const filteStructure17 = (list) => {
      if (list && list.length > 0) {
        list = list.filter((item) => item.code != 17)
      } else {
        list = []
      }
      return list
    }
    
    const updataCkEditorData = () => {
      if (!wrapperThrottle.value) {
        wrapperThrottle.value = throttle(1000, updataCkEditorDeal)
      }
      wrapperThrottle.value()
    }
    
    const updataCkEditorDeal = () => {
      let wordContect = getTextMcontent(wordSignEdit.value)
      currentQues.value = splitSeparateQuestion(
        wordContect,
        targetQuesType.value,
      )
    }
    
    const getTextMcontent = (editid) => {
      if (is(Array, refs[editid])) {
        return refs[editid][0].resultCkEditorData()
      } else {
        return refs[editid].resultCkEditorData()
      }
    }
    
    const openEditQuestion = (currentQuesParam, isSchoolTypeParam = 0) => {
      copyId.value = currentQuesParam.id
      editType.value = currentQuesParam.editType
      isSchoolType.value = isSchoolTypeParam
      qStructureVal.value = currentQuesParam.question.questionType || ''
      targetQuesType.value = qStructureVal.value
      wordData.value = separateQuestion(currentQuesParam)
      questionVisible.value = true
      clientHeight.value = document.documentElement.clientHeight - 100
      currentQues.value = splitSeparateQuestion(
        wordData.value,
        targetQuesType.value,
      )
    }
    
    // Lifecycle hooks
    onMounted(() => {
      stageSubject.value = currSubject.value.subjectCode
      initData()
    })
    
    onBeforeUnmount(() => {
      wrapperThrottle.value = null
    })
    
    return {
      questionVisible,
      clientHeight,
      wordSignEdit,
      currentQues,
      wordData,
      qStructureCid,
      qStructureList,
      qStructureVal,
      targetQuesType,
      closeEditQuestion,
      saveEditQuestion,
      changeOption,
      updataCkEditorData,
      openEditQuestion
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .edit-question-content{
    display: flex;
    background-color: #fff;
    padding-top: 20px;
    .separate-left{
      flex:1;
      width: 570px;
      padding:0 10px 0 20px;
    }
    .separate-right{
      width: 570px;
      padding:0 20px 0 10px;
    }
  }
  .question-seqarate-title{
    font-size: 16px;
    .q-title{
      line-height: 40px;
      color: #000000;
    }
    .q-select{
      font-size: 14px;
      float: right;
      margin-right: 200px;
      color: #666666;
    }
  }
  .question-seqarate-dialog :deep(.el-dialog){
    border-radius: 6px;
    
    .el-dialog__header{
      border-radius: 6px 6px 0px 0px;
      padding: 0px 35px 0px 20px;
    }
  }
  .question-seqarate-dialog :deep(.save--separate-question-button){
    text-align: center;
  }
  .separate-questions{
    .title{
      padding: 0 20px;
      border-radius: 6px 6px 0px 0px;
      line-height: 40px;
      border: 1px solid #E2E2E2;
      background: #F6F6F6;
      font-size: 16px;
      font-family: Microsoft YaHei;
    }
    .content{
      overflow-y: auto;
      border: 1px solid #E2E2E2;
      border-top-width: 0;
      border-radius: 0px 0px 6px 6px ;
      padding: 10px;
    }
  }
  .popup-save-ques{
    width:130px;
    height:40px;
    background:#487FFF;
    border-radius:20px;
    font-size: $color-button-d;
    &:hover{
      background:$color-button-d-hover;
      border: 1px solid $color-button-d-hover;
    }
  }

  .popup-separate-question :deep(.el-input__inner) {
    border-radius: 4px;
  }
</style>

</style>
