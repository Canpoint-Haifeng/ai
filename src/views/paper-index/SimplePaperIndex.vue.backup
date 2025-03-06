<template>
  <div class="simple-paper-index">
    <h1>Simple Paper Index</h1>
    <p>This is a simplified version of the paper-index component to identify compatibility issues.</p>
    <div class="card-container">
      <div
        v-for="(item, index) in paperItems"
        :key="index"
        class="card"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SimplePaperIndex',
  setup() {
    const paperItems = ref([
      { 
        title: 'Sample Paper 1', 
        description: 'This is a sample paper description for testing purposes.' 
      },
      { 
        title: 'Sample Paper 2', 
        description: 'Another sample paper to test component rendering.' 
      },
      { 
        title: 'Sample Paper 3', 
        description: 'Third sample paper for testing Vue 3 compatibility.' 
      }
    ])
    
    return {
      paperItems
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.simple-paper-index {
  padding: 20px;
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    
    .card {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      width: 300px;
      
      h3 {
        margin-top: 0;
        color: #487fff;
      }
    }
  }
}
</style>
