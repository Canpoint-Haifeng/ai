<template>
  <div class="index-wrapper">
    <h2>试卷首页</h2>
    <p>欢迎使用备课助手系统</p>
    
    <div class="paper-sections">
      <div class="section">
        <h3>热门试卷</h3>
        <p>这里将显示热门试卷。</p>
      </div>
      <div class="section">
        <h3>最新试卷</h3>
        <p>这里将显示最新试卷。</p>
      </div>
      <div class="section">
        <h3>同步教学</h3>
        <p>这里将显示同步教学材料。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PaperIndex',
  setup() {
    console.log('PaperIndex component mounted')
    return {}
  }
})
</script>

<style lang="scss" scoped>
.index-wrapper {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.paper-sections {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.section {
  width: 30%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
