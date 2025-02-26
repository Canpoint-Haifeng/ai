<template>
  <div class="skeleton-container">
    <div class="skeleton-header">
      <div class="skeleton-logo"></div>
      <div class="skeleton-nav">
        <div class="skeleton-nav-item"></div>
        <div class="skeleton-nav-item"></div>
        <div class="skeleton-nav-item"></div>
      </div>
      <div class="skeleton-user"></div>
    </div>
    <div class="skeleton-content">
      <div class="skeleton-sidebar">
        <div class="skeleton-sidebar-item" v-for="i in 5" :key="i"></div>
      </div>
      <div class="skeleton-main">
        <div class="skeleton-toolbar">
          <div class="skeleton-tool" v-for="i in 4" :key="i"></div>
        </div>
        <div class="skeleton-paper">
          <div class="skeleton-paper-header"></div>
          <div class="skeleton-question" v-for="i in 3" :key="i">
            <div class="skeleton-question-title"></div>
            <div class="skeleton-question-content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaperMakerSkeleton'
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
  display: flex;
  height: calc(100vh - 60px);
}

.skeleton-sidebar {
  width: 200px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-sidebar-item {
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.skeleton-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.skeleton-tool {
  width: 80px;
  height: 36px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.skeleton-paper {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-paper-header {
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.skeleton-question {
  margin-bottom: 30px;
}

.skeleton-question-title {
  height: 24px;
  width: 80%;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-question-content {
  height: 100px;
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

.skeleton-logo, .skeleton-nav-item, .skeleton-user, .skeleton-sidebar-item, 
.skeleton-tool, .skeleton-paper-header, .skeleton-question-title, .skeleton-question-content {
  animation: pulse 1.5s infinite;
}
</style>
