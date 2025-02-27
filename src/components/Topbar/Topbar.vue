import { computed, defineComponent, inject, onMounted, onUnmounted, reactive, ref, watch }, { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated }, { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
<template>
  <div
    class="top-bar"
    :class="isHome ? 'showFixed' : ''"
  >
    <div class="content-container top-h">
      <h1><span>全品文教</span> - 学生用品提供商和教育服务者</h1>
      <div class="top-menu fr">
        <ul
          v-if="!loginStatus"
          class="top-menu-list"
        >
          <li
            class="list-item item-login"
            @click="showLogin"
          >
            <span class="text"><i class="iconfont iconuser" />登录</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="showRegister"
          >
            <span class="text">注册</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="openVipService"
          >
            <span class="text">会员服务</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="openCampusService"
          >
            <span class="text">开通校园服务</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="openCanpointItem"
          >
            <span class="text">题库开放平台</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="entryPage('help')"
          >
            <span class="text">帮助中心</span>
          </li>
          <li
            class="list-item"
            @click="entryPage('agreement')"
          >
            <span class="text">协议及说明</span>
          </li>
        </ul>
        <ul
          v-else
          class="top-menu-list"
        >
          <li class="list-item">
            <el-popover
              placement="bottom"
              width="292"
              trigger="hover"
            >
              <template #reference>
                <span class="user-dropdown">
                  <el-button
                    type="text"
                    class="dropdown-text"
                  >
                    <img
                      v-if="userInfo.profilePhoto"
                      :src="userInfo.profilePhoto"
                      alt="avatar"
                      width="24"
                      height="24"
                      class="avatar"
                    >
                    <img
                      v-else
                      src="@/assets/images/avatar.png"
                      alt="avatar"
                      width="24"
                      height="24"
                      class="avatar"
                    >
                    <span class="username">{{ userInfo.nickname }}</span>
                  </el-button>
                </span>
              </template>
              <div class="cp-top-userinfo-part">
                <div class="cp-user-service">
                  <div class="title">
                    当前服务：
                  </div>
                  <div class="service-name-segment">
                    <span
                      class="service-name"
                      @click="handleUser"
                    >{{
                      serviceInfo.serviceName
                    }}</span>
                    <label
                      v-if="
                        selectServiceDialog.serviceList &&
                          selectServiceDialog.serviceList.length > 1
                      "
                      class="service-change"
                      @click="selectServiceDialog.visible = true"
                    >[切换]</label>
                    <span :class="'cp_vip_icon_' + currentServiceId" />
                  </div>
                  <div
                    v-if="currentServiceId == 2"
                    class="service-end-time"
                  >
                    到期日期：{{ serviceInfo.timeEnd | datetime('YYYY-MM-DD') }}
                  </div>
                </div>
                <div
                  class="service-out-login"
                  @click="handleCommand(2)"
                >
                  退出
                </div>
              </div>
            </el-popover>

            <!-- <el-dropdown
              @command="handleCommand"
              class="user-dropdown"
              placement="bottom"
            >
              <el-button type="text" class="dropdown-text">
                <img
                  :src="userInfo.profilePhoto"
                  alt="avatar"
                  width="24"
                  height="24"
                  class="avatar"
                  v-if="userInfo.profilePhoto"
                />
                <img
                  src="@/assets/images/avatar.png"
                  alt="avatar"
                  width="24"
                  height="24"
                  class="avatar"
                  v-else
                />
                <span class="username">{{ userInfo.nickname }}</span>
              </el-button>
              <el-dropdown-menu
                v-slot:dropdown
                class="user-dropdown-menu custom-dropdown-menu"
              >
                <el-dropdown-item class="dropdown-menu-item">
                  <slot name="dropdown">
                    <div class="slot-drop-item">
                      <p class="item-one" @click="handleUser">当前服务：</p>
                      <p class="item-two">
                        <span @click="handleUser"
                          ><i class="iconfont iconbanbengengxin"></i
                          >{{ serviceInfo.serviceName }}</span
                        >
                        <label
                          v-if="
                            selectServiceDialog.serviceList &&
                            selectServiceDialog.serviceList.length > 1
                          "
                          @click="selectServiceDialog.visible = true"
                          >[切换]</label
                        >
                      </p>
                    </div>
                    <div v-if="currentServiceId == 2" class="vip-end-time">
                      到期日期：{{
                        serviceInfo.timeEnd | datetime('YYYY-MM-DD')
                      }}
                    </div>
                  </slot>
                </el-dropdown-item>
                <el-dropdown-item
                  class="dropdown-menu-item"
                  v-for="item in menuOptions"
                  :key="item.value"
                  :command="item.value"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </li>

          <li
            class="list-item"
            @click="handleCommand(1)"
          >
            <em class="line">|</em>
            <span class="text">个人中心</span>
          </li>
          <li
            class="list-item"
            @click="openVipService"
          >
            <em class="line">|</em>
            <span class="text">会员服务</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="openCampusService"
          >
            <span class="text">开通校园服务</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="openCanpointItem"
          >
            <span class="text">题库开放平台</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="entryPage('help')"
          >
            <span class="text">帮助中心</span>
          </li>
          <li
            class="list-item"
            @click="entryPage('agreement')"
          >
            <span class="text">协议及说明</span>
          </li>
        </ul>
      </div>
    </div>
    <app-login ref="appLogin" />
    <!--切换服务-->
    <div class="dialog-wrapper">
      <el-dialog
        v-model="selectServiceDialog.visible"
        :title="selectServiceDialog.title"
        :modal-append-to-body="false"
        :lock-scroll="false"
        :show-close="selectServiceDialog.showClose"
        :width="selectServiceDialog.width"
      >
        <div class="dialog-content">
          <p class="tip">
            您的账号内包含以下身份和服务，请选择您当前登录使用的身份：
          </p>
          <ul class="service-list">
            <li
              v-for="(item, index) in selectServiceDialog.serviceList"
              :key="index"
              :class="
                item.currId === selectServiceDialog.currId ? 'active' : ''
              "
              @click="changeService(item)"
            >
              <label>
                <span v-if="item.roleName">{{ item.roleName }}</span>
                <span v-else>以个人身份使用</span> </label>——{{ item.serviceName }}
              <!--<label>{{item.serviceName}}</label>-->
              <i
                v-if="item.currId === selectServiceDialog.currId"
                class="iconfont iconxuanzhong"
              />
            </li>
          </ul>
          <p>
            <el-checkbox
              v-model="selectServiceDialog.serviceChecked"
            />&nbsp;&nbsp;记住选择，不再提示
          </p>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              class="btn btn-shadow"
              @click="getCurrentService"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!---->
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  isLogin,
  getToken,
  removeToken,
  getSessionStore,
  removeSessionStore,
  encrypt,
  setToken,
} from '@/common/js/util'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'
import commonUrl from '@/common/js/project-url'
import axios from 'axios'


export default defineComponent({
  name: 'Topbar',
  props: {
    isHome: {
      type: Boolean,
      default: false,
    })

    return {
  })

    return {
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const Bus = inject('Bus')
    
    const appLogin = ref(null)
    const loginStatus = ref(false) // 默认未登录
    const userInfo = ref({})
    const serviceName = ref(null)
    const currentServiceId = ref(0)
    const currServiceInfo = ref({})
    
    const menuOptions = ref([
      {
        value: 2,
        name: '退出',
      })

    return {
    ])
    
    const selectServiceDialog = ref({
      visible: false,
      title: '选择我的服务',
      showClose: true,
      width: '650px',
      serviceChecked: true,
      serviceList: [],
      currId: '',
    })
    
    // Computed properties
    const serviceInfo = computed(() => store.state.serviceInfo)
    
    // Watch for changes
    watch(() => serviceInfo.value, (nv, ov) => {
      currentServiceId.value = nv.serviceId
    })

    return { { immediate: true, deep: true })
    
    // Methods
    const changeService = (item) => {
      currServiceInfo.value = item
      selectServiceDialog.value.currId = item.currId
    }
    
    const checkLogin = async () => {
      //  通过 外部链接 账号密码登录
      let thirdLogin = router.currentRoute.value.query.third
      let account = router.currentRoute.value.query.account
      let password = router.currentRoute.value.query.pwd
      if (thirdLogin && account && password) {
        removeToken()
        thirdLoginHttp(account, password)
        return
      }

      loginStatus.value = isLogin()
      console.log(isLogin())
      if (isLogin()) {
        getUserInfo()
      }
    }
    
    const thirdLoginHttp = (account, password) => {
      let parms = {
        url: API.LOGIN.urlPath,
        apiId: API.LOGIN.apiId,
        strParams: {
          account: account.trim(),
          password: encrypt(password),
        })

    return {
      }
      apiGet({ urlPath: API.LOGIN.urlLocalPath })

    return { parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3 .注册后显示注册成功
          loginSuccese = true
          // 登录后把token存到cookie
          setToken(res.data.token, 30)
          window.location.href = commonUrl.eduCloudUrl.paperUrl // 跳转到首页登录
        } else {
          loginData.errorStatus = true
          loginData.errorText = res.msg
        }
      })
    }
    
    const showLogin = () => {
      appLogin.value.showLogin()
    }
    
    const showRegister = () => {
      appLogin.value.showRegister()
    }
    
    const openVipService = () => {
      openSystemPathLink('vip/buyvip')
    }
    
    const openCampusService = () => {
      router.push({
        path: '/open/campus/service',
      })
    }
    
    const openCanpointItem = () => {
      openWindowLink('http://ti.canpoint.cn/about')
    }
    
    const entryPage = (name) => {
      if (name === 'help') {
        openWindowLink(
          commonUrl.eduCloudUrl.helpManage.showUrl +
            '/#/help-doc/detail?lid=26807f49cc77ab14&fid=0aaed09d31b46cba',
        )
      } else if (name == 'agreement') {
        openWindowLink(import.meta.env.VITE_SRC + 'infomationAuth')
      } else {
        router.push({ name })
      }
    }
    
    const getUserInfo = () => {
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          userInfo.value = res.data
          store.dispatch('updateUserInfo', res.data)
          vipProcedure()
          if (res.data.rewards && res.data.rewards.length) {
            showCpReceiveReward(res.data.rewards)
          }
        } else if (res.code === CTS.constant.AUTH_TOKEN_CALLBACK_CODE) {
          loginStatus.value = false
          setTimeout(() => {
            store.dispatch('updateUserInfo', {
              t: new Date().getTime(),
            })
          })

    return { 2000)
        }
      })
    }
    
    const vipProcedure = async () => {
      await activeUser()
      handleSelectMethod() // 首次进入弹窗
      authSchoolVerify()
    }
    
    const authSchoolVerify = () => {
      apiGet(API.SCHOOL_schoolVerify).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          store.dispatch('updateSchoolVerify', res.data)
        }
      })
    }
    
    const handleSelectMethod = () => {
      let parms = {
        token: getToken(),
      }
      var currServiceStorage = getSessionStore('serviceInfo')
        ? JSON.parse(getSessionStore('serviceInfo'))
        : {}
        
      axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/paperService/serviceSelect', {params: parms}).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data.length !== 0) {
              var arrList = res.data
              arrList.forEach((item, index) => {
                Object.assign(item, { currId: item.serviceId })
              })
              // 列表
              selectServiceDialog.value.serviceList = arrList
              // 弹窗状态
              var result = true
              const even = element => element.isDefault === true
              // 判断只有一个服务
              if (arrList.length === 1) {
                result = false
                currServiceInfo.value = arrList[0]
                selectServiceDialog.value.currId = arrList[0].currId
              } else if (arrList.length > 1) {
                // 判断缓存中有没有服务
                if (Object.keys(currServiceStorage).length) {
                  currServiceInfo.value = currServiceStorage
                  selectServiceDialog.value.currId = currServiceStorage.currId
                  // 显示和隐藏弹窗
                  result = !arrList.some(even)
                } else {
                  var mapObj = arrList.filter(word => {
                    return word.isDefault
                  })
                  if (!mapObj.length) {
                    mapObj = [arrList[0]]
                    currServiceInfo.value = mapObj[0]
                  } else {
                    currServiceInfo.value = mapObj[0]
                  }
                  selectServiceDialog.value.currId = mapObj[0].currId
                  // 显示和隐藏弹窗
                  result = !arrList.some(even)
                }
              }

              store.dispatch('updateServiceInfo', currServiceInfo.value)
              selectServiceDialog.value.visible = result
            }
          }
        })
    }
    
    const activeUser = () => {
      let parms = {}
      return axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/user/activateAccount', {
        headers: {
          CANPOINTTOKEN: getToken(),
        })

    return {
      }).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
        }
      })
    }
    
    const getCurrentService = () => {
      if (selectServiceDialog.value.serviceChecked) {
        if (!currServiceInfo.value.serviceId) {
          ElMessage.error('请选择一个服务！')
          return
        }
        
        // 设置默认机构
        let parms = {
          id: currServiceInfo.value.id,
          stageSubject: currServiceInfo.value.stageSubject,
        }
        
        axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/paperService/defaultServer', parms, {
          headers: {
            'CANPOINTTOKEN': getToken(),
          })

    return {
        }).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            authSchoolVerify()
            selectServiceDialog.value.visible = false
            store.dispatch('updateServiceInfo', currServiceInfo.value)
          }
        })
      } else {
        if (!currServiceInfo.value.serviceId) {
          ElMessage.error('请选择一个服务！')
          return
        }
        
        store.dispatch('updateServiceInfo', currServiceInfo.value)
        selectServiceDialog.value.visible = false
      }
    }
    
    const handleUser = () => {
      // router.push({
      //   name: 'accountInfo',
      //   query: { tabActiveName: 'five' }
      // })
    }
    
    const handleCommand = (command) => {
      if (command === 1) {
        router.push({
          name: 'accountInfo',
        })
      } else if (command === 2) {
        let parms = {
          token: getToken(),
        }
        wayPost(API.LOGOUT, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            removeToken()
            removeSessionStore('serviceInfo')
            loginStatus.value = false
            window.location.reload() // 刷新页面
          }
        })
      } else {
        return false
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      checkLogin()
      Bus.on('showAppLogin', showLogin)
    })
    
    onUnmounted(() => {
      Bus.off('showAppLogin')
    })
    
    const state = reactive({
      appLogin,
      loginStatus,
      menuOptions,
      selectServiceDialog,
      userInfo,
      serviceName,
      currentServiceId,
      currServiceInfo,
      serviceInfo,
      changeService,
      showLogin,
      showRegister,
      openVipService,
      openCampusService,
      openCanpointItem,
      entryPage,
      getUserInfo,
      vipProcedure,
      authSchoolVerify,
      handleSelectMethod,
      activeUser,
      getCurrentService,
      handleUser,
      handleCommand
    }
  }
}
</script>
<style lang="scss">
  @use "@/assets/css/variables" as *;
.top-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 12px;
    opacity: 0.6;
    color: #fff;
    font-weight: 400;
    span {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.custom-dropdown-menu.el-popper {
  .popper__arrow {
    left: 50% !important;
    margin-left: -5px;
    filter: drop-shadow(0px 4px 6px rgba(42, 77, 138, 0.1));
  }
}
.custom-dropdown-menu.el-popper[x-placement^='bottom'] {
  margin-top: 6px;
  margin-left: -7px;
  .popper__arrow {
    border-bottom-color: $color-theme;
  }
}
.custom-dropdown-menu.el-popper[x-placement^='bottom'] {
  .popper__arrow::after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: $color-white;
  }
}
</style>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.top-bar {
  width: 100%;
  min-width: 1200px;
  height: 40px;
  background: $color-background-d;
  .top-menu {
    .top-menu-list {
      height: 40px;
      display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
      align-items: center;
      .list-item {
        .text {
          padding: 13px 15px;
          transition: 0.2s;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          font-size: $font-size-small;
          &:hover {
            color: $color-white;
          }
          .iconfont {
            font-size: $font-size-medium;
            margin-right: 6px;
          }
        }
        .line {
          color: #cfcfcf;
          font-size: $font-size-small;
          font-style: normal;
        }
        &.item-login {
          .text {
            color: $color-theme;
            &:hover {
              color: $color-theme-d;
            }
          }
        }
      }
      .user-dropdown {
        .dropdown-text {
          padding: 9px 15px 9px 12px;
          font-size: $font-size-small;
          transition: 0.2s;
          .avatar {
            float: left;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            border-radius: 10px;
          }
          .username {
            float: left;
            line-height: 20px;
            color: $color-theme;
            position: relative;
          }
          .username::after {
            position: absolute;
            background: url(../../assets/images/index/triangle.png) no-repeat;
            background-size: 100% 100%;
            content: ' ';
            width: 6px;
            height: 6px;
            top: 12px;
          }
          &:hover {
            .username {
              color: $color-theme-d;
            }
          }
        }
      }
    }
  }
}
.user-dropdown-menu {
  border: 1px solid $color-theme;
  width: 260px;
  /*height:85px;*/
  padding: 0;
  background: $color-white;
  overflow: visible;
  box-shadow: 0px 4px 6px 0px rgba(42, 77, 138, 0.1);
}

.user-dropdown-menu :deep(.dropdown-menu-item) {
  padding: 0;
  line-height: 40px;
  color: $color-text;
  text-align: center;
  transition: 0.2s;
  &:hover {
    background: $color-menu-l-hover;
    color: $color-theme-d;
  }
  &:first-child:hover {
    border-radius: 4px 4px 0 0;
  }
  &:last-child:hover {
    border-radius: 0 0 4px 4px;
  }
}

// 选择服务
.slot-drop-item {
  line-height: 0;
  padding: 13px 0;
  font-size: $font-size-medium;
  display: flex;
  .item-one {
    line-height: 20px;
    color: $color-text;
  }
  .item-two {
    line-height: 20px;
    color: $color-theme;
    .iconbanbengengxin {
      font-size: 12px;
      margin-right: 10px;
    }
    label {
      cursor: pointer;
      margin-left: 10px;
    }
    &:hover {
      background: $color-menu-l-hover;
      color: $color-theme-d;
    }
  }
}
.dialog-content {
  padding: 20px 60px 0 60px;
  .tip {
    text-align: left;
    padding-bottom: 21px;
  }
  .service-list {
    text-align: left;
    li {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      padding: 0 24px;
      margin-bottom: 22px;
      color: #333333;
      cursor: pointer;
      background: rgba(246, 246, 246, 1);
      border: 1px solid rgba(238, 238, 238, 1);
      border-radius: 4px;
      &:hover {
        color: $color-theme;
      }
      &.active {
        background: $color-theme;
        color: $color-white;
      }
      label {
        font-weight: bold;
      }
      .iconfont {
        float: right;
        font-size: 18px;
      }
    }
  }
}
.dialog-footer {
  padding: 0 40px;
  button {
    width: 100%;
    padding: 13px 37px;
    font-size: 14px;
  }
}

.showFixed {
  position: fixed;
  z-index: 999;
  top: 0;
}

.cp-top-userinfo-part {
  text-align: center;
  .cp-user-service {
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 19px;

    .title {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }
    .service-name-segment {
      padding-top: 15px;
      .service-name {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        padding-right: 10px;
        line-height: 23px;
      }
      .service-change {
        font-size: 16px;
        font-weight: 400;
        color: $color-theme;
        cursor: pointer;
        user-select: none;
        padding-top: 16px;
        padding-right: 10px;
        line-height: 23px;
      }
    }

    .service-end-time {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      padding-top: 16px;
    }
  }
  .service-out-login {
    padding-top: 19px;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: $color-theme;
    }
  }
}
</style>
