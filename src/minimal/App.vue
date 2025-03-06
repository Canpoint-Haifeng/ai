<template>
  <div id="app">
    <h1>Vue 3 Migration Test</h1>
    <test-component />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import TestComponent from './TestComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    TestComponent
  }
})
</script>
<style lang="scss">
@import "@/assets/css/variables.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

