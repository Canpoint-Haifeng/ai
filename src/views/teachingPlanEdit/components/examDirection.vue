<template>
  <div>
    <el-dialog
      v-model:visible="visible"
      title="新增考向"
      width="480px"
    >
      <div class="exam_content">
        <h6>知识点：{{ info.name || "" }}</h6>
        <el-checkbox-group v-model="checkList">
          <!-- <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox> -->
          <el-checkbox
            v-for="item in pointList"
            :key="item.uuid"
            :label="item.uuid"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button
            type="primary"
            @click="onOK"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    info: {
      default: () => {
        return {}
      },
    },
    pointList: {
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      loading: false,
      checkList: [],
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    value(v) {},
  },
  mounted() {
    // this.getList();
  },
  methods: {
    close() {
      this.visible = false
      this.success = false
    },
    onOK(){
      this.visible = false;
      if (!this.checkList.length) {
        return 
      }
      this.$emit('onPoint', this.checkList)
    },
    onCancel(){
      this.visible = false
    }
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
:deep(.el-dialog) {
  .exam_content {
    padding: 30px 30px 0;
    h6 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #487fff;
    }
    .el-checkbox-group {
      .el-checkbox {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
