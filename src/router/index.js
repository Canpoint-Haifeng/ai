import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { setToken } from '@/common/js/util'
import { API } from '@/api/config'
import { ElMessage } from 'element-plus'
import { withSuspense } from './suspense-helper'
import IndexSkeleton from '@/components/Skeleton/IndexSkeleton.vue'
import PaperMakerSkeleton from '@/components/Skeleton/PaperMakerSkeleton.vue'
import PaperDetailSkeleton from '@/components/Skeleton/PaperDetailSkeleton.vue'

const router = createRouter({
  history: createWebHistory('/lesson'),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'paperIndex',
      },
    },
    {
      path: '/paper/index',
      name: 'paperIndex',
      component: withSuspense(() => import('@/views/paper/index.vue'), IndexSkeleton),
    },
    {
      path: '/paper/maker',
      name: 'paperMaker',
      component: withSuspense(() => import('@/views/paper/maker.vue'), PaperMakerSkeleton),
    },
    {
      path: '/paper/detail/:id',
      name: 'paperDetail',
      component: withSuspense(() => import('@/views/paper/detail.vue'), PaperDetailSkeleton),
    },
  ],
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    }
  },
})

router.beforeEach(async (to, from, next) => {
  if (to.path.includes('plaza')) {
    next('/index')
  }
  const disabledNav = to.meta.disabledNav || false
  store.commit('SET_DISABLED_NAV', disabledNav)
  store.commit('SET_FULL_PATH', to.name)

  if (
    to.query.headimgurl &&
    to.query.nickname &&
    to.query.openid &&
    to.query.unionid
  ) {
    let parms = {
      unionId: to.query.unionid,
      weChatPhoto: to.query.headimgurl,
      weChatNickname: to.query.nickname,
    }
    let res = await router.app.config.globalProperties.wayPost(API.WECHATLOGIN, parms, {
      authCode: 1,
    })
    if (res.code === 200) {
      if (res.data && res.data.token) {
        setToken(res.data.token, 30)
      }
      next(to.path)
    } else {
      if (res.code === 301) {
        ElMessage({
          type: 'error',
          message: '此微信未绑定任何账号，请先绑定账号',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '微信登录失败',
        })
      }
      next(to.path)
    }
  }
  next()
})

export default router
