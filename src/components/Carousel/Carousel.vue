<template>
  <div class="app-carousel">
    <el-carousel :height="height" :autoplay="true" :interval="interval">
      <el-carousel-item v-for="(item, index) in imgsData" :key="index">
        <img :src="item.pictureUrl" alt="img" @click="tapItem(item)" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    props: {
      height: {
        type: String,
        default: '232px',
      },
      interval: {
        type: Number,
        default: 5000,
      },
      imgsData: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    methods: {
      tapItem(item) {
        if (item.detailUrl) {
          this.openWindowLink(item.detailUrl)
        }
        this.$emit('clickTabItem', item)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .app-carousel {
    width: 100%;
    height: 100%;
    /deep/.el-carousel {
      border-radius: 6px;
      &.el-carousel--horizontal {
        overflow-y: hidden;
      }
      .el-carousel__container {
        .el-carousel__item {
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .el-carousel__indicator {
        .el-carousel__button {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #fff;
        }
      }
      .is-active {
        .el-carousel__button {
          width: 40px;
          border-radius: 5px;
        }
      }
    }
  }
</style>
