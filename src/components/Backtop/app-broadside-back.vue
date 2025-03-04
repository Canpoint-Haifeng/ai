<template>
  <div>
    <!-- Temporarily commenting out problematic components -->
    <app-login ref="appLogin"></app-login>
  </div>
</template>

<script>
  // Temporarily commenting out problematic imports
  import { mapState } from 'vuex'
  export default {
    components: {
    },
    computed: {
      ...mapState(['fullpath']),
      isHome() {
        if (this.fullpath == 'paperIndex') {
          return true
        } else {
          return false
        }
      },
    },
    methods: {
      showLogin() {
        this.$refs.appLogin.showLogin()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .three-broad-side {
    position: fixed;
    right: 0px;
    z-index: 99;
    top: calc(40% + 130px);
    width: 40px;
    .three-broad-side-body {
      box-shadow: 0px 2px 6px 0px rgba(42, 77, 138, 0.27);
    }
  }
  .broad-side-backtop {
    padding-top: 14px;
  }
</style>
