/** 全品 公共弹框
所有的 全局 唯一弹框 全部放在这个里面
dialog
*/
import Vue, { nextTick } from 'vue'
import dialogsConfig from './dialog/index.js'
const CpCommonDialog = {
  components: dialogsConfig,
  instanceDict: {}
}
CpCommonDialog.openDialog = function({
  moduleC,
  data
}) {
  if (this.components[moduleC]) {
    let instance = this.instanceDict[moduleC]
    if (instance) {
      let initDate = instance.initDate
      for (let sub in initDate) {
        instance[sub] = data[sub] || initDate[sub]
      }
    } else {
      const CpWarningDialog = this.components[moduleC].components
      instance = new CpWarningDialog({
        data
      }).$mount()
      this.instanceDict['moduleC'] = instance
      document.body.appendChild(instance.$el)
    }

    nextTick(() => {
      instance.show()
    })
  }
}

export default CpCommonDialog
