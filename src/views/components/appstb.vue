<template>
  <div class="appstb-wrapper">
    <div class="header">
      <h1>备课助手</h1>
      <div class="nav-links">
        <router-link to="/paper/index">
          首页
        </router-link>
        <router-link to="/test">
          测试
        </router-link>
      </div>
    </div>
    <div class="content">
      <router-view
        v-#{
        Component
        }"
      >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AppStb',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    const isLoading = ref(false)
    
    const currentPath = computed(() => route.path)
    
    const isHomePage = computed(() => {
      return route.path === '/paper/index'
    })
    
    onMounted(() => {
      console.log('AppStb component mounted')
    })
    
    const navigateTo = (path) => {
      router.push(path)
    }
    
    return {
      isLoading,
      currentPath,
      isHomePage,
      navigateTo
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
@use '@/assets/css/_variables' as vars;

.appstb-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: vars.$color-theme;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex: 1;
  padding: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
  
  a {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    &.router-link-active {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
