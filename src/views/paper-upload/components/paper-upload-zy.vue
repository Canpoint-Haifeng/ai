<template>
  <div class="paper-upload-pt">
    <div class="paper-attr">
      <p class="remak">
        <span>注：上传试卷自用可在我的资源中查看，也可分享至校本资源给学校其他老师使用。</span>
        <span
          style="cursor: pointer"
          @click="
            $router.push('/paper/resources/papers?tabActiveName=myUploadPaper')
          "
        >
          我的自用
          <i class="el-icon-arrow-right icon_right" />
        </span>
        <!-- <i class="icon iconfont iconshangchuan"></i> -->
      </p>
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="学科："
          prop="stageSubject"
        >
          <el-select
            ref="stageSubjectRef"
            v-model="formInline.stageSubject"
            disabled
            placeholder="请选择学科"
            clearable
            @change="isValidate($event, 'stageSubject')"
          >
            <el-option
              v-for="item in StageSubjectArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="教材："
          prop="version"
        >
          <el-select
            ref="versionRef"
            v-model="formInline.version"
            :disabled="formDisabled"
            placeholder="请选择教材版本"
            clearable
            @change="isValidate($event, 'version')"
          >
            <el-option
              v-for="item in versionArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="年级："
          prop="grade"
        >
          <el-select
            ref="gradeRef"
            v-model="formInline.grade"
            :disabled="formDisabled"
            placeholder="请选择年级"
            clearable
            @change="isValidate($event, 'grade')"
          >
            <el-option
              v-for="item in gradeArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="formInline.grade"
          label="册别："
          prop="volume"
        >
          <el-select
            ref="volumeRef"
            v-model="formInline.volume"
            :disabled="formDisabled"
            placeholder="请选择册别"
            clearable
            @change="isValidate($event, 'volume')"
          >
            <el-option
              v-for="item in volumeArr"
              :key="item.name"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="类型："
          prop="sourceType"
        >
          <el-select
            ref="sourceTypeRef"
            v-model="formInline.sourceType"
            :disabled="formDisabled"
            placeholder="请选择类型"
            clearable
            @change="isValidate"
          >
            <el-option
              v-for="item in sourceTypeArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="年份："
          prop="year"
        >
          <el-select
            ref="yearsRef"
            v-model="formInline.year"
            :disabled="formDisabled"
            placeholder="请选择年份"
            clearable
            @change="isValidate"
          >
            <el-option
              v-for="item in yearsArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="地区："
          prop="location"
        >
          <el-select
            ref="locationRef"
            v-model="formInline.location"
            :disabled="formDisabled"
            placeholder="请选择地区"
            clearable
            @change="isValidate"
          >
            <el-option
              v-for="item in locationArr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="paper-remarks">
      <h1 class="remarks-tit">
        备注：
      </h1>
      <div class="one">
        <span>1、</span>
        <p>自用试卷上传仅支持Word格式文档；</p>
      </div>
      <div class="two">
        <span>2、</span>
        <p>
          上传文档支持多种主流试卷模板；<!-- （<span>模板1</span>、<span>模板2</span>、<span>模板3</span>） -->
        </p>
      </div>
    </div>
    <el-dialog
      v-model:visible="dialogVisible"
      class="dialog-wrapper"
      title="提示"
      :modal-append-to-body="false"
      width="500px"
    >
      <div class="dialog-content">
        <div class="dialog-tips">
          请先完善您需要上传的试卷相关信息后再上传文件！
        </div>
      </div>
      <template #footer>
        <div
          class="dialog-footer"
          style="text-align: center"
        >
          <el-button
            class="btn btn-shadow"
            @click="dialogVisible = false"
          >
            知道了
          </el-button>
        </div>
      </template>
    </el-dialog>
    <upload
      ref="uploadFile"
      is-file-type=".doc/.docx"
      :form-inline="formInline"
      :see-other-paper="true"
      @validate-from="validateFrom"
      @set-form-disabled="setFormDisabled"
      @clean-form="cleanForm"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import axios from 'axios'
import Upload from './upload.vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
export default {
  components: {
    Upload,
  },
  data() {
    return {
      dialogVisible: false,
      formInline: {
        stageSubject: null,
        stage: null,
        subject: null,
        version: null,
        grade: null,
        volume: null,
        sourceType: null,
        year: null,
        location: null,
        infoName: null,
        paperType: 0,
      },
      formDisabled: false,
      rules: {
        stageSubject: [
          {
            required: true,
            message: '请选择学科',
            trigger: 'change',
          },
        ],
        version: [
          {
            required: true,
            message: '请选择教材',
            trigger: 'change',
          },
        ],
        grade: [
          {
            required: true,
            message: '请选择年级',
            trigger: 'change',
          },
        ],
        volume: [
          {
            required: true,
            message: '请选择册别',
            trigger: 'change',
          },
        ],
        sourceType: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        year: [
          {
            required: true,
            message: '请选择年份',
            trigger: 'change',
          },
        ],
        location: [
          {
            required: true,
            message: '请选择地区',
            trigger: 'change',
          },
        ],
      },
      StageSubjectArr: [], // 学科学段
      versionArr: [], // 版本
      yearsArr: [], // 年份
      gradeArr: [], // 年级
      allVolumeArr: [],
      volumeArr: [], // 册别
      sourceTypeArr: [], // 类型
      locationArr: [],
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    formInline: {
      handler(newUrl, oldUrl) {
        let data = [...this.allVolumeArr]
        if (newUrl.grade) {
          this.volumeArr = data.filter(v => v.gradeId == newUrl.grade)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getAllList()
  },
  created() {
  },
  methods: {
    returnDistinct(data) {
      let newArrId = []
      let newArrObj = []
      data.forEach(item => {
        if (newArrId.indexOf(item.code) == -1) {
          newArrId.push(item.code)
          newArrObj.push(item)
        }
      })
      console.log(newArrObj);
      return newArrObj
    },
    getAllList() {
      this.StageSubjectArr = [{ code: this.currSubject.subjectCode, name: this.currSubject.subjectName }]
      this.formInline.stageSubject = this.currSubject.subjectCode
      this.formInline.stage = this.currSubject.periodCode
      this.formInline.subject = this.currSubject.subjectCode
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/lesson-app/config/getInvokeInfo' }, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let gradeData = []
          let volumeData = []
          let versionData = []
          res.data.forEach(item => {
            versionData.push({ 'code': item.id, 'name': item.name })
          })
          res.data[0].gradeList.forEach(item => {
            gradeData.push({ 'code': item.gradeId, 'name': item.gradeName })
            volumeData.push({ 'code': item.volumeId, 'name': item.volumeName, 'gradeId': item.gradeId })
          })
          this.versionArr = versionData
          this.gradeArr = this.returnDistinct(gradeData)
          this.allVolumeArr = volumeData
        }
      })
      this.apiGet({ urlPath: '/paper-builder/config/getYears' }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let yearsData = []
          res.data.forEach(item => {
            yearsData.push({ 'code': item.plId, 'name': item.name })
          })
          this.yearsArr = yearsData
        }
      })
      this.apiGet({ urlPath: '/paper-builder/config/getAreas' }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let locationData = []
          res.data.forEach(item => {
            locationData.push({ 'code': item.id, 'name': item.name })
          })
          this.locationArr = locationData
        }
      })
      this.apiGet({ urlPath: '/paper-builder/config/getPaperType' }, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let sourceData = []
          res.data.paperScene.forEach(item => {
            sourceData.push({ 'code': item.id, 'name': item.name })
          })
          this.sourceTypeArr = sourceData
        }
      })
    },
    initReUploadPaper() {
      // this.$store.state.reUploadPaper
      if (this.$store.state.reUploadPaper) {
        let reUploadPaper = this.$store.state.reUploadPaper
        this.formInline.version = reUploadPaper.version + ''
        this.formInline.grade = reUploadPaper.grade + ''
        this.formInline.year = reUploadPaper.year + ''
        this.formInline.infoName = reUploadPaper.infoName
        this.formInline.sourceType = reUploadPaper.sourceType + ''
        if (reUploadPaper.location) {
          this.formInline.location = reUploadPaper.location + ''
        }

        this.$store.state.reUploadPaper = null
      }
    },
    // select Change事件
    async isValidate(a, b) {
      if (
        this.formInline.stageSubject &&
        this.formInline.version &&
        this.formInline.grade &&
        this.formInline.sourceType &&
        this.formInline.year &&
        this.formInline.volume &&
        this.formInline.location
      ) {
        this.$refs.uploadFile.setDisable(false)
      } else {
        this.$refs.uploadFile.setDisable(true)
      }
      if (b === 'stageSubject') {
        this.formInline.version = null
        this.formInline.grade = null
        this.formInline.sourceType = null
        this.versionArr = []
        this.gradeArr = []
        this.volumeArr = []
        this.sourceTypeArr = []
        if (a) {
          this.versionArr = this.GetCode(a, this.StageSubjectArr)
          this.getGradeData()
          let sourceTypeCid = await this.getEdition(
            CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_SOURCE,
            a.substring(0, 2),
            1,
            'sourceType',
          )
          if (sourceTypeCid) {
            let arrData = await this.wayGet(API.GET_ALL_BY_CID, {
              categoryId: sourceTypeCid,
            })
            if (arrData.data) {
              this.sourceTypeArr = arrData.data
            }
          }
        }
      } else if (b === 'version' || b === 'grade') {
        // this.renderVolumeArr()
      }
      let yearsVal = this.$refs.yearsRef._data.selectedLabel
        ? this.$refs.yearsRef._data.selectedLabel
        : ''
      let gradeVal = this.$refs.gradeRef._data.selectedLabel
        ? this.$refs.gradeRef._data.selectedLabel
        : ''
      let sourceTypeVal = this.$refs.sourceTypeRef._data.selectedLabel
        ? this.$refs.sourceTypeRef._data.selectedLabel
        : ''
      let stageSubjectVal = this.$refs.stageSubjectRef._data.selectedLabel
        ? this.$refs.stageSubjectRef._data.selectedLabel
        : ''
      let versionVal = this.$refs.versionRef._data.selectedLabel
        ? this.$refs.versionRef._data.selectedLabel
        : ''
      let locationVal = this.$refs.locationRef._data.selectedLabel
        ? this.$refs.locationRef._data.selectedLabel
        : ''
      let name =
        yearsVal +
        locationVal +
        gradeVal +
        sourceTypeVal +
        stageSubjectVal +
        versionVal
      this.formInline.infoName = name
    },
    renderVolumeArr() {
      this.formInline.volume = ''
      this.volumeArr = []
      console.log(
        'renderVolumeArr',
        this.formInline.version,
        this.formInline.grade,
      )
      if (this.formInline.version && this.formInline.grade) {
        let strParams = {
          versionCode: this.formInline.version,
          subjectCode: this.currSubject.subjectCode,
        }
        let classArrVom = []
        this.$store
          .dispatch('getConfigData', {
            vm: this,
            type: 5,
            strParams: strParams,
            setKey: 'configVolume',
          })
          .then(res => {
            // 判断是否是高中学段
            if (String(this.currSubject.periodCode) === '13') {
              res.forEach(item => {
                let currItem = {
                  code: item.code,
                  name: item.name,
                }
                classArrVom.push(currItem)
              })
              this.volumeArr = classArrVom
            } else {
              for (let i = 0, len = res.length; i < len; i++) {
                let item = res[i]
                let code = item.code.substring(0, 2) + item.code.substring(6, 8)
                console.log(code, this.formInline.grade)
                if (code == this.formInline.grade) {
                  if (item.children && item.children.length) {
                    this.volumeArr = item.children
                    break
                  }
                }
              }
            }
            console.log(this.volumeArr)
          })
      }
    },
    // getRelationCategoryId(periodCode) {
    //   let parms = {
    //     categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_SOURCE,
    //     code: periodCode,
    //     level: '1'
    //   }
    //   return this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       this.currTypeCode = 0
    //       this.currSubTypeCode = 0
    //       if (res.data[1]) {
    //         return res.data[1].relationCategoryId
    //       } else {
    //         return ''
    //       }
    //     } else {
    //       return ''
    //     }
    //   })
    // },
    // 表单验证
    validateFrom() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          console.log(this.formInline);
          // this.$refs['elupload'].$refs['upload-inner'].handleClick()
        } else {
          this.$refs.uploadFile.setDisable(true)
          this.dialogVisible = true
          console.log('error submit!!')
          return false
        }
      })
    },
    // 根据code找children
    GetCode(code, arr) {
      let newarr = []
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (code === arr[i].code) {
            newarr = arr[i].children
          }
        }
        return newarr
      }
    },
    // 根据学科学段获取版本
    async getEdition(categoryId, code, level, name) {
      let parms = {
        categoryId: categoryId,
        code: code,
        level: level,
      }
      let res = await this.wayGet(API.GET_CHILD_DICT, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        let result = res.data
        if (result && result.length > 1 && result[1].relationCategoryId) {
          return result[1].relationCategoryId
        } else {
          return ''
        }
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: res.msg,
        })
      }
    },
    // 获取年级数据
    getGradeData() {
      let parms = {
        categoryId: CTS.cfgDict.CID_USER_PERIOD_GRADE,
        code: this.currSubject.periodCode,
      }
      this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data) {
            let list = res.data
            if (list && list.length) {
              list = list.filter(item => item.code !== '1216')
            }
            this.gradeArr = list
          }
        }
      })
    },
    submitForm(file) { },
    // 清除表单
    cleanForm() {
      this.$refs['ruleForm'].resetFields()
      // this.$refs['ruleForm'].clearValidate()
      this.formInline.location = null
      this.formInline.stageSubject = this.currSubject.subjectCode
    },
    // 设置表单可否编辑
    setFormDisabled(a) {
      this.formDisabled = a
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.paper-upload-pt {
  background: #fff;
  // padding: 0px 0px;

  .paper-attr {
    .remak {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 30px;

      span:nth-child(1) {
        color: #666666;
        font-size: 16px;
      }

      span:nth-child(2) {
        color: #487FFF;
        font-weight: bold;

        i {
          font-weight: bold;
          //   padding-right: 6px;
          font-size: 14px;
          color: #487FFF;
        }
      }
    }

    .el-form {
      :deep(.el-form-item) {
        margin-right: 90px;

        .el-form-item__label {}

        .el-select,
        .el-cascader {
          width: 270px;

          .el-input__inner {
            border-radius: 4px;
            line-height: 30px;
            height: 30px !important;
          }

          .el-input__icon {
            line-height: 30px;
            height: 30px;
          }
        }
      }
    }
  }

  .paper-remarks {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
    line-height: 24px;

    .remarks-tit {
      font-size: 14px;
    }

    .one {
      display: flex;
    }

    .two {
      display: flex;

      p {
        span {
          color: #487FFF;
        }
      }
    }
  }

  .upload-file-paper {
    margin-top: 40px;
  }

  :deep(.tip-dia) {
    .el-dialog__header {
      background: #fff;
      padding: 26px 40px;
      border-bottom: 1px solid #e0e0e0;

      .el-dialog__title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
      }

      .el-dialog__headerbtn {
        top: 30px;
      }
    }

    .el-dialog__body {
      .dia-content {
        h1 {
          padding: 70px 108px;
          text-align: center;
          width: 283px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
        }
      }
    }
  }

  .el-form {
    :deep(.el-form-item) {
      margin-right: 90px;
      //   margin-top: 30px;
      margin-bottom: 30px;

      .el-form-item__label {
        font-size: 16px;
        padding-right: 2px;
        color: #333333;
        font-family: MicrosoftYaHei-, MicrosoftYaHei;
        // line-height: inherit;
      }

      .el-select,
      .el-cascader {
        width: 270px;

        .el-input__inner {
          border-radius: 4px;
          line-height: 30px;
          height: 30px !important;
        }

        .el-input__icon {
          line-height: 30px;
          height: 30px;
        }
      }
    }

    .form_item {
      :deep(.el-input) {
        width: 270px;
      }

      :deep(.el-input__inner) {
        border-radius: 4px;
      }
    }
  }

}
</style>
