import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <base-dialog
    ref="contributeDialog"
    title="投稿信息确认"
    @comfirm="handleConfirm"
  >
    <template #dialogTips>
      <el-form
        ref="ruleForm"
        :model="localForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="稿件名称:">
          <div style="text-align: left;">
            {{ localForm.name }}
          </div>
        </el-form-item>
        <el-form-item label="学段学科:">
          <div style="text-align: left;">
            {{ localForm.stage }}{{ localForm.subject }}
          </div>
        </el-form-item>
        <el-form-item label="教案类型:">
          <div style="text-align: left;">
            {{ lessonType[form.lessonType] }}
          </div>
        </el-form-item>
        <el-form-item
          label="适用难度:"
          prop="suitType"
        >
          <el-radio-group
            v-model="localForm.suitType"
            style="display: flex;align-items: center;height: 32px;"
          >
            <el-radio :label="1">
              基础课
            </el-radio>
            <el-radio :label="2">
              标准课
            </el-radio>
            <el-radio :label="3">
              拔高课
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
</template>

<script>
import { ref, watch, onMounted, defineComponent } from "vue"

export default defineComponent({
  name: "ContributeDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const dialogVisible = ref(props.visible)
    
    watch(() => props.visible, (val) => {
      dialogVisible.value = val
    })
    
    watch(() => dialogVisible.value, (val) => {
      emit("update:visible", val)
    })
    
    return {
      dialogVisible
    }
  }
})
</script>
