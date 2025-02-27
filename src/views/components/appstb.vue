<template>
  <div
    v-if="!testView"
    v-renderjax
    class="appstb-wrapper"
  >
    <!-- <app-top-bar :isHome="isHome"></app-top-bar> -->
    <!-- <HomePageSearch v-if="isHome"></HomePageSearch>
    <app-top-search v-else></app-top-search> -->
    <!-- <HomePageSearch v-if="isHome"></HomePageSearch> -->
    <app-top-search />
    <app-nav :distance-top="isHome ? 140 : 0" />
    <keep-alive include="BreakdownGroupPaper,chapter,knowledge,special">
      <router-view v-if="loadView" />
      <div
        v-else
        class="blank-page"
      />
    </keep-alive>
    <!-- <div v-if="loadView">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <div class="blank-page" v-else></div> -->

    <app-footer />
    <!-- <app-backtop></app-backtop> -->
    <app-broadside-back />
  </div>
  <div
    v-else
    class="app-wrapper"
  >
    <router-view />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import { mapState } from 'vuex'
  export default {
    // 监听路由进入时
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.currentPath = to.fullPath
        // console.log(to)
        if (to.path.indexOf('test') > -1) {
          vm.testView = true
        }
      })
    },
    watch: {
      currSubject(newValue, oldValue) {
        if ('periodCode' in newValue) {
          this.loadView = true
        }
      },
      userInfo() {
        if (this.userInfo.userGuid) {
          this.initUserInfoData()
        }
      },
    },
    computed: {
      ...mapState(['currSubject', 'fullpath', 'userInfo']),
      isHome() {
        if (this.fullpath == 'paperIndex') {
          return true
        } else {
          return false
        }
      },
    },
    data() {
      return {
        loadView: true,
        testView: false, // 临时测试组件
      }
    },
    created() {
      document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0]
        if (e && (e.keyCode == 123 || e.keyCode == 17 || e.keyCode == 18)) {
          e.returnValue = false
          return false
        }
      }
      document.oncontextmenu = function (e) {
        e.preventDefault()
      }
  },
    methods: {
      initUserInfoData() {
        // this.$store.dispatch('manageAllVip', { vm: this })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .blank-page {
    height: 700px;
  }
</style>
