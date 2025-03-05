<template>
  <div>
    <el-dialog
      title="欢迎使用全品AI教研云"
      width="670px"
      class="select-subject-sync"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="hide"
    >
      <div class="subject-sync-segment">
        <div class="subject-sync-body">
          <div class="subject-sync-title">
            请选择您的学段学科，以便为您推送更适合的教学资源！
          </div>
          <div class="subject-sync-body">
            <el-form
              ref="subjectSyncFormRef"
              :model="formData"
              :rules="formRules"
              label-width="82px"
              :hide-required-asterisk="true"
            >
              <el-form-item label="学段学科：" prop="currentSubject">
                <div class="subject-item-select">
                  <el-select
                    v-model="formData.currentSubject"
                    @change="changeSubject"
                    value-key="subjectCode"
                    placeholder="请选择学科"
                  >
                    <el-option
                      v-for="item in subjectList"
                      :key="item.subjectCode"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="教材版本：" prop="teachCurrentCode">
                <div class="subject-item-select">
                  <el-select
                    v-model="formData.teachCurrentCode"
                    @change="changeTeach"
                    value-key="subjectCode"
                    placeholder="请选择教材版本"
                  >
                    <el-option
                      v-for="item in teachData"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="教材册别：" prop="volumeCurrentCode">
                <div class="subject-item-select el-cyy-rewrite">
                  <el-select
                    v-model="formData.volumeCurrentCode"
                    @change="changeGradeVolume"
                    value-key="subjectCode"
                    placeholder="请选择册别"
                  >
                    <el-option
                      v-for="item in classData"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="subject-sync-footer">
          <el-button class="btn btn-shadow-pay" @click="onConfirm"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isLogin, setCookieSubjectVolume } from '@/common/js/util.js'
import { API } from '@/api/config.js'
export default {
  data() {
    return {
      visible: false,
      subjectList: [],
      teachData: [],
      classData: [],
      formData: {
        currentSubject: null,
        currnetTeach: {},
        currentVolume: {},
        teachCurrentCode: '',
        gradeCurrentCode: '',
        volumeCurrentCode: '',
      },
      formRules: {
        currentSubject: [
          { required: true, message: '请选择学科', trigger: 'change' },
        ],
        teachCurrentCode: [
          { required: true, message: '请选择教材版本', trigger: 'change' },
        ],
        volumeCurrentCode: [
          { required: true, message: '请选择册别', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    changeSubject(v) {
      this.formData.teachCurrentCode = ''
      this.formData.gradeCurrentCode = ''
      this.formData.volumeCurrentCode = ''
      this.getBookCategoryId()
    },
    onConfirm() {
      this.$refs.subjectSyncFormRef.validate(valid => {
        if (valid) {
          this.setSubjectStageTeachVolume()
        } else {
          return false
        }
      })
    },
    //  设置 当前学段学科
    setSubjectStageTeachVolume() {
      let cSubjectData = this.formData.currentSubject
      let classVom = this.classData.find(
        item => item.code == this.formData.volumeCurrentCode,
      )
      let teach = this.teachData.find(
        item => item.code == this.formData.teachCurrentCode,
      )
      let volume = ''
      if (classVom && teach) {
        volume = {
          tCode: teach.code,
          vCode: classVom.volumeCode,
          gCode: classVom.gradeCode,
          tName: teach.name,
          vName: classVom.volumeName,
          gName: classVom.gradeName,
        }
      }
      let currSubject = {
        periodCode: cSubjectData.periodCode,
        periodName: cSubjectData.periodName,
        subjectCode: cSubjectData.subjectCode,
        subjectName: cSubjectData.subjectName,
      }
      setCookieSubjectVolume(currSubject, volume)
      if (isLogin()) {
        //   设置 学段学科 版本册别 到服务器
        this.setSubjectVolumeServe(currSubject, volume)
      } else {
        window.location.reload()
      }
    },
    async setSubjectVolumeServe(currSubject, volume) {
      if (volume) {
        await this.addChooseConfig(currSubject.subjectCode, {
          grade: volume.gCode,
          volume: volume.vCode,
          version: volume.tCode,
        })
        let parms = {
          periodCode: currSubject.periodCode,
          subjectCode: currSubject.subjectCode,
        }
        let set = {
          authCode: 2,
          showLoading: true,
        }
        this.apiPost(API.UPDATE_DEFAULT_SUBJECT, parms, set).then(res => {
          window.location.reload()
        })
      }
    },
    //  设置 当前 版本册别
    hide() {
      this.visible = false
    },
    executeSubjectData(tree) {
      let list = []
      tree.forEach(item => {
        if (item.children && item.children.length) {
          list.push(
            ...item.children.map(sub => {
              return {
                subjectCode: sub.code + '',
                name: item.name + sub.name,
                periodCode: item.code,
                subjectName: sub.name,
                periodName: item.name,
              }
            }),
          )
        }
      })
      return list
    },
    // 获取学段学科数据
    getSubjectList(v) {
      return this.$store
        .dispatch('getConfigData', { vm: this, type: 2, strParams: {} })
        .then(res => {
          this.subjectList = this.executeSubjectData(res || [])
        })
    },
    changeTeach(v) {
      this.formData.gradeCurrentCode = ''
      this.formData.volumeCurrentCode = ''
      this.getGradeCategoryId()
    },
    changeGradeVolume(v) {},
    getBookCategoryId() {
      let strParams = {
        periodCode: this.formData.currentSubject.periodCode,
        subjectCode: this.formData.currentSubject.subjectCode,
      }
      this.$store
        .dispatch('getConfigData', {
          vm: this,
          type: 4,
          strParams: strParams,
          setKey: 'configVersionList',
        })
        .then(res => {
          let bookArr = res || []
          this.teachData = bookArr
        })
    },
    // 获取年级和册列表
    getGradeCategoryId() {
      let strParams = {
        versionCode: this.formData.teachCurrentCode,
        subjectCode: this.formData.currentSubject.subjectCode,
      }
      var classArrVom = []
      this.$store
        .dispatch('getConfigData', {
          vm: this,
          type: 5,
          strParams: strParams,
          setKey: 'configVolume',
        })
        .then(res => {
          // 判断是否是高中学段
          if (String(this.formData.currentSubject.periodCode) === '13') {
            res.forEach(item => {
              let currItem = {
                gradeCode: item.code,
                gradeName: item.name,
                volumeCode: item.code,
                volumeName: '',
                code: item.code,
                name: item.name,
              }
              classArrVom.push(currItem)
            })
            this.classData = classArrVom
          } else {
            res.forEach(item => {
              if (item.children && item.children.length) {
                item.children.forEach(value => {
                  let currItem = {
                    gradeCode: item.code,
                    gradeName: item.name,
                    volumeCode: value.code,
                    volumeName: value.name,
                    code: value.code,
                    name: item.name + '' + value.name,
                  }
                  classArrVom.push(currItem)
                })
              }
            })
            this.classData = classArrVom
          }
        })
    },
    // 根据学段学科获取版本 获取 版本
    async show(subject) {
      if (!(this.subjectList && this.subjectList.length)) {
        await this.getSubjectList()
      }
      this.formData = {
        currentSubject: null,
        currnetTeach: {},
        currentVolume: {},
        teachCurrentCode: '',
        gradeCurrentCode: '',
        volumeCurrentCode: '',
      }
      if (this.$refs.subjectSyncFormRef) {
        this.$refs.subjectSyncFormRef.resetFields()
      }

      this.visible = true
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/css/variables.scss";
.subject-sync-body {
  padding: 30px 20px 0 20px;
  text-align: center;
  .subject-sync-title {
    font-size: 16px;
    color: #969ca4;
    line-height: 16px;
  }
  .subject-sync-body {
    padding: 30px 120px 10px 120px;
  }
}
.subject-item-select :deep({)
  .el-input {
    width: 300px;
  }
  .el-input__inner {
    padding: 0 30px 0 5px;
    border-radius: 4px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}

.subject-sync-footer {
  padding-bottom: 30px;
  text-align: center;
}
</style>
