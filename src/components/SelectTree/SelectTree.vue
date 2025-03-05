<template>
  <div class="select-tree">
    <el-select
      ref="selectDom"
      :model-value="valueTitle"
      :disabled="disabled"
      :placeholder="placeholder"
    >
      <el-option
        :value="valueId"
        :label="valueTitle"
        class="options"
      >
        <el-tree
          id="tree-option"
          ref="selectTree"
          default-expand-all
          :indent="20"
          icon-class="icon-class-st"
          :expand-on-click-node="false"
          :data="options"
          :props="props"
          :node-key="props.value"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div style="width: 100%">
              <span
                v-if="data.name"
                class="select-tree-label"
                :class="data.treeid === valueId ? 'is-current-select' : ''"
              >
                {{ data.name }}
              </span>
              <span
                v-else
                style="display: block; text-align: center; color: #999"
              >无数据</span>
            </div>
          </template>
        </el-tree>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { ref, watch, onMounted, nextTick } from 'vue'

export default {
  name: 'ElTreeSelect',
  props: {
    // 配置项
    props: {
      type: Object,
      default: () => ({
        treeid: 'name', // ID字段名
        name: 'name', // 显示名称
        children: 'children', // 子级字段名
      }),
    },
    // 选项列表数据(树形结构的对象数组)
    options: {
      type: Array,
      default: () => [
        {
          treeid: 'name', // ID字段名
          name: 'name', // 显示名称
          children: 'children', // 子级字段名
        },
      ],
    },
    // disable
    disabled: {
      type: Boolean,
      default: false,
    },
    // 初始值
    value: {
      type: Object,
      default: () => ({
        valueId: null,
        valueTitle: '',
      }),
    },
    // 可清空选项
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择上级部门',
    },
  },
  emits: ['getValue'],
  setup(props, { emit, refs }) {
    const selectDom = ref(null)
    const selectTree = ref(null)
    const valueId = ref(null)
    const valueTitle = ref('')
    
    // 初始化值
    const initHandle = () => {
      if (valueId.value && selectTree.value.getNode(valueId.value)) {
        valueTitle.value = selectTree.value.getNode(valueId.value).data[props.props.name] // 初始化显示
        selectTree.value.setCurrentKey(valueId.value) // 设置默认选中
      }
      initScroll()
    }
    
    // 初始化滚动条
    const initScroll = () => {
      nextTick(() => {
        // let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        // let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        // scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        // scrollBar.forEach(ele => ele.style.width = 0)
      })
    }
    
    // 切换选项
    const handleNodeClick = (node) => {
      valueTitle.value = node[props.props.name]
      valueId.value = node[props.props.treeid]
      selectDom.value.blur()
      emit('getValue', node)
    }
    
    // Initialize data
    onMounted(() => {
      valueId.value = props.value.valueId // 初始值
      valueTitle.value = props.value.valueTitle
      initHandle()
    })
    
    // Watch for value changes
    watch(() => props.value, () => {
      initHandle()
    })
    
    return {
      selectDom,
      selectTree,
      valueId,
      valueTitle,
      handleNodeClick,
      initHandle,
      initScroll
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  /*.el-scrollbar .el-scrollbar__view .el-select-dropdown__item*/
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    padding-left: 0;
    padding-right: 0;
    margin-left: 10px;
    margin-right: 20px;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .icon-class-st {
    background-color: #ffffff;
  }
  .is-current-select {
    color: $color-theme !important;
  }
</style>
