<template>
  <div class="check-knowledge">
    <li
      v-for="(value, index) in knowledge"
      :key="index"
    >
      <span v-html="value.name" />
      <i
        v-if="showClose"
        class="iconfont icon-close_line"
        @click="deleteCheckNode(value)"
      />
    </li>
  </div>
</template>

<script>
  export default {
    props: {
      knowledge: {
        type: Array,
        default: () => {
          return {}
        },
      },
      showClose: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      deleteCheckNode(value) {
        this.knowledge.splice(
          this.knowledge.findIndex(
            (item) => String(item.code) === String(value.code),
          ),
          1,
        )
        // this.$emit('deleteCheckNode',value)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .check-knowledge {
    padding-top: 10px;
    text-align: center;
    li {
      display: inline-block;
      line-height: 28px;
      padding: 0 10px;
      margin-right: 10px;
      margin-bottom: 5px;
      background: #ebf2fb;
      border-radius: 16px;
      i {
        font-size: 10px;
        margin-left: 15px;
      }
    }
    li:hover {
      cursor: pointer;
      background: #dce9fb;
      i {
        color: $color-theme;
      }
    }
  }
</style>
