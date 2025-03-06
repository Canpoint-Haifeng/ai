<template>
  <div class="cp-subject-select">
    <el-select
      v-model="selectedSubject"
      placeholder="请选择学科"
      @change="handleChange"
    >
      <el-option
        v-for="item in subjectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'CpSubjectSelect',
  emits: ['change-subject'],
  setup(props, { emit }) {
    const selectedSubject = ref('')
    const subjectOptions = ref([
      { value: '010101', label: '语文' },
      { value: '010201', label: '数学' },
      { value: '010301', label: '英语' },
      { value: '010401', label: '物理' },
      { value: '010501', label: '化学' },
      { value: '010601', label: '生物' },
      { value: '010701', label: '历史' },
      { value: '010801', label: '地理' },
      { value: '010901', label: '政治' }
    ])

    const handleChange = (value) => {
      emit('change-subject', value)
    }

    const clearSubject = () => {
      selectedSubject.value = ''
    }

    return {
      selectedSubject,
      subjectOptions,
      handleChange,
      clearSubject
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.cp-subject-select {
  display: inline-block;
  width: 100%;
}
</style>

