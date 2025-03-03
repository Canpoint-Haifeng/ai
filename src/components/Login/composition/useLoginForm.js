import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { setToken, removeToken, encrypt } from '@/common/js/util'
import { loginLeftList } from '../config'

export function useLoginForm(instance) {
  // Reactive state
  const visible = ref(false)
  const currentIndex = ref(0)
  const loginSuccese = ref(false)
  const showWxLogin = ref(false)
  const customWidth = ref(300)
  const checkeNCData = ref({})
  const loginLeftStyle = ref({})
  
  // Form data
  const loginData = ref({
    account: '',
    password: '',
    errorStatus: false,
    errorText: '',
    codeStatus: false,
    agree: false,
  })
  
  const loginVsData = ref({
    phone: '',
    vsCode: '',
    errorStatus: false,
    errorText: '',
    vsCodeStatus: false,
    vsCodeText: '获取验证码',
    agree: false,
  })
  
  // Computed properties
  const isValue = computed(() => {
    return !!(loginData.value.account && loginData.value.password)
  })
  
  const isValueVs = computed(() => {
    return !!(loginVsData.value.phone && loginVsData.value.vsCode)
  })
  
  // 是否可以发送短信验证码
  const isVfCode = computed(() => {
    return !(loginVsData.value.phone && loginData.value.codeStatus)
  })
  
  // Form validation rules
  const loginRules = {
    account: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号/邮箱'))
          } else {
            let str = value.trim()
            if (CTS.constant.phoneReg.test(str) || CTS.constant.emilReg.test(str)) {
              callback()
            } else {
              loginData.value.errorStatus = false
              return callback(new Error('请输入正确的手机号或者邮箱'))
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
            if (CTS.constant.passwordReg.test(value)) {
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
    agree: [{ required: true, message: '请勾选', trigger: 'change' }],
  }
  
  const loginVsRules = {
    phone: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号'))
          } else {
            let str = value.trim()
            if (CTS.constant.phoneReg.test(str)) {
              callback()
            } else {
              loginVsData.value.errorStatus = false
              return callback(new Error('请输入正确的手机号'))
            }
          }
        }, 
        trigger: 'blur' 
      }
    ],
    vsCode: [
      { 
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入验证码'))
          } else {
            const passwordReg = CTS.constant.vfcodeReg
            if (passwordReg.test(value)) {
              callback()
            } else {
              loginVsData.value.errorStatus = false
              return callback(new Error('验证码是4位数字'))
            }
          }
        }, 
        trigger: 'submit' 
      }
    ],
    agree: [{ required: true, message: '请勾选', trigger: 'change' }],
  }
  
  // Initialize
  const initialize = () => {
    let index = Math.floor(Math.random() * loginLeftList.length)
    loginLeftStyle.value = {
      background: `url(${loginLeftList[index]}) no-repeat`,
      backgroundSize: '412px 540px',
    }
  }
  
  // Methods
  const onCheckCodeSuccess = (params) => {
    checkeNCData.value = params
    loginData.value.codeStatus = true // 检验成功
    loginData.value.errorStatus = false
  }
  
  const show = () => {
    visible.value = true
  }
  
  const hide = () => {
    visible.value = false
  }
  
  const tabHandle = (index) => {
    currentIndex.value = index
  }
  
  // 账号密码登录提交
  const login = (loginForm) => {
    if (!loginData.value.agree) {
      ElMessage.error('请阅读并勾选全品AI教研云隐私政策')
      return
    }
    
    instance.proxy.$refs[loginForm].validate((valid, result) => {
      // 1. 参数验证
      if (!valid) {
        const key = Object.keys(result)[0]
        loginData.value.errorStatus = true
        loginData.value.errorText = result[key][0].message
      } else {
        // 2.登录提交
        loginData.value.errorStatus = false
        removeToken()
        let parms = {
          url: API.LOGIN.urlPath,
          apiId: API.LOGIN.apiId,
          isWhitelist: 0,
          httpMethod: 1,
          strParams: {
            account: loginData.value.account.trim(),
            password: encrypt(loginData.value.password),
          },
        }
        instance.proxy.newPost({ urlPath: API.LOGIN.urlLocalPath }, parms).then(res => {
          if (res && res.code === CTS.constant.SUCCESS_CODE) {
            // 3 .注册后显示注册成功
            loginSuccese.value = true
            // 登录后把token存到cookie
            setToken(res.data.token, 30)
            window.location.reload()
          } else {
            loginData.value.errorStatus = true
            loginData.value.errorText = res.msg
          }
        })
      }
    })
  }
  
  // 验证码登录
  const loginVs = (loginFormVs) => {
    if (!loginVsData.value.agree) {
      ElMessage.error('请阅读并勾选全品AI教研云隐私政策')
      return
    }
    
    instance.proxy.$refs[loginFormVs].validate((valid, result) => {
      // 1. 参数验证
      if (!valid) {
        const key = Object.keys(result)[0]
        loginVsData.value.errorStatus = true
        loginVsData.value.errorText = result[key][0].message
      } else {
        // 2.登录提交
        loginVsData.value.errorStatus = false
        let parms = {
          url: API.VCODELOGIN.urlPath,
          apiId: API.VCODELOGIN.apiId,
          isWhitelist: 0,
          httpMethod: 1,
          strParams: {
            mobile: loginVsData.value.phone.trim(),
            vCode: loginVsData.value.vsCode.trim(),
          },
        }
        let set = {
          authCode: 1,
        }
        instance.proxy.newPost({ urlPath: API.VCODELOGIN.baseURL }, parms, set).then(res => {
          if (res && res.code === CTS.constant.SUCCESS_CODE) {
            // 3 .登陆后把token存到cookie
            setToken(res.data.token, 30)
            window.location.reload()
          } else {
            loginVsData.value.errorStatus = true
            loginVsData.value.errorText = res.msg
          }
        })
      }
    })
  }
  
  let interval = null
  
  const getVfcode = () => {
    // 1.校验参数
    if (!loginVsData.value.phone) {
      loginVsData.value.errorStatus = true
      loginVsData.value.errorText = '请输入手机号'
      return
    }
    if (!CTS.constant.phoneReg.test(loginVsData.value.phone)) {
      loginVsData.value.errorStatus = true
      loginVsData.value.errorText = '请输入正确的手机号'
      return
    }
    // 2.验证码秒数减少
    changeVf()
    let parms = {
      url: API.SENDVCODE.urlPath,
      apiId: API.SENDVCODE.apiId,
      isWhitelist: 0,
      httpMethod: 1,
      strParams: {
        mobile: loginVsData.value.phone,
        sessionId: checkeNCData.value.strParams.sessionId,
      },
    }
    let set = {
      message: '发送验证码中',
    }
    // 2.发送验证码请求
    instance.proxy.newPost({ urlPath: API.SENDVCODE.baseURL }, parms, set).then(res => {
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        // 3.请求成功后改变验证码显示
      } else {
        loginVsData.value.errorStatus = true
        loginVsData.value.errorText = res.msg
        setTimeout(() => {
          window.clearInterval(interval)
          loginVsData.value.vsCodeStatus = false
          loginVsData.value.vsCodeText = '获取验证码'
        }, 1000)
      }
    })
  }
  
  const changeVf = () => {
    let time = 60
    loginVsData.value.vsCodeStatus = true
    loginVsData.value.vsCodeText = `60S后重新获取`
    interval = window.setInterval(function() {
      --time
      loginVsData.value.vsCodeText = `${time}S后重新获取`
      if (time < 0) {
        loginVsData.value.vsCodeStatus = false
        loginVsData.value.vsCodeText = `获取验证码`
        window.clearInterval(interval)
      }
    }, 1000)
  }
  
  const onFocus = () => {
    loginVsData.value.errorStatus = false
  }
  
  const privacyPolicy = () => {
    hide()
    instance.proxy.openWindowLink(import.meta.env.VITE_APP_SRC + 'infomationAuth')
  }
  
  // Initialize on creation
  initialize()
  
  return {
    visible,
    currentIndex,
    customWidth,
    loginData,
    loginVsData,
    loginRules,
    loginVsRules,
    loginLeftStyle,
    isValue,
    isValueVs,
    isVfCode,
    show,
    hide,
    tabHandle,
    login,
    loginVs,
    getVfcode,
    onCheckCodeSuccess,
    onFocus,
    privacyPolicy
  }
}
