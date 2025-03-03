<template>
  <div id="app">
    <h1>备课助手 - Vue 3 迁移测试</h1>
    <p>这是一个最小的 Vue 3 + Vite 示例，用于验证核心功能</p>
    <button @click="increment">计数器: {{ count }}</button>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      increment
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
  margin-top: 60px;
}
</style>
