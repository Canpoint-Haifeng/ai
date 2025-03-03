<template>
  <div class="home-top-page-boxs">
    <div v-if="list && list.length">
      <div
        v-for="item in list"
        :key="item.id"
        class="home-page-box"
        @click="onOpenBlock(item)"
      >
        <img
          class="home-img"
          :src="item.iconImg"
          alt=""
        >
        <div class="home-block-name">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="home-page-box-skeleton" />
    </div>
  </div>
</template>

<script>
  import { isLogin } from '@/common/js/util'
  
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      },
    },
    emits: ['show-login'],
    setup(props, { emit }) {
      const onOpenBlock = (item) => {
        if (item.url) {
          window.open(item.url)
        }
        // Uncomment if login check is needed
        // if (isLogin()) {
        //   window.open(item.url)
        // } else {
        //   emit('show-login')
        // }
      }
      
      return {
        onOpenBlock
      }
    }
  }
</script>

<style scoped lang="scss">
  .home-top-page-boxs {
    text-align: center;
    padding-top: 45px;
    .home-page-box {
      display: inline-block;
      width: 150px;
      cursor: pointer;
    }
    .home-img {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      box-shadow: 0px 0px 16px 1px rgba(42, 77, 138, 0.08);
    }
    .home-block-name {
      font-size: 20px;
      line-height: 24px;
      font-weight: normal;
      color: #333333;
      padding-top: 20px;
    }

    .home-page-box-skeleton {
      width: 100%;
      height: 124px;
    }
  }
</style>
