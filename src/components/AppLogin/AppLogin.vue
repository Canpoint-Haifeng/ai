<template>
  <span />
</template>

<script>
import { getCurrentInstance, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Login from '../Login/CbLogin.js'
import Register from '../Register/Register.vue'

export default defineComponent({
  name: 'AppLogin',
  components: {
    Login,
    Register,
  },
})
  setup() {
    const instance = getCurrentInstance()
    const router = useRouter()
    
    // 显示登录弹框
    const showLogin = () => {
      instance.proxy.$cpLogin({
        visible: true,
        onGoRegister: () => {
          onGoregister()
        },
      }
    }
    
    // 显示注册弹框
    const showRegister = () => {
      instance.proxy.$cpRegister({
        visible: true,
        onGoAgreement: () => {
          router.push({ name: 'agreement' })
        },
        onGoLogin: () => {
          onGologin()
        },
      }
    }
    
    // 去登录
    const onGologin = () => {
      instance.proxy.$cpRegister({ visible: false })
      setTimeout(() => {
        showLogin()
      }, 500)
    }
    
    // 去注册
    const onGoregister = () => {
      instance.proxy.$cpLogin({ visible: false })
      setTimeout(() => {
        showRegister()
      }, 500)
    }
    
    return {
      showLogin,
      showRegister,
      onGologin,
      onGoregister
    }
  }
})
})
</script>

<style lang="scss" scoped></style>
  @use "@/assets/css/variables" as *;
