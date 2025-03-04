import { defineComponent } from 'vue'
import LoginObtainVipDialog from './LoginObtainVipDialog.vue'
import LoginActivationVipDialog from './LoginActivationVipDialog.vue'
import CpConfigDialog from './CpConfigDialog.vue'
import CpMessageDialog from './CpMessageDialog.vue'
import CpReceiveReward from './CpReceiveReward.vue'

const dialogsConfig = {
  LoginObtainVipDialog: {
    components: defineComponent(LoginObtainVipDialog),
  },
  LoginActivationVipDialog: {
    components: defineComponent(LoginActivationVipDialog),
  },
  CpConfigDialog: {
    components: defineComponent(CpConfigDialog),
  },
  CpMessageDialog: {
    components: defineComponent(CpMessageDialog),
  },
  CpReceiveReward: {
    components: defineComponent(CpReceiveReward),
  },
}

export default dialogsConfig
