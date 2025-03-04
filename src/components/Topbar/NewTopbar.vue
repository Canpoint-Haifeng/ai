<!-- 没有 验证登录的 top -->
<template>
  <div class="top-bar" :class="isHome ? 'showFixed' : ''">
    <div class="content-container top-h">
      <h1><span>全品文教</span> - 学生用品提供商和教育服务者</h1>
      <div class="top-menu fr">
        <ul class="top-menu-list" v-if="!loginStatus">
          <li class="list-item item-login" @click="showLogin">
            <span class="text"><i class="iconfont iconuser"></i></template></template>登录</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="showRegister">
            <span class="text">注册</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="openCampusService">
            <span class="text">开通校园服务</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="openCanpointItem">
            <span class="text">题库开放平台</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="entryPage('help')">
            <span class="text">帮助中心</span>
          </li>
        </ul>
        <ul class="top-menu-list" v-else>
          <li class="list-item">
            <el-dropdown
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
                #dropdown"
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
            </el-dropdown>
          </li>
          <!-- <li class="list-item" @click="openVipService">
            <em class="line">|</em>
            <span class="text">会员服务</span>
            <em class="line">|</em>
          </li> -->
          <li class="list-item" @click="openCampusService">
            <span class="text">开通校园服务</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="openCanpointItem">
            <span class="text">题库开放平台</span>
            <em class="line">|</em>
          </li>
          <li class="list-item" @click="entryPage('help')">
            <span class="text">帮助中心</span>
          </li>
        </ul>
      </div>
    </div>
    <app-login ref="appLogin"></app-login>
    <!--切换服务-->
    <div class="dialog-wrapper">
      <el-dialog
        :title="selectServiceDialog.title"
        v-model="selectServiceDialog.visible"
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
              :class="
                item.currId === selectServiceDialog.currId ? 'active' : ''
              "
              v-for="(item, index) in selectServiceDialog.serviceList"
              :key="index"
              @click="changeService(item)"
            >
              <label>
                <span v-if="item.roleName">{{ item.roleName }}</span>
                <span v-else>以个人身份使用</span> </label
              >——{{ item.serviceName }}
              <!--<label>{{item.serviceName}}</label>-->
              <i
                v-if="item.currId === selectServiceDialog.currId"
                class="iconfont iconxuanzhong"
              ></i></template></template>
            </li>
          </ul>
          <p>
            <el-checkbox
              v-model="selectServiceDialog.serviceChecked"
            ></el-checkbox
            >&nbsp;&nbsp;记住选择，不再提示
          </p>
        </div>
        <div #footer class="dialog-footer">
          <el-button class="btn btn-shadow" @click="getCurrentService"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!---->
  </div>
</template>

<script>
  import {
    getToken,
    removeToken,
    getSessionStore,
    removeSessionStore,
  } from '@/common/js/util'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import CTS from '@/common/js/constant'
  import commonUrl from '@/common/js/project-url'
  import axios from 'axios'
  export default {
    props: {
      isHome: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState(['serviceInfo', 'userInfo', 'currSubject']),
    },
    data() {
      return {
        loginStatus: false, // 默认未登录
        menuOptions: [
          {
            value: 1,
            name: '个人中心',
          },
          {
            value: 2,
            name: '退出',
          },
        ],
        currServiceInfo: {},
        selectServiceDialog: {
          visible: false,
          title: '选择我的服务',
          showClose: true,
          width: '650px',
          serviceChecked: true,
          serviceList: [],
          currId: '',
        },
        serviceName: null,
        currentServiceId: 0,
      }
    },

    watch: {
      serviceInfo: {
        handler(nv, ov) {
          this.currentServiceId = nv.serviceId
        },
        immediate: true,
        deep: true,
      },
      userInfo() {
        this.vipProcedure()
      },
      currSubject() {
        this.vipProcedure()
      },
    },
    mounted() {
      this.vipProcedure()
    },
    methods: {
      // 激活后才能 调用 获取 用户 的权限
      async vipProcedure() {
        console.log('vipProcedure', this.currSubject, this.userInfo)
        if (
          this.currSubject &&
          this.currSubject.subjectCode &&
          this.userInfo &&
          this.userInfo.userGuid
        ) {
          this.loginStatus = true
          this.handleSelectMethod() // 首次进入弹窗
        } else {
          this.loginStatus = false
        }
      },
      // 选择服务
      changeService(item) {
        this.currServiceInfo = item
        this.selectServiceDialog.currId = item.currId
      },
      // 显示登录弹框
      showLogin() {
        this.$refs.appLogin.showLogin()
      },
      // 显示注册弹框
      showRegister() {
        this.$refs.appLogin.showRegister()
      },
      openVipService() {
        // CpBuyVip.install({
        //   loginCallBack: () => {
        //     this.showLogin()
        //   },
        // })
      },
      // 开通校园服务
      openCampusService() {
        this.$router.push({
          path: '/open/campus/service',
        })
      },
      openCanpointItem() {
        this.openWindowLink('http://ti.canpoint.cn/about')
      },
      // 进入对应页面
      entryPage(name) {
        if (name === 'help') {
          this.openWindowLink(
            commonUrl.eduCloudUrl.helpManage.showUrl +
              '/#/help-doc/detail?lid=26807f49cc77ab14&fid=0aaed09d31b46cba',
          )
        } else {
          this.$router.push({ name })
        }
      },

      // 选择服务
      handleSelectMethod() {
        let parms = {
          token: getToken(),
        }
        var currServiceStorage = getSessionStore('serviceInfo')
          ? JSON.parse(getSessionStore('serviceInfo'))
          : {}
        // this.apiGet(API.GET_SERVICE_LIST, parms).then((res) => {
        //   if (res.code === CTS.constant.SUCCESS_CODE) {
        //     if (res.data.length !== 0) {
        //       var arrList = res.data
        //       arrList.forEach((item, index) => {
        //         // Object.assign(item, { currId: index + 1 })
        //         // 根据名称判断唯一性
        //         Object.assign(item, { currId: item.serviceId })
        //       })
        //       // 列表
        //       this.selectServiceDialog.serviceList = arrList
        //       // 弹窗状态
        //       var result = true
        //       const even = (element) => element.isDefault === true
        //       // 判断只有一个服务
        //       if (arrList.length === 1) {
        //         result = false
        //         this.currServiceInfo = arrList[0]

        //         this.selectServiceDialog.currId = arrList[0].currId
        //       } else if (arrList.length > 1) {
        //         // 判断缓存中有没有服务
        //         if (Object.keys(currServiceStorage).length) {
        //           this.currServiceInfo = currServiceStorage
        //           this.selectServiceDialog.currId = currServiceStorage.currId
        //           // 显示和隐藏弹窗
        //           result = !arrList.some(even)
        //         } else {
        //           var mapObj = arrList.filter((word) => {
        //             return word.isDefault
        //           })
        //           if (!mapObj.length) {
        //             mapObj = [arrList[0]]
        //             this.currServiceInfo = mapObj[0]
        //           } else {
        //             this.currServiceInfo = mapObj[0]
        //           }
        //           this.selectServiceDialog.currId = mapObj[0].currId
        //           // 显示和隐藏弹窗
        //           result = !arrList.some(even)
        //         }
        //       }
        //       // 默认激活
        //       // this.activeUserHandle(
        //       //   this.currServiceInfo.institutionId,
        //       //   this.currServiceInfo.institutionType,
        //       // )
        //       // 储存进vuex
        //       // setSessionStore('serviceInfo', this.currServiceInfo)

        //       this.$store.dispatch('updateServiceInfo', this.currServiceInfo)
        //       this.selectServiceDialog.visible = result
        //     }
        //     // else {
        //     //   this.activeUser()
        //     // }
        //   }
        // })

        axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/paperService/serviceSelect', {params: parms}).then((res) => {
           if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data.length !== 0) {
              var arrList = res.data
              arrList.forEach((item, index) => {
                // Object.assign(item, { currId: index + 1 })
                // 根据名称判断唯一性
                Object.assign(item, { currId: item.serviceId })
              })
              // 列表
              this.selectServiceDialog.serviceList = arrList
              // 弹窗状态
              var result = true
              const even = (element) => element.isDefault === true
              // 判断只有一个服务
              if (arrList.length === 1) {
                result = false
                this.currServiceInfo = arrList[0]

                this.selectServiceDialog.currId = arrList[0].currId
              } else if (arrList.length > 1) {
                // 判断缓存中有没有服务
                if (Object.keys(currServiceStorage).length) {
                  this.currServiceInfo = currServiceStorage
                  this.selectServiceDialog.currId = currServiceStorage.currId
                  // 显示和隐藏弹窗
                  result = !arrList.some(even)
                } else {
                  var mapObj = arrList.filter((word) => {
                    return word.isDefault
                  })
                  if (!mapObj.length) {
                    mapObj = [arrList[0]]
                    this.currServiceInfo = mapObj[0]
                  } else {
                    this.currServiceInfo = mapObj[0]
                  }
                  this.selectServiceDialog.currId = mapObj[0].currId
                  // 显示和隐藏弹窗
                  result = !arrList.some(even)
                }
              }
              // 默认激活
              // this.activeUserHandle(
              //   this.currServiceInfo.institutionId,
              //   this.currServiceInfo.institutionType,
              // )
              // 储存进vuex
              // setSessionStore('serviceInfo', this.currServiceInfo)

              this.$store.dispatch('updateServiceInfo', this.currServiceInfo)
              this.selectServiceDialog.visible = result
            }
            // else {
            //   this.activeUser()
            // }
          }
        })
      },

      // 服务确认
      getCurrentService() {
        if (this.selectServiceDialog.serviceChecked) {
          if (!this.currServiceInfo.serviceId) {
            this.$message.error('请选择一个服务！')
            return
          }
          // 激活用户
          // this.activeUserHandle(
          //   this.currServiceInfo.institutionId,
          //   this.currServiceInfo.institutionType,
          // )
          // 设置默认机构
          let parms = {
            id: this.currServiceInfo.id,
            stageSubject: this.currServiceInfo.stageSubject,
          }
          // this.apiGet(API.SERVICE_DEFAULT, parms).then((res) => {
          //   if (res.code === CTS.constant.SUCCESS_CODE) {
          //     // window.location.reload()
          //     this.authSchoolVerify()
          //     this.selectServiceDialog.visible = false
          //     // 储存进vuex
          //     // setSessionStore('serviceInfo', this.currServiceInfo)
          //     this.$store.dispatch('updateServiceInfo', this.currServiceInfo)
          //   }
          // })
          axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/paperService/defaultServer', parms, {
            headers: {
              'CANPOINTTOKEN': getToken(),
            },
          }).then((res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              // window.location.reload()
              this.authSchoolVerify()
              this.selectServiceDialog.visible = false
              // 储存进vuex
              // setSessionStore('serviceInfo', this.currServiceInfo)
              this.$store.dispatch('updateServiceInfo', this.currServiceInfo)
            }
          })

        } else {
          if (!this.currServiceInfo.serviceId) {
            this.$message.error('请选择一个服务！')
            return
          }
          // 储存进vuex
          // setSessionStore('serviceInfo', this.currServiceInfo)
          this.$store.dispatch('updateServiceInfo', this.currServiceInfo)
          this.selectServiceDialog.visible = false
          // window.location.href = publicUrl.eduCloudUrl.paperUrl
        }
      },
      // 进入个人中心服务
      handleUser() {
        // this.$router.push({
        //   name: 'accountInfo',
        //   query: { tabActiveName: 'five' }
        // })
      },
      // 用户下拉处理
      handleCommand(command) {
        if (command === 1) {
          this.$router.push({
            name: 'accountInfo',
          })
        } else if (command === 2) {
          let parms = {
            token: getToken(),
          }
          this.wayPost(API.LOGOUT, parms).then((res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              removeToken()
              removeSessionStore('serviceInfo')
              this.loginStatus = false
              // window.location.href = publicUrl.eduCloudUrl.paperUrl
              window.location.reload() // 刷新页面
            }
          })
        } else {
          return false
        }
      },
    },
  }
</script>
<style lang="scss">
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
  .top-bar {
    width: 100%;
    min-width: 1200px;
    height: 40px;
    background: $color-background-d;
    .top-menu {
      .top-menu-list {
        height: 40px;
        @include flex();
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
    width: 170px;
    /*height:85px;*/
    padding: 0;
    background: $color-white;
    overflow: visible;
    box-shadow: 0px 4px 6px 0px rgba(42, 77, 138, 0.1);
    :deep() .dropdown-menu-item {
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
  }
  // 选择服务
  .slot-drop-item {
    line-height: 0;
    padding: 13px 0;
    font-size: $font-size-medium;
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
</style>
