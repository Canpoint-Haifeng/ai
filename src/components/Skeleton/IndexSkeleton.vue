<template>
  <div class="skeleton-container">
    <div class="skeleton-header">
      <div class="skeleton-logo" />
      <div class="skeleton-nav">
        <div class="skeleton-nav-item" />
        <div class="skeleton-nav-item" />
        <div class="skeleton-nav-item" />
      </div>
      <div class="skeleton-user" />
    </div>
    <div class="skeleton-content">
      <div class="skeleton-banner" />
      <div class="skeleton-cards">
        <div
          v-for="i in 6"
          :key="i"
          class="skeleton-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'IndexSkeleton'
}
</script>

<style scoped>
.skeleton-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-logo {
  width: 120px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.skeleton-nav {
  display: flex;
  gap: 20px;
}

.skeleton-nav-item {
  width: 60px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.skeleton-user {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-banner {
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-card {
  height: 180px;
  background-color: #e0e0e0;
  border-radius: 8px;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

.skeleton-logo, .skeleton-nav-item, .skeleton-user, .skeleton-banner, .skeleton-card {
  animation: pulse 1.5s infinite;
}
</style>
