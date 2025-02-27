import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
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
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "CpSubjectSelect",
  setup() {
    const options = ref([
      { value: "010101", label: "语文" },
      { value: "010201", label: "数学" },
      { value: "010301", label: "英语" }
    ])
    
    return {
      options
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.cp-subject-select {
  display: inline-block;
  width: 100%;
}
</style>
