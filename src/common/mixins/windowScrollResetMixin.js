const windowScrollResetMixin = {
  methods: {
    initWindowsEvent() {
      window.addEventListener('scroll', this.renderScrollFixed, true)
      window.addEventListener('resize', this.renderScrollFixed, true)
    },
    destroyedWindowsEvent() {
      console.log('destroyedWindowsEvent')
      window.removeEventListener('scroll', this.renderScrollFixed, true)
      window.removeEventListener('resize', this.renderScrollFixed, true)
      // 移除 监听
    },
    // renderScrollFixed() {
    // let comparisonTop = window.innerHeight + this.getPageScrollTop() - 80
    //   let offsetTop = this.offsetDis(
    //     document.querySelector('.bottom-body-fixed-switch'),
    //   ).top
    // },
    getPageScrollTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      return scrollTop
    },
  },
}

export default windowScrollResetMixin
