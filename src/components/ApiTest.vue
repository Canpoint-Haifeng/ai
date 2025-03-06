<template>
  <div class="api-test">
    <h2>API Test Component</h2>
    <div v-if="loading">
      Loading...
    </div>
    <div v-if="error">
      Error: {{ error.message }}
    </div>
    <div v-if="data">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
    <button @click="testGet">
      Test GET
    </button>
    <button @click="testPost">
      Test POST
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useApi } from '@/api/useApi'
import { API } from '@/api/config'

export default defineComponent({
  name: 'ApiTest',
  setup() {
    const { get, post, loading, error } = useApi()
    const data = ref(null)

    const testGet = async () => {
      data.value = await get(API.PAPER_BUILDER_GET_YEARS)
    }

    const testPost = async () => {
      data.value = await post(API.LESSON_APP_COPY_LESSON, { id: 1 })
    }

    return {
      loading,
      error,
      data,
      testGet,
      testPost
    }
  }
})
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.api-test {
  padding: 20px;
  
  button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #45a049;
    }
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
    max-height: 400px;
  }
}
</style>

