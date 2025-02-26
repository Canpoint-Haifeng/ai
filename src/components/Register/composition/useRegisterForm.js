import { ref, computed } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { setToken, encrypt, getToken } from '@/common/js/util'
import Cookies from 'js-cookie'

let interval = null

export function useRegisterForm(instance) {
  // Reactive state
  const visible = ref(false)
  const loginSuccese = ref(false)
  const registerRewards = ref([])
  const haslogin = ref(1)
  const checkeNCData = ref({})
  
  // Form data
  const loginData = ref({
    account: '',
    codeStatus: false, // 滑动验证码
    vfcode: '',
    password: '',
    agree: true,
    errorStatus: false,
    errorText: '',
    vfcodeStatus: false,
    vfCodeDiabled: true, // 验证码禁用状态
    vfcodeText: '获取验证码',
  })
  
  // Form validation rules
  const loginRules = {
    account: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号'))
          } else {
            let str = value.trim()
            if (CTS.constant.phoneReg.test(str)) {
              callback()
            } else {
              loginData.value.errorStatus = false
              return callback(new Error('请输入正确的手机号'))
            }
          }
        }, 
        trigger: 'blur' 
      }
    ],
    password: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'))
          } else {
            const passwordReg = CTS.constant.passwordReg
            if (passwordReg.test(value)) {
              callback()
            } else {
              loginData.value.errorStatus = false
              return callback(new Error('密码是6~18位字母、数字'))
            }
          }
        }, 
        trigger: 'blur' 
      }
    ],
    vfcode: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入短信验证码'))
          } else {
            const vfcode = CTS.constant.vfcodeReg
            if (vfcode.test(value)) {
              callback()
            } else {
              loginData.value.errorStatus = false
              return callback(new Error('验证码是4位数字'))
            }
          }
        }, 
        trigger: 'blur' 
      }
    ],
    agree: [{ required: true, message: '', trigger: 'change' }],
  }
  
  // Computed properties
  const isVfCode = computed(() => {
    return !!(loginData.value.account && loginData.value.codeStatus)
  })
  
  const isValue = computed(() => {
    return !!(
      loginData.value.account &&
      loginData.value.password &&
      loginData.value.codeStatus &&
      loginData.value.vfcode &&
      loginData.value.agree
    )
  })
  
  // Methods
  const show = () => {
    visible.value = true
  }
  
  const hide = () => {
    visible.value = false
  }
  
  const onFocus = () => {
    loginData.value.errorStatus = false
  }
  
  const onCheckCodeSuccess = (params) => {
    checkeNCData.value = params
    loginData.value.codeStatus = true // 检验成功
    loginData.value.errorStatus = false
  }
  
  const entryAgreement = () => {
    hide()
    instance.proxy.openWindowLink(import.meta.env.VITE_APP_SRC + 'infomationAuth')
  }
  
  const register = (loginForm) => {
    instance.proxy.$refs[loginForm].validate((valid, result) => {
      // 1. 参数验证
      if (!valid) {
        const key = Object.keys(result)[0]
        loginData.value.errorStatus = true
        loginData.value.errorText = result[key][0].message
      } else {
        // 2.注册提交
        loginData.value.errorStatus = false
        let parms = {
          isWhitelist: 0,
          httpMethod: 1,
          url: API.REGISTER.urlPath,
          apiId: API.REGISTER.apiId,
          strParams: {
            account: loginData.value.account,
            password: encrypt(loginData.value.password),
            vCode: loginData.value.vfcode,
          },
        }
        let set = {
          showLoading: true,
          message: '注册中...',
        }
        instance.proxy.newPost({ urlPath: API.REGISTER.baseURL }, parms, set).then(
          res => {
            if (res && res.code === CTS.constant.SUCCESS_CODE) {
              // 3 .注册后显示注册成功
              loginSuccese.value = true
              // 登录后把token存到cookie
              console.log(loginData.value.account, loginData.value.password)
              loginHttp(loginData.value.account, loginData.value.password)
            } else {
              loginSuccese.value = false
              loginData.value.errorStatus = true
              loginData.value.errorText = res.msg
            }
          },
        )
      }
    })
  }
  
  const loginHttp = (account, password) => {
    let parms = {
      url: API.LOGIN.urlPath,
      apiId: API.LOGIN.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        account: account,
        password: encrypt(password),
      },
    }
    instance.proxy.newPost({ urlPath: API.LOGIN.urlLocalPath }, parms).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        // 3 .注册后显示注册成功
        // 登录后把token存到cookie
        setToken(res.data.token, 30)
        getUserInfo()
      }
    })
  }
  
  const getUserInfo = () => {
    let parms = {
      token: getToken(),
    }
    let set = {
      authCode: 2,
    }
    console.log('getUserInfo')
    instance.proxy.apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
      if (res.code === CTS.constant.SUCCESS_CODE) {
        if (res.data.rewards && res.data.rewards.length) {
          showReceiveReward(res.data.rewards)
        } else {
          window.location.reload()
        }
      }
    })
  }
  
  const gotoReload = () => {
    window.location.href = import.meta.env.VITE_APP_SRC
  }
  
  const showReceiveReward = (rewards) => {
    for (let item of rewards) {
      item.width = 115
      item.height = 115
      item.content =
        item.goodsName +
        '<span style="color:#FF6A00;">×' +
        item.num +
        '</span>'
    }
    registerRewards.value = rewards
  }
  
  const getVfcode = () => {
    // 1.校验参数
    if (!loginData.value.account) {
      loginData.value.errorStatus = true
      loginData.value.errorText = '请输入手机号'
      return
    }
    if (!CTS.constant.phoneReg.test(loginData.value.account)) {
      loginData.value.errorStatus = true
      loginData.value.errorText = '请输入正确的手机号'
      return
    }
    if (!loginData.value.password) {
      loginData.value.errorStatus = true
      loginData.value.errorText = '请设置登录密码'
      return
    }
    if (!loginData.value.codeStatus) {
      loginData.value.errorStatus = true
      loginData.value.errorText = '请完成滑动验证'
      return
    }
    // 2.验证码秒数减少
    changeVf()
    
    let parms = {
      strParams: {
        account: loginData.value.account,
        sessionId: checkeNCData.value.strParams.sessionId,
      },
      isWhitelist: 0,
      httpMethod: 1,
      url: API.VCODE.urlPath,
      apiId: API.VCODE.apiId,
    }
    let set = {
      message: '发送验证码中',
    }
    // 2.发送验证码请求
    instance.proxy.newPost({ urlPath: API.VCODE.baseURL }, parms, set).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        // 3.请求成功后改变验证码显示
      } else {
        loginData.value.errorStatus = true
        loginData.value.errorText = res.msg
        setTimeout(() => {
          window.clearInterval(interval)
          loginData.value.vfcodeStatus = false
          loginData.value.vfcodeText = '获取验证码'
        }, 1000)
      }
    })
  }
  
  const changeVf = () => {
    let time = 60
    loginData.value.vfcodeStatus = true
    loginData.value.vfcodeText = `60S后重新获取`
    interval = window.setInterval(function() {
      --time
      loginData.value.vfcodeText = `${time}S后重新获取`
      if (time < 0) {
        loginData.value.vfcodeStatus = false
        loginData.value.vfcodeText = `获取验证码`
        window.clearInterval(interval)
      }
    }, 1000)
  }
  
  return {
    visible,
    loginSuccese,
    registerRewards,
    haslogin,
    loginData,
    loginRules,
    isVfCode,
    isValue,
    show,
    hide,
    onFocus,
    onCheckCodeSuccess,
    entryAgreement,
    register,
    getVfcode,
    gotoReload
  }
}
