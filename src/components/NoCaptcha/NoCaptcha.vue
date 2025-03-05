<template>
  <div class="noCaptcha-container">
    <div
      id="noCaptcha"
      class="nc-container"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'

export default {
  name: 'NoCaptcha',
  props: {
    visible: Boolean,
    customWidth: {
      type: Number,
      default: 360,
    },
  },
  setup(props, { emit }) {
    const scene = ref('nc_register')
    const nc = ref(null)
    
    // Initialize NoCaptcha
    const initNC = () => {
      let ncToken = [
        'FFFF0N00000000008689',
        new Date().getTime(),
        Math.random(),
      ].join(':')
      let NCOptions = {
        renderTo: '#noCaptcha',
        appkey: 'FFFF0N00000000008689',
        scene: scene.value,
        token: ncToken,
        customWidth: props.customWidth,
        trans: { key1: 'code0' },
        elementID: ['noCaptcha'],
        is_Opt: 0,
        language: 'cn',
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {},
        callback: data => {
          console.log(data.csessionid)
          checkeNC({
            strParams: {
              sessionId: data.csessionid,
              sig: data.sig,
              token: ncToken,
              scene: scene.value,
            },
            isWhitelist: 0,
            httpMethod: 1,
            url: API.ALIYUN_VERIFY.urlPath,
            apiId: API.ALIYUN_VERIFY.apiId,
          })
        },
        error: err => {
          ElMessage.error(err)
        },
      }

      if (!nc.value) {
        /* eslint-disable */
        nc.value = new noCaptcha(NCOptions)
        /* eslint-enable */
        nc.value.upLang('cn', {
          _startTEXT: '向右滑动完成验证',
          _yesTEXT: '验证通过',
          _error300:
            '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
          _errorNetwork:
            '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>',
        })
      }
      nc.value.reset()
    }
    
    // Check NoCaptcha verification
    const checkeNC = (parms) => {
      newPost({ urlPath: API.ALIYUN_VERIFY.baseURL }, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          emit('checkCodeSuccess', parms)
        }
      })
    }
    
    // Watch for visibility changes
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        initNC()
      }
    })
    
    // Lifecycle hooks
    onMounted(() => {
      initNC()
    })
    
    onBeforeUnmount(() => {
      if (nc.value && nc.value.destroy) {
        nc.value.destroy()
      }
    })
    
    return {
      scene,
      nc,
      initNC,
      checkeNC
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.noCaptcha-container :deep(.nc_scale)) {
  height: 38px;
  background: $color-background-l;
  border: 1px solid $color-border;
  border-radius: 4px;
}

.noCaptcha-container :deep(.nc_bg)) {
  border-radius: 4px 0 0 4px;
}

.noCaptcha-container :deep(.btn_slide),
.noCaptcha-container :deep(.btn_ok)) {
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  font-size: $font-size-medium;
  box-sizing: border-box;
  border: none;
}

.noCaptcha-container :deep(.btn_slide)) {
  border-right: 1px solid $color-border;
}

.noCaptcha-container :deep(.btn_ok)) {
  border-left: 1px solid $color-border;
  border-right: 1px solid $color-border;
  font-size: $font-size-large;
}

.noCaptcha-container :deep(.scale_text .nc-lang-cnt)) {
  height: 38px;
  line-height: 38px;
  // background: #E4E4E4 !important;
  // text-fill-color: $color-text-ll;
  // background-clip: content-box;
  // // color: $color-text-ll;
  font-size: $font-size-medium;
  text-align: left;
  text-indent: 45px;
}

.noCaptcha-container :deep(.scale_text .nc-lang-cnt b)) {
  color: $color-white;
}

.noCaptcha-container :deep(.scale_text.slidetounlock span[data-nc-lang='_startTEXT'])) {
  // background: -webkit-gradient(linear,left top,right top,color-stop(0,$color-text-ll),color-stop(.4,$color-text-ll),color-stop(.5,$color-text-ll),color-stop(.6,$color-text-ll),color-stop(1,$color-text-ll));
}

.noCaptcha-container :deep(.scale_text2)) {
  color: $color-white;
}
</style>
