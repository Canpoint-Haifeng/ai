import { createRouter, createWebHistory } from 'vue-router'
import appstbRoutes from './views/components/routes'
import searchRoutes from './views/search-result/routes'

import store from '@/store'
import { setToken } from '@/common/js/util'
import { API } from '@/api/config'
import { ElMessage } from 'element-plus'

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
      path: '/paperIndex',
      name: 'paperIndex',
      component: () => import('./views/paper-index/paper-index.vue')
    },
    ...appstbRoutes,
    ...searchRoutes,
  ],
  // 重置路由滚动行为到顶部
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
  // console.log(to)
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
    try {
      let res = await router.app.config.globalProperties.wayPost(API.WECHATLOGIN, parms, {
        authCode: 1,
      })
      if (res.code === 200) {
        if (res.data && res.data.token) {
          setToken(res.data.token, 30)
        }
        next(to.path)
      } else {
        // 提示
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
    } catch (error) {
      console.error('WeChat login error:', error)
      ElMessage({
        type: 'error',
        message: '微信登录失败',
      })
      next(to.path)
    }
  }
  next(true)
})

export default router
