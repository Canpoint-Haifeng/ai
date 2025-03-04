export default {
  data() {
    return {
      // 为了防止 重复点击
      repeatClick: {},
    }
  },
  methods: {
    hasRepeatClick(keyName, delay = 1000) {
      var nowTime = new Date().getTime()
      if (
        this.repeatClick[keyName] &&
        nowTime - this.repeatClick[keyName] < delay
      ) {
        return true
      } else {
        this.repeatClick[keyName] = nowTime
        return false
      }
    },
  },
}
