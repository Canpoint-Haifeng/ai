<template>
  <div
    class="stage-entrance-item"
    @click="openPaperCenter(node)"
  >
    <img
      class="item-background-image"
      :src="itemBackgroundItem.url"
      alt=""
    >
    <div
      class="entrance-item"
      :style="{ color: itemBackgroundItem.color }"
    >
      {{ node.name }}
    </div>
  </div>
</template>

<script>
  const imgConifgDict = {
    t1_0: {
      color: '#CD5923',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/c0e382a8-dbfc-4eb9-bab3-3e5f86d82a01.png',
    },
    t1_1: {
      color: '#2E78C6',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/13fd751f-8e6f-4c05-b5f4-63d61ac27449.png',
    },
    t1_2: {
      color: '#7650A1',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/4ac0c84a-b5ef-4735-9990-dfcb3bf2c025.png',
    },
    t1_3: {
      color: '#D95352',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/be5872be-49a8-4f70-b9c2-48279eef2902.png',
    },
    t2_0: {
      color: '#51A863',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/ac7536be-31c2-4cdf-97f6-0e2025a1108a.png',
    },
    t2_1: {
      color: '#D95352',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/6a99ac83-c60b-41c7-8514-91a6d978822f.png',
    },
    t2_2: {
      color: '#2E78C6',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/6ba5b825-1242-47c9-ac75-33118b1543e3.png',
    },
    t2_3: {
      color: '#CD5923',
      url: 'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/e3598c44-bec6-4dbf-bbde-dc307b29d28c.png',
    },
  }
  export default {
    props: {
      subIndex: {
        type: Number,
        default: 0,
      },
      type: {
        type: Number,
        default: 1,
      },
      node: {
        type: Object,
      },
    },
    data() {
      return {}
    },
    computed: {
      itemBackgroundItem() {
        let item =
          imgConifgDict['t' + this.type + '_' + this.subIndex] ||
          imgConifgDict['t1_0']
        return item
      },
    },
    methods: {
      openPaperCenter() {
        this.$emit('openPaperCenter', this.node)
      },
    },
  }
</script>

<style scoped lang="scss">
  .stage-entrance-item {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 164px;
    height: 120px;
    // background: #ffead1;
    border-radius: 10px;
    margin: 20px 0 0 20px;
    cursor: pointer;
    user-select: none;
    .item-background-image {
      width: 164px;
      height: 120px;
      transform: scale(1);
      transition: transform 0.3s;
    }
    .entrance-item {
      position: absolute;
      top: 20px;
      left: 13px;
      font-size: 16px;
      font-weight: bold;
      color: #cd5923;
      transition: top 0.3s;
    }

    &:hover {
      .item-background-image {
        transform: scale(1.1);
      }
      // .entrance-item {
      //   top: 35px;
      // }
    }
  }
</style>
