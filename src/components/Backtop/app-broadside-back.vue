<template>
  <div class="app-broadside-back">
    <div class="back-item" @click="scrollToTop" v-show="visible">
      <i class="el-icon-arrow-up"></i>
      <span>返回顶部</span>
    </div>
    <div class="back-item" @click="goBack" v-if="showBack">
      <i class="el-icon-back"></i>
      <span>返回上一页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppBroadsideBack',
  props: {
    showBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      scrollTop: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.visible = this.scrollTop > 200
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.app-broadside-back {
  position: fixed;
  right: 40px;
  bottom: 100px;
  z-index: 1000;
}
.back-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #487FFF;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  position: relative;
}
.back-item span {
  display: none;
  position: absolute;
  right: 50px;
  white-space: nowrap;
  background-color: #487FFF;
  padding: 5px 10px;
  border-radius: 4px;
}
.back-item:hover span {
  display: block;
}
</style>
