<template>
  <div class="layout">
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  
  .layout-content {
    width: 100%;
    min-height: 100vh;
  }
}
</style>
