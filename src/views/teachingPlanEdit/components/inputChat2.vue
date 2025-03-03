<template>
  <div class="input-container">
    <el-button
      class="button-ai"
      type="text"
      @click="togglePopover($event)"
    >
      AI6
    </el-button>
    <div
      v-if="true"
      ref="popoverBox"
      class="popover-box"
      @click.stop
    >
      <!-- 输入框 -->
      <el-popover
        v-model="showOptions"
        class="input-box"
        placement="bottom-start"
        width="400"
        trigger="manual"
      >
        <!-- 菜单内容 -->
        <div class="menu-options">
          <div
            class="menu-title"
            @click="selectOption"
          >
            继续写
          </div>
          <div
            class="menu-title"
            @click="selectOption"
          >
            缩写
          </div>
          <div
            class="menu-title"
            @click="selectOption"
          >
            扩写
          </div>
          <div
            class="menu-title"
            @click="selectOption"
          >
            润色
          </div>
        </div>

        <!-- 输入框 (激活弹出框) -->
        <template #reference>
          <el-input
            v-model="inputText"
            placeholder="输入问题，或从下方选择场景提问..."
            class="custom-input"
            @focus="showOptions = true"
            @blur="hideOptionsWithDelay" 
          >
            <template #prefix>
              <div class="prefix-icon">
                <i class="el-icon-magic-stick" /> AI
              </div>
            </template>

            <!-- 右侧图标 -->
            <template #suffix>
              <div class="suffix-icons">
                <i
                  class="el-icon-circle-close close-icon"
                  @click="clearInput"
                />
                <i class="el-icon-position right-icon" />
              </div>
            </template>
          </el-input>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
export default {
  setup() {
    const inputText = ref("")
    const showOptions = ref(false)
    const hideTimeout = ref(null)
    const showInput = ref(false)
    const showPopover = ref(false)
    const popoverBox = ref(null)
    
    const clearInput = () => {
      inputText.value = "";
      showOptions.value = true
    }
    
    const hideOptionsWithDelay = () => {
      hideTimeout.value = setTimeout(() => {
        showOptions.value = false;
      }, 200) // 200ms 延迟防止误触
    }
    
    const chatAI6 = () => {
    }
    
    // 切换输入框的显示状态
    const togglePopover = (event) => {
      event.stopPropagation(); // 阻止事件冒泡
      showPopover.value = true;
    }
    
    // 监听点击外部，隐藏输入框
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (popoverBox.value && !popoverBox.value.contains(event.target)) {
          showPopover.value = false;
        }
      }, 50);
    }
    
    const selectOption = () => {
    }
    
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    })
    
    return {
      inputText,
      showOptions,
      hideTimeout,
      showInput,
      showPopover,
      popoverBox,
      clearInput,
      hideOptionsWithDelay,
      chatAI6,
      togglePopover,
      handleClickOutside,
      selectOption
    }
};
</script>

<style scoped>
.input-container {
  position: relative;
  /* width: 400px; */
}
.input-box{
  position: absolute;
  top:30px;
  left:-90px;
  width: 400px;
}

/* 输入框圆角 */
.custom-input :deep(.el-input__inner) {
  border-radius: 20px;
  font-size: 12px;
}
}

/* 弹出菜单样式 */
.menu-options {
  padding: 10px;
  display: flex;
  flex-direction: column;
}
/* .menu-options {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
} */

/* 单个选项样式 */
.menu-title {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 让图标和按钮分开 */
  padding: 6px 12px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
}


/* 鼠标悬停效果 */
.menu-title:hover {
  background: #f0e6f6; /* 淡紫色背景 */
  color: #333;
}

/* 右侧按钮 */
.menu-title button {
  background: #ececec;
  border: none;
  padding: 4px 8px;
  font-size: 12px;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
}

.menu-title button:hover {
  background: #ddd;
}
/* 让输入框更圆滑 */
.custom-input :deep(.el-input__inner) {
  border-radius: 20px;
  padding-left: 50px;
  /* 避免左侧 AI 图标遮挡 */
  padding-right: 70px;
  /* 避免右侧两个图标遮挡 */
  border: 1px solid #a79ef0;
  /* 自定义边框颜色 */
  box-shadow: 0 0 8px rgba(167, 158, 240, 0.6);
  font-size: 12px !important;
}

/* 左侧 AI 图标 */
.prefix-icon {
  display: flex;
  height: 100%;
  align-items: center;
  color: #9b82f3;
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
}

/* 右侧图标组 */
.suffix-icons {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

/* 关闭按钮 */
.close-icon {
  cursor: pointer;
  color: #aaa;
}

.close-icon:hover {
  color: #555;
}

/* 发送按钮 */
.right-icon {
  cursor: pointer;
  color: #9b82f3;
  font-size: 18px;
}

.right-icon:hover {
  color: #6c4de0;
}
</style>
