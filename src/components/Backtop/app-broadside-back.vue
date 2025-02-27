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
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import QQFeedback from './QQFeedback.vue'
import CompanyWeiXin from './CompanyWeiXin.vue'
import CompanyWeiXin2 from './CompanyWeiXin2.vue'
import InvitationActivity from './InvitationActivity.vue'
import CpRankingList from './CpRankingList.vue'
import BackTopComponents from './components/BackTopComponents.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBroadsideBack',
  components: {
    QQFeedback,
    CompanyWeiXin,
    CompanyWeiXin2,
    InvitationActivity,
    CpRankingList,
    BackTopComponents,
  },
  setup() {
    const store = useStore()
    const appLogin = ref(null)
    
    // Get state from store
    const fullpath = computed(() => store.state.fullpath)
    
    // Computed property
    const isHome = computed(() => fullpath.value === 'paperIndex')
    
    // Methods
    const showLogin = () => {
      appLogin.value.showLogin()
    }
    
    return {
      appLogin,
      isHome,
      showLogin
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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
