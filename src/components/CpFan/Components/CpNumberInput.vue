<template>
  <div class="cp-number-input">
    <el-input-number
      v-model="inputValue"
      :min="min"
      :max="max"
      :step="step"
      :precision="precision"
      :controls="controls"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'CpNumberInput',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    precision: {
      type: Number,
      default: 0
    },
    controls: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue)
    
    watch(() => props.modelValue, (val) => {
      inputValue.value = val
    })
    
    const handleChange = (value) => {
      emit('update:modelValue', value)
      emit('change', value)
    }
    
    return {
      inputValue,
      handleChange
    }
  }
})
</script>
