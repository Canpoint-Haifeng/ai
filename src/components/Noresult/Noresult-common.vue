<template>
  <div class="no-result-container">
    <div class="no-result-content">
      <img src="@/assets/images/no-result.png" alt="No Result" class="no-result-image" />
      <p class="no-result-text">{{ message || '暂无数据' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoresultCommon',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.no-result-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
}
.no-result-content {
  text-align: center;
}
.no-result-image {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}
.no-result-text {
  color: #909399;
  font-size: 14px;
}
</style>
