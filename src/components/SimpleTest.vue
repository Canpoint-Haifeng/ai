<template>
  <div class="simple-test">
    <h2>Simple Vue 3 Test</h2>
    <p>Counter: {{ count }}</p>
    <button @click="increment">
      Increment
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SimpleTest',
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
.simple-test {
  padding: 20px;
  border: 1px solid #eee;
  margin: 20px;
}
</style>
