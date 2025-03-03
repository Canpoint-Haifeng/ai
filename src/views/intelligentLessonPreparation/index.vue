<template>
  <div class="content-container">
    <div class="div_bankRow" />
    <div class="content-container">
      <div class="div_progress">
        <div
          v-for="item in dataList"
          :key="item.code"
          class="div_item"
          :class="{ addClass: item.code == currCode }"
          @click="redirectPage(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currCode: '2',
      dataList: [
        { name: '使用情景', code: '1' },
        { name: '知识点预览', code: '2' },
        { name: '试卷生成', code: '3' },
      ],
    }
  },

  created() {},
  methods: {
    redirectPage(item) {
      this.currCode = item.code
      if (item.code == '1') {
        this.$router.push({ path: '/smartpaper/userScence' })
      } else if (item.code == '2') {
        this.$router.push({ path: '/smartpaper/knowPreview' })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.div_bankRow {
  height: 20px;
  width: 100%;
}
.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 20px;
  :deep(.el-button) {
    width: 120px;
  }
}
.div_progress {
  width: 500px;
  margin: 0 auto;
  display: flex;
  border: 1px solid;
  margin-bottom: 20px;
  .div_item {
    flex: 1;
    height: 30px;
    border: none;
    border-right: 1px solid;
    &:last-child {
      border-right: none;
    }
  }
}
.addClass {
  background: skyblue;
}
</style>
