<template>
  <div class="filter">
    <span>{{ label }}</span>
    <div class="list">
      <div
        class="item"
        :class="{ 'active': values[0] === '' && !multiple }"
        @click="checkAll"
      >
        全部
      </div>
      <div
        v-for="(v, i) in list"
        :key="i"
        class="item"
        :class="{ 'active': values.includes(v.value) }"
        @click="check(v)"
      >
        {{ v.label }}
      </div>
      <template v-if="allowMultiple">
        <el-button
          v-if="multiple"
          type="text"
          @click="multiple = false"
        >
          取消多选
        </el-button>
        <el-button
          v-else
          type="text"
          icon="el-icon-plus"
          @click="multiple = true"
        >
          多选
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: ['label', 'list', 'allowMultiple'],
  data() {
    return {
      multiple: false,
      values: [''],
    }
  },
  watch: {
    multiple(v) {
      if (!v && this.values.length > 1) {
        this.values = ['']
      }
    },
    values(v) {
      this.$emit('change', v.join())
    }
  },
  methods: {
    checkAll() {
      this.values = ['']
      this.multiple = false
    },
    check(v) {
      if (this.multiple) {
        if (this.values.includes(v.value)) {
          this.values = this.values.filter(i => i !== v.value)
        } else {
          this.values.push(v.value)
        }
      } else {
        if (this.values[0] === v.value) return
        this.values = [v.value]
      }
      if (v.value) {
        this.values = this.values.filter(Boolean)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.filter {
  display: flex;
  margin-bottom: 8px;

  >span {
    font-weight: bold;
    font-size: 14px;
    margin-right: 30px;
    line-height: 24px;
  }

  .list {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    flex: 1;

    .item {
      border-radius: 12px;
      line-height: 24px;
      padding: 0 15px;
      margin: 0 4px 12px 0;
      cursor: pointer;
      transition: all .2s;

      &:not(.active):hover {
        color: #487FFF;
      }

      &.active {
        background: #487FFF;
        color: #fff;
      }
    }

    :deep(.el-button) {
      margin-left: auto;
      padding: 0;

      span {
        margin-left: 3px;
      }
    }
  }
}
</style>
