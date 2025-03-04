<template>
  <div class="report-wrapper">
    <el-dialog
      :visible="reportDialog.visible"
      @update:visible="reportDialog.visible = $event"
      v-dialogDrag
      :title="reportDialog.title"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :width="reportDialog.width"
      :destroy-on-close="true"
      @close="resetForm('form')"
    >
      <div class="report-content">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          label-width="125px"
          label-position="top"
        >
          <el-form-item
            label="错误类型："
            prop="errorType"
          >
            <el-checkbox-group
              v-model="formData.errorType"
              class="report-dialog-group"
            >
              <el-checkbox
                v-for="item in errorTypes"
                :key="item.code"
                :label="item.code"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="错误描述："
            prop="errorDesc"
          >
            <el-input
              v-model="formData.errorDesc"
              type="textarea"
              class="form-textarea"
              placeholder="请输入错误（限200字）"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item
            v-if="0"
            label=""
          >
            <div class="error-info">
              <!-- 注：您的纠错审核通过后会获得一定的<span class="r">全品币</span>奖励！ --><span
                class="my-error"
                @click="skinMyError"
              >我的纠错</span>
            </div>
          </el-form-item>
        </el-form>
        <div class="upload">
          <!-- <el-upload class="el_upload" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
            :on-remove="handleRemove" :on-success="handleSuccess" @paste="handlePaste"> -->
          <div
            v-for="(list, i) in fileImg"
            :key="i"
            class="img"
          >
            <img
              :src="list.url"
              alt=""
            >
            <i
              class="iconfont icon-jujue"
              @click="deleteImg(i)"
            />
          </div>
          <div class="paste-box">
            <input
              class="hide-input"
              type="text"
              @paste="handlePaste"
            >
            <div class="show-icon u-fx-ac-jc u-fx-ver">
              <i class="iconfont icon-fuzhi" />
              <span>粘贴图片上传</span>
            </div>
          </div>
          <!-- </el-upload> -->
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="reportDialog.visible = false"
          >
            取消
          </el-button>
          <el-button
            class="btn btn-shadow"
            @click="reportError('form')"
          >
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
   
    changeTypeVal: {
      default: 1,
    },
   
  },
  data() {
    return {
      kowledgeItem: {},
      errorTypes: [],
      reportDialog: {
        visible: false,
        title: '报错',
        showClose: true,
        width: '610px',
      },
      formData: {
        errorType: [],
        errorDesc: '',
      },
      formRules: {
        errorType: [
          {
            type: 'array',
            required: true,
            message: '请选择错误类型',
            trigger: 'change',
          },
        ],
        errorDesc: {
          required: true,
          message: '请输入错误描述',
          trigger: 'blur',
        },
      },
      fileImg: [],
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    reportDialog: {
      handler(nv, ov) {
        if (nv.visible === false) {
          this.fileImg = []
        }
      },
      deep: true,
    },
  },
  created() {
    // this.getErrorType()
  },
  methods: {
    handleRemove(file) {
      console.log(file)
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },
    async handlePaste(event) {
      const items = event.clipboardData ? event.clipboardData.items : []
      console.log(items)

      let file = null
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
      if (file) {
        const formData = new FormData()
        formData.append('upload', file)
        const res = await this.newPost(
          { urlPath: '/lesson-app/upload/file' },
          formData,
        )
        // 这里可以调用上传函数上传图片
        // imageUrl.value = URL.createObjectURL(file);
        this.fileImg.push({
          raw: file,
          // url: URL.createObjectURL(file),
          url: res.data,
        })
      } else {
        this.$message.error('粘贴内容非图片')
      }
    },
    deleteImg(index) {
      this.fileImg.splice(index, 1)
    },
    skinMyError() {
      this.$router.push({ path: '/paper/users/myError', query: { tabId: 2 } })
    },
    // 获取试题错误类型
    getErrorType() {
      this.reportDialog.visible = true
      this.errorTypes = [
        { code: 1, name: '内容错误' },
        { code: 2, name: '格式错误' },
        { code: 3, name: '编辑错误' },
        { code: 4, name: '图片错误' },
        { code: 5, name: '表格错误' },
      ]
    },
    // 显示纠错框
    showDialog(kowledgeItem) {
      this.kowledgeItem = kowledgeItem
      this.getErrorType()
    },
    // 隐藏纠错框
    hideDialog() {
      this.reportDialog.visible = false
    },
    // 重置表单字段
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    // 派发纠错提交事件
    reportError(form) {
      // this.reportDialog.visible = false
      this.$refs[form].validate(valid => {
        if (valid) {
          let img = this.fileImg.length
            ? this.fileImg.map(item => item.url)
            : []
          const formData = { ...this.formData, img: img }
          const kowledgeItem = this.kowledgeItem
          let type;
          if(this.changeTypeVal =="8"){ // 知识梳理
            type = 1 ;

          }else{
            type = 2 ;
          }
          let parms = {
            type,
            materialId:kowledgeItem.id,
            errorType:formData.errorType ,
            errorDesc: formData.errorDesc,
            errorImgDesc: formData.img || [],
          }
          let set = {
            authCode: 1,
            loading: true,
          }
          this.newPost(
            { urlPath: '/lesson-app/material/materialError' },
            parms,
            set,
          ).then(res => {
            if (res.code === 200) {
              this.hideDialog()
              this.$message.success('已提交！')
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.report-content :deep() {
  padding: 40px 15px 0 10px;

  .el-form-item {
    margin-bottom: 5px;

    .el-form-item__content {
      margin-bottom: 10px;
    }
  }

  .el-checkbox__label {
    padding-left: 6px;
  }

  .form-textarea {
    margin-top: 5px;
    width: 100%;

    .el-textarea__inner {
      width: 100%;
      height: 90px;
      border: 1px solid $color-border;
      border-radius: 0;
      color: $color-text-d;
      resize: none;
    }
  }

  .upload {
    display: flex;

    .img {
      width: 75px;
      height: 75px;
      margin-right: 5px;
      position: relative;

      img {
        width: 75px;
        height: 75px;
      }

      .icon-jujue {
        position: absolute;
        right: -8px;
        top: -8px;
        color: rgb(216, 0, 27);
      }
    }
  }

  .paste-box {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    // overflow: hidden;
    width: 75px;
    height: 75px;
    color: rgb(170, 170, 170);
    border: 1px solid rgb(215, 215, 215);

    .show-icon {
      height: 75px;
      width: 75px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon-fuzhi {
        font-size: 25px;
        margin-bottom: 5px;
      }

      span {
        font-size: 12px;
      }
    }

    .hide-input {
      position: absolute;
      z-index: 1;
      background: transparent;
      height: 75px;
      width: 100%;
      border: none;
      color: transparent;
      cursor: default;
    }
  }
}

.error-info {
  font-size: 12px;
  color: #999999;
  width: 100%;
  text-align: right;

  .r {
    color: #f4986a;
  }

  .my-error {
    color: $color-theme;
    margin-left: 125px;
    margin-right: 10px;
    cursor: pointer;
  }
}

.report-dialog-group {
  height: 32px;
}
</style>
