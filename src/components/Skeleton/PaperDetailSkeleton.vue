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
      <div class="skeleton-breadcrumb">
        <div class="skeleton-breadcrumb-item" />
        <div class="skeleton-breadcrumb-item" />
      </div>
      <div class="skeleton-paper-info">
        <div class="skeleton-paper-title" />
        <div class="skeleton-paper-meta">
          <div class="skeleton-meta-item" />
          <div class="skeleton-meta-item" />
          <div class="skeleton-meta-item" />
        </div>
      </div>
      <div class="skeleton-tabs">
        <div class="skeleton-tab-item" />
        <div class="skeleton-tab-item" />
        <div class="skeleton-tab-item" />
      </div>
      <div class="skeleton-paper-content">
        <div
          v-for="i in 3"
          :key="i"
          class="skeleton-section"
        >
          <div class="skeleton-section-title" />
          <div
            v-for="j in 2"
            :key="`${i}-${j}`"
            class="skeleton-question"
          >
            <div class="skeleton-question-title" />
            <div class="skeleton-question-content" />
            <div class="skeleton-question-answer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'PaperDetailSkeleton'
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
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-breadcrumb-item {
  width: 80px;
  height: 16px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-right: 20px;
  position: relative;
}

.skeleton-breadcrumb-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: #e0e0e0;
  clip-path: polygon(0% 0%, 75% 50%, 0% 100%);
}

.skeleton-paper-info {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-paper-title {
  height: 30px;
  width: 70%;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-paper-meta {
  display: flex;
  gap: 20px;
}

.skeleton-meta-item {
  width: 100px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.skeleton-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
}

.skeleton-tab-item {
  width: 80px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 4px 4px 0 0;
}

.skeleton-paper-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-section {
  margin-bottom: 30px;
}

.skeleton-section-title {
  height: 24px;
  width: 200px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.skeleton-question {
  margin-bottom: 30px;
  padding-left: 20px;
}

.skeleton-question-title {
  height: 20px;
  width: 60%;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-question-content {
  height: 80px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-question-answer {
  height: 60px;
  background-color: #e0e0e0;
  border-radius: 4px;
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

.skeleton-logo, .skeleton-nav-item, .skeleton-user, .skeleton-breadcrumb-item, 
.skeleton-paper-title, .skeleton-meta-item, .skeleton-tab-item, .skeleton-section-title, 
.skeleton-question-title, .skeleton-question-content, .skeleton-question-answer {
  animation: pulse 1.5s infinite;
}
</style>
