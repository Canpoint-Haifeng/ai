<template>
  <span
    class="multi-choice"
    @click="change"
  >
    <span
      v-if="!isMulti"
      class="multi"
    ><span class="add">+</span>多选</span>
    <span
      v-else
      class="cancel"
    >取消</span>
  </span>
</template>

<script>
  export default {
  name: 'MultipleChoiceRadio',
    props: {
      isMulti: Number,
    },
    data() {
      return {}
    },
    methods: {
      change() {
        this.$emit('change')
      },
    },
  }
</script>

<style scoped lang="scss">
  .multi-choice {
    display: inline-block;
    padding: 0 4px 12px 4px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    .multi {
      background: #eff5ff;
      border: 1px solid #bcd7ff;
      display: inline-block;
      line-height: 23px;
      width: 65px;
      border-radius: 4px;
      color: $color-theme;
    }
    .cancel {
      border: 1px solid #e2e2e2;
      background-color: #f2f2f2;
      display: inline-block;
      line-height: 23px;
      width: 65px;
      border-radius: 4px;
      color: #999999;
    }
    .add {
      font-weight: bold;
      font-size: 16px;
      padding-right: 2px;
      line-height: 20px;
    }
  }
</style>
