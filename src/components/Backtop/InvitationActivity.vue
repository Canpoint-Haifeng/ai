<template>
  <div class="app-invite-bear">
    <InviteBear v-if="isLogin" />
    <NewGift
      v-else
      @open-register="openRegister"
    />
    <app-login ref="appLogin" />
  </div>
</template>

<script>
  import InviteBear from '@/components/CpFan/css-animista/InviteBear.vue'
  import NewGift from '@/components/CpFan/css-animista/NewGift.vue'
  import { isLogin } from '@/common/js/util'
  import { defineComponent, ref, getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'InvitationActivity',
    components: { InviteBear, NewGift },
    setup() {
      const instance = getCurrentInstance()
      const router = useRouter()
      const isLoginState = ref(isLogin())
      
      const openRegister = () => {
        instance.proxy.$cpRegister({
          haslogin: 2,
          registerRewards: [],
          visible: true,
          onGoAgreement: () => {
            router.push({ name: 'agreement' })
          },
        })
      }
      
      return {
        isLogin: isLoginState,
        openRegister
      }
    }
  })
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .app-invite-bear {
    position: fixed;
    right: 100px;
    bottom: 352px;
    width: 100px;
    height: 40px;
  }
</style>

