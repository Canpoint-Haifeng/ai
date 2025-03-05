<template>
  <div class="vip-get-basket-wrapper" v-if="isShow">
    <div
      class="vip-get-login"
      @click="openDialog"
      v-if="!isLogin || currentServiceId === 1"
    >
      <img src="@/assets/images/activity/viplogin5.png" />
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
  import { mapState } from 'vuex'
  import { isLogin } from '@/common/js/util'
  export default {
    data() {
      return {
        currentServiceId: 1,
        isShow: false,
        activeId: '',
        isLogin: isLogin(),
      }
    },
    computed: {
      ...mapState(['currSubject', 'userInfo', 'serviceInfo']),
    },
    watch: {
      serviceInfo: {
        handler(nv, ov) {
          this.currentServiceId = nv.serviceId
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {
      //  v-if="!isLogin||currentServiceId===1"
      if (!isLogin()) {
        this.vipActiveShowByNoToken()
      } else {
        this.vipActiveShow()
      }
    },
    methods: {
      vipActiveShowByNoToken() {
        let url = {
          urlPath:
            process.env.VUE_APP_PAPER_GENERATOR + '/vip/vipActiveShowByNoToken',
        }
        this.apiGet(url).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.isShow = res.data.isShow
            if (this.isShow) {
              this.activeId = res.data.activeId
            }
          }
        })
      },
      vipActiveShow() {
        let url = {
          urlPath: process.env.VUE_APP_PAPER_GENERATOR + '/vip/vipActiveShow',
        }
        this.apiGet(url).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.isShow = res.data.isShow
            if (this.isShow) {
              this.activeId = res.data.activeId
            }
          }
        })
      },
      openActivationVip() {
        CpCommonDialog.openDialog({
          moduleC: 'LoginActivationVipDialog',
          data: {
            activeId: this.activeId,
            activationVipSuccess: () => {
              this.openActivationVip()
            },
          },
        })
      },
      activationVipSuccess() {},
      openDialog() {
        // if (this.isLogin) {
        CpCommonDialog.openDialog({
          moduleC: 'LoginObtainVipDialog',
          data: {
            activeId: this.activeId,
            getVipSuccess: () => {
              if (this.isLogin) {
                this.openActivationVip()
              } else {
                this.$emit('showLogin')
              }
            },
          },
        })
        // } else {
        //   this.$emit('showLogin')
        // }
      },
    },
  }
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
