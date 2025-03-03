<template>
  <div
    v-if="isShow"
    class="vip-get-basket-wrapper"
  >
    <div
      v-if="!isLogin || currentServiceId === 1"
      class="vip-get-login"
      @click="openDialog"
    >
      <img src="@/assets/images/activity/viplogin5.png">
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
  import { isLogin } from '@/common/js/util'
  import { defineComponent, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
  import { useStore } from 'vuex'
  
  export default defineComponent({
    name: 'CpVipLoginActivity',
    emits: ['showLogin'],
    setup(props, { emit }) {
      const instance = getCurrentInstance()
      const store = useStore()
      
      // Reactive state
      const currentServiceId = ref(1)
      const isShow = ref(false)
      const activeId = ref('')
      const isLoginState = ref(isLogin())
      
      // Computed properties from store
      const currSubject = computed(() => store.state.currSubject)
      const userInfo = computed(() => store.state.userInfo)
      const serviceInfo = computed(() => store.state.serviceInfo)
      
      // Watch for changes
      watch(serviceInfo, (nv) => {
        currentServiceId.value = nv.serviceId
      }, { immediate: true, deep: true })
      
      // Methods
      const vipActiveShowByNoToken = () => {
        let url = {
          urlPath: import.meta.env.VITE_APP_PAPER_GENERATOR + '/vip/vipActiveShowByNoToken',
        }
        instance.proxy.apiGet(url).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            isShow.value = res.data.isShow
            if (isShow.value) {
              activeId.value = res.data.activeId
            }
          }
        })
      }
      
      const vipActiveShow = () => {
        let url = {
          urlPath: import.meta.env.VITE_APP_PAPER_GENERATOR + '/vip/vipActiveShow',
        }
        instance.proxy.apiGet(url).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            isShow.value = res.data.isShow
            if (isShow.value) {
              activeId.value = res.data.activeId
            }
          }
        })
      }
      
      const openActivationVip = () => {
        CpCommonDialog.openDialog({
          moduleC: 'LoginActivationVipDialog',
          data: {
            activeId: activeId.value,
            activationVipSuccess: () => {
              openActivationVip()
            },
          },
        })
      }
      
      const activationVipSuccess = () => {}
      
      const openDialog = () => {
        CpCommonDialog.openDialog({
          moduleC: 'LoginObtainVipDialog',
          data: {
            activeId: activeId.value,
            getVipSuccess: () => {
              if (isLoginState.value) {
                openActivationVip()
              } else {
                emit('showLogin')
              }
            },
          },
        })
      }
      
      // Lifecycle hooks
      onMounted(() => {
        if (!isLogin()) {
          vipActiveShowByNoToken()
        } else {
          vipActiveShow()
        }
      })
      
      return {
        currentServiceId,
        isShow,
        activeId,
        isLogin: isLoginState,
        openDialog,
        openActivationVip,
        activationVipSuccess,
        vipActiveShow,
        vipActiveShowByNoToken
      }
    }
  })
</script>

<style lang="scss" scoped>
  .vip-get-basket-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1006;
    width: 0;
  }
  .vip-get-login {
    position: absolute;
    top: 50%;
    left: -40px;
    margin-top: -60px;
    width: 40px;
    height: 120px;
    cursor: pointer;
    img {
      width: 40px;
      height: 120px;
    }
    background: radial-gradient(circle, #ffe0bc, #ffd5a5);
    box-shadow: -3px 3px 6px 0px rgba(42, 77, 138, 0.2);
    border-radius: 4px 0px 0px 4px;
  }
</style>
