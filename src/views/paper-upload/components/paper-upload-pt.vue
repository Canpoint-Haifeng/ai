<template>
  <div class="paper-upload-pt">
    <div class="paper-attr">
      <p class="remak">
        <span>注：上传试卷被采纳后您将可免费使用此试卷！</span>
        <span
          style="cursor: pointer"
          @click="
            $router.push('/paper/resources/papers?tabActiveName=myUploadPaper')
          "
        ><i class="icon iconfont iconshangchuan" />我的上传</span>
      </p>
      <el-form
        ref="ruleForm"
        :inline="true"
        label-position="top"
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
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
              @update:value="item.code = $event"
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
              @update:value="item.code = $event"
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
              @update:value="item.code = $event"
            />
          </el-select>
        </el-form-item>
        <el-form-item
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
              :key="item.code"
              :label="item.name"
              :value="item.code"
              @update:value="item.code = $event"
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
              @update:value="item.code = $event"
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
              @update:value="item.code = $event"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地区：">
          <el-cascader
            ref="locationRef"
            v-model="formInline.location"
            separator="-"
            placeholder="请选择地区"
            :disabled="formDisabled"
            :options="locationArr"
            :props="{ checkStrictly: true, label: 'name', value: 'code' }"
            clearable
            @change="isValidate"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="paper-remarks">
      <h1 class="remarks-tit">
        提示：
      </h1>
      <div class="one">
        <span>1、</span>
        <p>
          上传文档如不按以下命名规则，试卷将被拒绝加工；
          <br>
          期中、期末、月考试卷请参照“学年+省+地级市/区（+学校）+年级+学期+试卷类型+学科”命名；
          <br>
          单元、同步请参照“版本+年级+上/下册+章节名字+年份+单元/同步”命名。
        </p>
      </div>
      <div class="two">
        <span>2、</span>
        <p>
          仅支持doc/docx/pdf文档上传，文档大小不超过5M，如是图片请复制word文档中另存为PDF文档再进行上传。
        </p>
      </div>
    </div>
    <!-- <el-dialog title="提示" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="500px" custom-class="tip-dia" :close-on-click-modal="false">
      <div class="dia-content"><h1>请先完善您需要上传的试卷相关信息后再上传文件！</h1></div>
    </el-dialog> -->
    <el-dialog
      :visible="dialogVisible"
      class="dialog-wrapper"
      title="提示"
      :modal-append-to-body="false"
      :lock-scroll="false"
      width="500px"
      @update:visible="dialogVisible = $event"
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
      is-file-type=".doc/.docx/.pdf"
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
    setup() {
      const uploadFile = ref(null)
      const yearsRef = ref(null)
      const gradeRef = ref(null)
      const sourceTypeRef = ref(null)
      const stageSubjectRef = ref(null)
      const versionRef = ref(null)
      const locationRef = ref(null)
      const ruleForm = ref(null)
      
      const state = reactive({
        dialogVisible: false,
        formInline: {
          stageSubject: null,
          version: null,
          grade: null,
          volume: null,
          sourceType: null,
          year: null,
          location: null,
          infoName: null,
          paperType: 1,
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
        },
        StageSubjectArr: [], // 学科学段
        versionArr: [], // 版本
        yearsArr: [], // 年份
        gradeArr: [], // 年级
        volumeArr: [], // 册别
        sourceTypeArr: [], // 类型
        locationArr: [],
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mounted() {
      this.initSelectData()
      axios.get('/json/location.json').then((res) => {
        this.locationArr = res.data.data
      })
    },
    methods: {
      // 获取学科学段
      initSelectData() {
        let StageSubjectArr = this.wayGet(API.GET_ALL_BY_CID, {
          categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
        }) // 学段-学科-版本-年级
        let quesyearArr = this.wayGet(API.GET_ALL_BY_CID, {
          categoryId: CTS.cfgDict.CID_QUESTION_YEARS,
        }) // 使用年份
        Promise.all([StageSubjectArr, quesyearArr]).then((res) => {
          if (res.length) {
            let subjectArr = []
            let data1 = res[0].data
            for (let i = 0; i < data1.length; i++) {
              let item = data1[i].children
              for (let n = 0; n < item.length; n++) {
                subjectArr.push({
                  parentId: item[n].parentId,
                  dictId: item[n].dictId,
                  code: item[n].code,
                  name: data1[i].name + '-' + item[n].name,
                  isRelation: item[n].isRelation,
                  children: item[n].children,
                })
              }
            }
            this.StageSubjectArr = subjectArr
            this.yearsArr = res[1].data
            this.formInline.stageSubject = this.currSubject.subjectCode
            this.isValidate(this.formInline.stageSubject, 'stageSubject')
          }
        })
      },
      // select Change事件
      async isValidate(a, b) {
        if (
          this.formInline.stageSubject &&
          this.formInline.version &&
          this.formInline.grade &&
          this.formInline.sourceType &&
          this.formInline.year &&
          this.formInline.volume
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
            // let sourceTypeCid = await this.getEdition(100180, a.substring(0, 2), 1, 'sourceType')
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
          this.renderVolumeArr()
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
        let locationVal = this.formInline.location
          ? this.$refs.locationRef.getCheckedNodes()[0].pathLabels.join('-')
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
            .then((res) => {
              // 判断是否是高中学段
              if (String(this.currSubject.periodCode) === '13') {
                res.forEach((item) => {
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
                  let code =
                    item.code.substring(0, 2) + item.code.substring(6, 8)
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
      // 表单验证
      validateFrom() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
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
        this.wayGet(API.GET_DICT_ARBITRARILY_DICTID, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              let list = res.data
              if (list && list.length) {
                list = list.filter((item) => item.code !== '1216')
              }
              this.gradeArr = list
            }
          }
        })
      },
      submitForm(file) {},
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
  
  .paper-upload-pt {
    background: #fff;
    padding: 30px 18px;

    .paper-attr {
      .remak {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 30px;
        span:nth-child(1) {
          color: #f4986a;
        }
        span:nth-child(2) {
          color: #487FFF;
          font-weight: bold;
          i {
            font-weight: 100;
            padding-right: 6px;
            font-size: 14px;
          }
        }
      }
      .el-form {
        :deep(.el-form-item) {
          margin-right: 90px;
          .el-form-item__label {
            line-height: inherit;
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
              height: 30px !important;
            }
          }
        }
      }
    }

    .paper-remarks {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
      line-height: 24px;

      .remarks-tit {
        font-size: 14px;
      }

      .one {
        display: flex;
      }

      .two {
        display: flex;
      }
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
  }
</style>
