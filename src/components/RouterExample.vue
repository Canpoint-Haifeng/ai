<template>
  <div class="router-example">
    <h2>Router Example Component</h2>
    <p>Current route: {{ route.name }}</p>
    
    <div class="navigation-examples">
      <h3>Navigation Examples</h3>
      <div class="button-group">
        <button @click="navigateToHome">
          Go to Home
        </button>
        <button @click="navigateToPaperDetail">
          Go to Paper Detail
        </button>
        <button @click="navigateToSmartPaper">
          Go to Smart Paper
        </button>
      </div>
    </div>
    
    <div class="route-info">
      <h3>Route Information</h3>
      <pre>{{ routeInfo }}</pre>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRouter, useRoute } from '@/router/useRouter'
import { ROUTE_NAMES } from '@/router/constants'

export default defineComponent({
  name: 'RouterExample',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // Computed property to display route information
    const routeInfo = computed(() => {
      return {
        name: route.name,
        path: route.path,
        params: route.params,
        query: route.query,
        meta: route.meta
      }
    })
    
    // Navigation methods using the enhanced router
    const navigateToHome = () => {
      router.navigateTo(ROUTE_NAMES.PAPER_INDEX)
    }
    
    const navigateToPaperDetail = () => {
      router.navigateTo(ROUTE_NAMES.PAPER_DETAIL, {}, { id: '12345' })
    }
    
    const navigateToSmartPaper = () => {
      router.navigateTo(ROUTE_NAMES.PREPARE)
    }
    
    return {
      route,
      routeInfo,
      navigateToHome,
      navigateToPaperDetail,
      navigateToSmartPaper,
      ROUTE_NAMES
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.router-example {
  padding: 20px;
  
  .navigation-examples {
    margin-top: 20px;
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      
      button {
        padding: 8px 16px;
        background-color: #487fff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          background-color: #3a6ae6;
        }
      }
    }
  }
  
  .route-info {
    margin-top: 20px;
    
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
    }
  }
}
</style>
