<template>
  <div>
    <div
      v-if="index <= 3"
      :class="'rank_no_' + index"
    />
    <div
      v-else
      class="rank_no_default"
    >
      {{ index }}
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'CpRankIndex',
    props: {
      index: {
        type: Number,
        default: 1,
      }
    }
  })
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .rank_no_1 {
    width: 23px;
    height: 18px;
    background-image: url(../../../assets/images/index/rank/1.png);
    background-size: 23px 18px;
    background-repeat: no-repeat;
  }
  .rank_no_2 {
    width: 23px;
    height: 18px;
    background-image: url(../../../assets/images/index/rank/2.png);
    background-size: 23px 18px;
    background-repeat: no-repeat;
  }
  .rank_no_3 {
    width: 23px;
    height: 18px;
    background-image: url(../../../assets/images/index/rank/3.png);
    background-size: 23px 18px;
    background-repeat: no-repeat;
  }
  .rank_no_default {
    width: 18px;
    height: 18px;
    margin-left: 2px;
    background: #ccd4da;
    border-radius: 4px;
    font-size: 12px;
    color: #ffffff;
    line-height: 18px;
    width: 18px;
    text-align: center;
  }
</style>

