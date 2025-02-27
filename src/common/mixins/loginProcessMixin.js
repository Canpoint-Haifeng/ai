import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import {
  isLogin,
  getToken,
  ArrayExtentFind,
  setCookieSubjectVolume,
  getCookieSubjectVolume,
} from '@/common/js/util'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
const loginProcessMixin = {
  computed: {
    ...mapState(['currSubject', 'serviceInfo', 'fullpath']),
    currPath() {
      return this.$route.path
    },
    activeMenu() {
      if (this.refreshFlag) return ''
      const route = this.$route
      const { meta, path } = route
      if (meta.apiActiveMenu) {
        return meta.apiActiveMenu
      } else {
        return path
      }
    },
    isHome() {
      if (this.fullpath == 'paperIndex') {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      listData: [],
      loadView: true,
      userInfoData: null,
    }
  },
  methods: {
    ...mapActions(['updateCurrentSubject']),
    // 开始 题舟登录流程
    async startLoginProcess() {
      if (this.$route.query.third == 1 && this.$route.query.token) {
        this.$store.commit('UPDATE_THIRDDATA', { ...this.$route.query })
      }

      this.loginStatus = isLogin()
      if (isLogin()) {
        // 获取 用户 信息 和验证登录
        await this.getUserInfo()
        if (this.userInfoData && this.userInfoData.userGuid) {
          await this.vipProcedure()
        }
      }
      // 不管有没有登录成功 都要处理 学段学科
      this.getDefaultSubject()
      this.loadView = false
    },
    // 获取用户信息
    getUserInfo() {
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      return this.apiPost(API.GET_SSO_VERIFY, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.userInfoData = res.data
          this.$store.dispatch('updateUserInfo', res.data)

          if (res.data.rewards && res.data.rewards.length) {
            this.showCpReceiveReward(res.data.rewards)
          }
        } else if (res.code === CTS.constant.AUTH_TOKEN_CALLBACK_CODE) {
          this.loginStatus = false
          setTimeout(() => {
            this.$store.dispatch('updateUserInfo', {
              t: new Date().getTime(),
            })
          }, 2000)
        }
      })
    },
    async vipProcedure() {
      await this.activeUser()
      await this.authSchoolVerify()
    },
    // 激活账户
    activeUser() {
      // return this.apiGet(API.SERVICE_ACTIVE_ACCOUNT, {}).then((res) => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //   }
      // })
      return axios.get('//canpoint-cloud-api-tiku.canpoint.cn/paper-generators/user/activateAccount',{
        headers: {
          CANPOINTTOKEN: getToken(),
        },
      }).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
        }
      })
    },
    // 获取 用户 的权限 /sys/user/schoolVerify 校园权限校验
    authSchoolVerify() {
      this.apiGet(API.SCHOOL_schoolVerify).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$store.dispatch('updateSchoolVerify', res.data)
        }
      })
    },
    // 获取默认学科
    async getDefaultSubject() {
      // 如果 url 里面带有 subject 以 subject 为主
      let currSubjectStorage = await this.getInitSubject()
      if (currSubjectStorage && Object.keys(currSubjectStorage).length) {
        // 本地存有当前学科
        if (!isLogin()) {
          // 未登录本地有默认学科
          this.updateCurrentSubject(currSubjectStorage)
        } else {
          // 已登录本地有默认学科
          this.getServerSubject()
          // this.updateServerSubject(currSubjectStorage, false) // 将本地同步到服务端
        }
        this.getSubjectList()
      } else {
        // 本地无默认学科
        this.getServerSubject()
      }
    },
    async getInitSubject() {
      // important
      let subject = this.$route.query.subject
      let currSubjectStorage = null
      // 需要使用 浏览器上的 query 的有
      if (subject && subject.length >= 4) {
        await this.getSubjectList()
        let stage = subject.substring(0, 2)
        let stageItem = ArrayExtentFind(this.listData, 'code', stage)
        if (stageItem && stageItem.children) {
          let subjectItem = ArrayExtentFind(stageItem.children, 'code', subject)
          if (subjectItem) {
            currSubjectStorage = {
              periodCode: stageItem.code,
              periodName: stageItem.name,
              subjectCode: subjectItem.code,
              subjectName: subjectItem.name,
            }
          }
        }
      }
      if (!currSubjectStorage) {
        currSubjectStorage = getCookieSubjectVolume()
      }
      return currSubjectStorage
    },
    // 获取服务端默认学科
    // 获取服务端默认学科
    getServerSubject() {
      this.apiGet(API.GET_DEFAULT_SUBJECT).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let currSubject = {
            periodCode: res.data.periodCode,
            periodName: res.data.periodName,
            subjectCode: res.data.subjectCode,
            subjectName: res.data.subjectName,
          }
          let cookieSubject = getCookieSubjectVolume()
          if (cookieSubject && isLogin()) {
            // 设置 cookie 中的数据
            this.setSubjectVolumeService(
              cookieSubject,
              cookieSubject.volume,
              currSubject.subjectCode != cookieSubject.subjectCode,
            )
            return
          } else {
            if (res.data.isFirst != 1) {
              if (isLogin()) {
                setCookieSubjectVolume(currSubject)
              }
            }
          }
          this.updateCurrentSubject(currSubject) // 将服务端同步到本地
          this.getSubjectList()
        }
      })
    },
    async setSubjectVolumeService(currSubject, volume, isReload = false) {
      if (volume) {
        await this.addChooseConfig(currSubject.subjectCode, {
          grade: volume.gCode,
          volume: volume.vCode,
          version: volume.tCode,
        })
      }
      if (isReload) {
        let parms = {
          stage: currSubject.periodCode,
          subject: currSubject.subjectCode,
        }
        let set = {
          authCode: 2,
          showLoading: true,
        }
        this.apiPost(API.UPDATE_DEFAULT_SUBJECT, parms, set).then((res) => {
          if (this.checkoutRes(res)) {
            window.location.reload()
          }
        })
      } else {
        this.updateCurrentSubject(currSubject) // 将服务端同步到本地
        this.getSubjectList()
      }
    },

    // 获取学段学科数据
    getSubjectList() {
      return this.$store
        .dispatch('getConfigData', { vm: this, type: 2, strParams: {} })
        .then((res) => {
          this.listData = res || []
        })
    },
  },
}

export default loginProcessMixin
