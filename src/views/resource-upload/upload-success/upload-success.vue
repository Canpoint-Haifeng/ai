<template>
  <div class="upload-success">
    <div class="icon-box">
      <img
        src="@/assets/images/ok.gif"
        class="icon-success"
      >
    </div>
    <h3 class="upload-title color-3 font-18">
      上传成功！
    </h3>
    <p class="upload-text">
      我们将尽快审核您的文档，审核通过后可获得奖励
    </p>
    <p class="upload-text">
      可在<span
        class="color-theme"
        @click="entryMyUploads"
      >个人中心-我的上传</span>中查看审核进度
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    entryMyUploads() {
      this.$router.push({
        name: 'myUploads'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .upload-success {
    margin: 115px auto 255px;
    text-align: center;
    .icon-box {
      display: inline-block;
      .icon-success {
        width: 100px;
        height: 100px;
      }
    }
    .upload-title {
      margin: 20px auto 40px;
    }
    .upload-text {
      margin-bottom: 15px;
      .color-theme {
        cursor: pointer;
      }
    }
  }
</style>
