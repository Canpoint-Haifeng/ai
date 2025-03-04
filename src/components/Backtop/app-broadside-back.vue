<template>
  <div>
    <!-- <div class="three-broad-side">
      <div class="three-broad-side-body">
        <QQFeedback @showLogin="showLogin"></QQFeedback>
        <CompanyWeiXin></CompanyWeiXin>
        <CompanyWeiXin2></CompanyWeiXin2>
      </div>
      <div class="broad-side-backtop">
        <BackTopComponents></BackTopComponents>
      </div>
    </div> -->

    <!-- <InvitationActivity></InvitationActivity> -->
    <!-- <CpRankingList v-if="isHome" @showLogin="showLogin"></CpRankingList> -->
    <app-login ref="appLogin"></app-login>
  </div>
</template>

<script>
  import QQFeedback from './QQFeedback'
  import CompanyWeiXin from './CompanyWeiXin'
  import CompanyWeiXin2 from './CompanyWeiXin2'
  import InvitationActivity from './InvitationActivity'
  import CpRankingList from './CpRankingList'
  import BackTopComponents from './components/BackTopComponents'
  import { mapState } from 'vuex'
  export default {
    components: {
      QQFeedback,
      CompanyWeiXin,
      CompanyWeiXin2,
      InvitationActivity,
      CpRankingList,
      BackTopComponents,
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
