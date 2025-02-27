<template>
  <div class="radio-group-container">
    <span class="title">{{ title }}</span>
    <el-radio-group
      v-model="selectedValue"
      class="single-radio-group"
      @change="handleChange"
    >
      <el-radio
        v-for="(option, index) in options"
        :key="index"
        :label="option.value"
      >
        {{ option.label }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadioGroup',
  props: {
    title: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    value: { // Vue 2 中使用 v-model 时绑定的属性是 value
      type: [String, Number],
      required: true
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleChange(value) {
      this.selectedValue = value
    }
  },
}
</script>

<style lang="scss">
  @use "@/assets/css/variables" as *;
.radio-group-container {
  display: flex;
  align-items: center;
  font-family: Microsoft YaHei, Microsoft YaHei;
}

.title {
  margin-right: 30px;
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  line-height: 0px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
.single-radio-group {
  font-family: Microsoft YaHei, Microsoft YaHei;
  color: #333333;
  font-weight: normal;
  font-style: normal;
  text-transform: none;
  .el-radio__label {
    padding-left: 5px;

  }
}
</style>