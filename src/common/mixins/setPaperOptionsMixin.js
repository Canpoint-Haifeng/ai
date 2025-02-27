import { paperOptions } from '@/common/config/paperOptions'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'

const setPaperOptionsMixin = {
  data() {
    return {
      paperOptions
    }
  },
  computed: {
    ...mapState(['currSubject'])
  },
  mounted() {
    // 监听试卷参数配置
    this.Bus.$on('setOptions', this.onSetOptions)
  },
  methods: {
    // 显示编辑input
    showEditInput(params) {
      params.isShowInput = true
      params.oldText = params.text
      this.$nextTick(() => {
        if (this.$refs[params.element] instanceof Array) {
          this.$refs[params.element][params.index].focus()
        } else {
          this.$refs[params.element].focus()
        }
      })
    },
    // 失去焦点隐藏input
    blurEditInput(params) {
      if (!params.text.trim()) {
        this.$message.error('输入内容为空，无法保存!')
        return
      }
      // if (params.text.length < 2 || params.text.length > 30) {
      //   this.$message.error('输入内容长度为2-30个字符！')
      //   return
      // }
      // 判断内容是否修改，未修改直接
      if (params.text === params.oldText) {
        params.isShowInput = false
        return
      }
      if (CTS.constant.inputNameReg.test(params.text)) {
        this.$message.error('输入内容格式错误，无法保存！')
        return
      }
      if (params.element === 'questionTypeInput' && this.questionTypes.includes(params.text)) {
        this.$message.error(`输入内容已经含有${params.text}，无法保存，请换一个名称！`)
        return
      }
      this.saveEditInput(params)
    },
    // 保存修改信息
    saveEditInput(paramsObj) {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode
      }
      let url = {urlPath: '/paper-builder/testPaper/updatePaperInfo'}
      if (paramsObj.element === 'paperHeadlineInput') {
        // url = API.TEMP_PAPER_UPDATE_HEADLINE
        parms.paperHeadline = paramsObj.text
      }
      if (paramsObj.element === 'secretSignInput') {
        // url = API.TEMP_PAPER_UPDATE_SECRETSIGN
        parms.secretSign = paramsObj.text
      }
      if (paramsObj.element === 'paperSubtitleInput') {
        // url = API.TEMP_PAPER_UPDATE_SUBTITLE
        parms.paperSubtitle = paramsObj.text
      }
      if (paramsObj.element === 'testRangInput' || paramsObj.element === 'testTimeInput' || paramsObj.element === 'testCreaterInput') {
        // url = API.TEMP_PAPER_UPDATE_PAPERINFO
        let paperInfo = `考试范围：${this.testRang.text};考试时间：${this.testTime.text};命题人：${this.testCreater.text}`
        parms.paperInfo = paperInfo
      }
      if (paramsObj.element === 'payAttentionInput') {
        // url = API.TEMP_PAPER_UPDATE_PAYATTENTION
        parms.payAttention = paramsObj.text
      }
      if (paramsObj.element === 'groupNameInput' && paramsObj.ordinal === 1) {
        // url = API.TEMP_PAPER_UPDATE_GROUPONE
        parms.sectionOneName = paramsObj.text
      }
      if (paramsObj.element === 'groupNameInput' && paramsObj.ordinal === 2) {
        // url = API.TEMP_PAPER_UPDATE_GROUPTWO
        parms.sectionTwoName = paramsObj.text
      }
      if (paramsObj.element === 'groupDescInput' && paramsObj.ordinal === 1) {
        // url = API.TEMP_PAPER_UPDATE_GROUPDESCONE
        parms.sectionOneDesc = paramsObj.text
      }
      if (paramsObj.element === 'groupDescInput' && paramsObj.ordinal === 2) {
        // url = API.TEMP_PAPER_UPDATE_GROUPDESCTWO
        parms.sectionTwoDesc = paramsObj.text
      }
      if (paramsObj.element === 'questionTypeInput') {
        // url = API.QUESTION_UPDATE_TYPENAME
        parms.questionTypeCode = paramsObj.typeCode
        parms.questionTypeName = paramsObj.text
      }
      if (paramsObj.element === 'paperHeadlineInput') {
        // 编辑时 点击保存试卷 ，导致名称不统一
        paramsObj.isShowInput = false
        this.Bus.$emit('editPaperHeadline', paramsObj)
      }
      this.newPost(url, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          paramsObj.isShowInput = false
          // this.$message.success('修改成功！')
          // if (paramsObj.element === 'paperHeadlineInput') {
          //   this.Bus.$emit('editPaperHeadline', paramsObj)
          // }
          if (paramsObj.element === 'questionTypeInput') {
            this.Bus.$emit('editQuestionTypeName', paramsObj)
          }
          if (paramsObj.element === 'groupNameInput') {
            this.Bus.$emit('editGroupName', paramsObj)
          }
        }
      })
    },
    // 监听试卷参数配置
    onSetOptions(options, times) {
      this.paperOptions.forEach(item => {
        item.isSet = false
        options.forEach(subItem => {
          if (subItem === item.label) {
            item.isSet = true
          }
        })
      })
    }
  },
  unmounted() {
    this.Bus.$off('setOptions')
  }
}

export default setPaperOptionsMixin
