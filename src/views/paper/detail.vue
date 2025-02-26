<template>
  <div class="paper-detail">
    <h1>Paper Detail</h1>
    <p>This is the paper detail page for ID: {{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaperDetail',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.paper-detail {
  padding: 20px;
}
</style>
