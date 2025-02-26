<template>
  <div class="nav">
    <ul class="nav-list">
      <li v-for="(item, index) in navItems" :key="index" class="nav-item">
        <router-link :to="item.path" class="nav-link">{{ item.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    navItems: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.nav {
  background-color: #f5f5f5;
  padding: 10px 0;
}
.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-item {
  margin-right: 20px;
}
.nav-link {
  color: #333;
  text-decoration: none;
}
.nav-link:hover {
  color: #487FFF;
}
</style>
