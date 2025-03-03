<template>
  <div class="test-component">
    <h1>Test Component</h1>
    <p>This is a simple test component to verify Vue 3 setup.</p>
    <button @click="incrementCount">
      Count: {{ count }}
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TestComponent',
  setup() {
    const count = ref(0)
    
    const incrementCount = () => {
      count.value++
    }
    
    return {
      count,
      incrementCount
    }
  }
})
</script>

<style scoped>
.test-component {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 20px;
  background-color: #f9f9f9;
}

h1 {
  color: #333;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
