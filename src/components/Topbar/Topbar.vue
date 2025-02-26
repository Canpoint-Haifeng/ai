<template>
  <div class="topbar">
    <div class="logo">Logo</div>
    <div class="menu">
      <slot name="menu"></slot>
    </div>
    <div class="user-info">
      <slot name="user-info"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Topbar'
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.menu {
  flex: 1;
  margin: 0 20px;
}
.user-info {
  display: flex;
  align-items: center;
}
</style>
