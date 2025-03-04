import Vue from 'vue'
import Login from './Login'
const CpLogin = Vue.extend(Login)
var instance

Login.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      if (sub != 'visible') {
        instance[sub] = data[sub] || initDate[sub]
      }
    }
  } else {
    instance = new CpLogin({
      data
    }).$mount()
    document.body.appendChild(instance.$el)
  }
  Vue.nextTick(() => {
    instance.visible = data.visible || false
  })
}

export default Login
