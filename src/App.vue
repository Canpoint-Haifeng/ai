<template>
  <div id="app">
    <h1>Vue 3 + Vite Migration Test</h1>
    <p>If you see this, the app is working!</p>
    <button @click="count++">Count: {{ count }}</button>
    <p>Testing Vue 3 reactivity</p>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const count = ref(0)
    
    return {
      count
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
