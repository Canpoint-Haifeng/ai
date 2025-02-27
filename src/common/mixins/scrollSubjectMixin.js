const scrollSubjectMixin = {
  data() {
    return {
      showFixed: false,
      offsetTop: 0
    }
  },
  mounted() {
    this.offsetTop = document.querySelector('.search-side').offsetTop - 20
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 监听页面滚动定位元素位置
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > this.offsetTop) {
        this.showFixed = true
      } else {
        this.showFixed = false
      }
    },
    unmounted() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}

export default scrollSubjectMixin
