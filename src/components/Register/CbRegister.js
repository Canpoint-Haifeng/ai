import Vue from 'vue'
import Register from './Register'
const CbRegister = Vue.extend(Register)
var instance

Register.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      if (sub != 'visible') {
        instance[sub] = data[sub] || initDate[sub]
      }
    }
  } else {
    instance = new CbRegister({
      data,
    }).$mount()
    document.body.appendChild(instance.$el)
  }

  Vue.nextTick(() => {
    instance.visible = data.visible || false
  })
}

export default Register
