<template>
  <!--  -->
  <div
    v-if="!testView"
    v-renderjax
    :class="{ addClass: isCollectPage }"
    class="appstb-wrapper plaza-bg"
  >
    <!-- 所有征集页面需要修改背景色  -->
    <app-top-bar :is-home="true" />
    <QuestionCollectNav
      v-if="pathArr.indexOf(fullpath) >= 0"
    />
    <plaza-nav v-else />

    <keep-alive include="BreakdownGroupPaper">
      <router-view v-if="loadView" />
      <div
        v-else
        class="blank-page"
      />
    </keep-alive>
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
import { API } from '@/api/config'
import { mapState, mapActions } from 'vuex'
import {
  isLogin,
  setCookieSubjectVolume,
  getCookieSubjectVolume,
} from '@/common/js/util'
import PlazaNav from '@/components/Nav/PlazaNav.vue'
import QuestionCollectNav from '@/components/Nav/QuestionCollectNav.vue'
export default {
  components: { PlazaNav, QuestionCollectNav },
  // 监听路由进入时
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.currentPath = to.fullPath
      console.log(to, '即将要进入的路由')
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
    isCollectPage() {
      let path = this.$route.path
      if (this.collectPathList.indexOf(path) >= 0) {
        return true
      } else {
        return false
      }
    },
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
      // loadView: false,
      loadView: true,
      testView: false, // 临时测试组件
      currentPath: '',
      pathArr: [
        'goodPaperCollect',
        'collectPage',
        'uploadCenter',
        'contributionRanking',
        'assetsStatistics',
      ],
      collectPathList: [
        '/paper/plaza/goodPaperCollect/uploadCenter',
        '/paper/plaza/goodPaperCollect/assetsStatistics',
      ],
    }
  },
  created() {
    //判断当前是不是开发环境
    this.getDefaultSubject()
    let path = this.$route.path
    if (this.collectPathList.indexOf(path) >= 0) {
      return true
    } else {
      return false
    }
  },
  methods: {
    ...mapActions(['updateCurrentSubject']),
    // 获取默认学科
    getDefaultSubject() {
      let currSubjectStorage = getCookieSubjectVolume()
      if (currSubjectStorage) {
        // 本地存有当前学科
        if (!isLogin()) {
          // 未登录本地有默认学科
          // setStore('appLogin', 'show')
          this.updateCurrentSubject(currSubjectStorage) // 将服务端同步到本地
          // window.location.href = publicUrl.eduCloudUrl.paperUrl // 跳转到首页登录
        } else {
          // 已登录本地有默认学科
          this.updateCurrentSubject(currSubjectStorage)
        }
      } else {
        // 本地无默认学科
        this.getServerSubject()
      }
    },
    // 获取服务端默认学科
    getServerSubject() {
      this.apiGet(API.GET_DEFAULT_SUBJECT).then(res => {
        if (this.checkoutRes(res)) {
          let currSubject = {
            periodCode: res.data.periodCode,
            periodName: res.data.periodName,
            subjectCode: res.data.subjectCode,
            subjectName: res.data.subjectName,
          }
          setCookieSubjectVolume(currSubject, '')
          this.updateCurrentSubject(currSubject) // 将服务端同步到本地
        }
      })
    },
    initUserInfoData() {
      this.$store.dispatch('manageAllVip', { vm: this })
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.blank-page {
  height: 700px;
}
.plaza-bg {
  background-color: #f4fafc;
}
.addClass {
  background: #fffbf8;
}
</style>
