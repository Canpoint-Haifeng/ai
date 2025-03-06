<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© {{ currentYear }} 备课助手 All Rights Reserved</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
@import "@/assets/css/mixins.scss";

.footer {
  width: 100%;
  padding: 20px 0;
  background: $color-background-d;
  
  .footer-content {
    text-align: center;
    color: $color-text-d;
    font-size: $font-size-small;
  }
}
</style>
