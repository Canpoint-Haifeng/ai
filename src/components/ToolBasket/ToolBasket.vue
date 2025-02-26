<template>
  <div class="tool-basket">
    <div class="tool-basket-header">
      <h3>工具篮</h3>
    </div>
    <div class="tool-basket-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolBasket'
}
</script>

<style scoped>
.tool-basket {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
}
.tool-basket-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.tool-basket-header h3 {
  margin: 0;
  font-size: 16px;
}
</style>
