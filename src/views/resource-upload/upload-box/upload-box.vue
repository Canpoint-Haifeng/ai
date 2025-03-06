<template>
  <div class="resource-upload">
    <el-upload
      class="upload-box"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      accept=".doc,.docx,.pdf"
      drag
      :action="action"
      :limit="10"
      multiple
    >
      <i class="upload-icon" />
      <p class="upload-text">
        拖拽文档到此，也可上传
      </p>
      <p class="upload-text">
        按住Ctrl可以选中多份上传 <span class="tip">（每次最多10份）</span>
      </p>
      <el-button class="btn btn-shadow upload-btn">
        点击上传
      </el-button>
      <div class="upload-tip color-9 font-12">
        支持格式：
        <i class="iconfont iconword" />
        <i class="iconfont iconpdf" />
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docList: [],
      maxDocList: 10,
      action: 'upload'
    }
  },
  methods: {
    // 上传文档之前对文档类型校验
    beforeUpload(doc) {
      console.log(doc)
      // const isDocType = (doc.type === 'application/pdf') || (doc.type === 'application/msword')
      const isDocMaxSize = doc.size / 1024 / 1024 < 10
      // if (!isDocType) {
      //   this.$message.error('上传文档格式只能是doc或者pdf!')
      //   return false
      // }
      if (!isDocMaxSize) {
        this.$message.error('上传文档大小不能超过 10MB!')
        return false
      }
      const lastIndex = doc.name.lastIndexOf('.')
      this.docList.push({
        title: doc.name.substr(0, lastIndex),
        doc: doc,
        ext: doc.name.substr(lastIndex)
      })
      this.$emit('beforeUpload', this.docList)
      // 屏蔽了action的默认上传
      return false
    },
    // 上传文档超出限制条件时提示
    handleExceed(doc, docList) {
      this.$message.warning(`每次最多上传 ${this.maxDocList} 个文档，本次选择了 ${doc.length} 个文档，共选择了 ${doc.length + this.docList.length} 个文档`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  :deep(.upload-box) {
    width: 100%;
    height: 430px;
    margin-top: 70px;
    .el-upload-dragger {
      width: 798px;
      height: 430px;
      border: 1px dashed $color-border;
      border-radius: 0;
    }
    .upload-icon {
      display: inline-block;
      width: 125px;
      height: 125px;
      background: url(../../../assets/images/resource/document-icon.png) no-repeat;
      margin: 58px auto 14px;
    }
    .upload-text {
      margin-bottom: 15px;
      color: $color-text;
      .tip {
        color: $color-theme-ll;
      }
    }
    .upload-btn {
      width: 160px;
      height: 40px;
      border-radius: 20px;
      margin: 35px auto 60px;
    }
    .upload-tip {
      .iconfont {
        vertical-align: middle;
        margin: 0 5px;
        color: $color-border;
        font-size: $font-size-large;
        &.iconword {
          font-size: $font-size-large-x;
        }
      }
    }
  }
</style>

