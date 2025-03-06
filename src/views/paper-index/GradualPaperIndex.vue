<template>
  <div class="gradual-paper-index">
    <h1>Gradual Paper Index</h1>
    <p>This is a step-by-step approach to identify compatibility issues with the main paper-index component.</p>
    
    <!-- Step 1: Basic Vue 3 component structure -->
    <div class="section">
      <h2>Step 1: Basic Component</h2>
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
    
    <!-- Step 2: Add Vuex store integration -->
    <div
      v-if="showStoreSection"
      class="section"
    >
      <h2>Step 2: Vuex Store Integration</h2>
      <p>User is logged in: {{ isUserLoggedIn }}</p>
      <button @click="toggleLogin">
        Toggle Login Status
      </button>
    </div>
    
    <!-- Step 3: Add a simple child component -->
    <div
      v-if="showComponentSection"
      class="section"
    >
      <h2>Step 3: Child Component Integration</h2>
      <app-login-stub v-if="showLoginComponent" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

// Simple stub component to test component integration
const AppLoginStub = {
  name: 'AppLoginStub',
  template: `
    <div class="app-login-stub">
      <h3>App Login Stub</h3>
      <p>This is a simplified version of the AppLogin component.</p>
      <button>Login</button>
    </div>
  `
}

export default defineComponent({
  name: 'GradualPaperIndex',
  components: {
    AppLoginStub
  },
  setup() {
    const store = useStore()
    
    // Basic data
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
    
    // Feature flags to gradually enable complexity
    const showStoreSection = ref(true)
    const showComponentSection = ref(true)
    const showLoginComponent = ref(true)
    
    // Store integration
    const isUserLoggedIn = computed(() => {
      return store.state.isLogin || false
    })
    
    const toggleLogin = () => {
      store.commit('SET_LOGIN', !isUserLoggedIn.value)
    }
    
    return {
      paperItems,
      showStoreSection,
      showComponentSection,
      showLoginComponent,
      isUserLoggedIn,
      toggleLogin
    }
  }
})
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.gradual-paper-index {
  padding: 20px;
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    
    h2 {
      margin-top: 0;
      color: #487fff;
    }
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
  
  button {
    background-color: #487fff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    
    &:hover {
      background-color: #3a6ae6;
    }
  }
  
  .app-login-stub {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 4px;
    
    h3 {
      margin-top: 0;
      color: #487fff;
    }
    
    button {
      margin-top: 10px;
    }
  }
}
</style>

