<template>
  <!-- <div class="chat-container" > -->
  <!-- 触发按钮 -->
  <!-- <el-button class="button-ai"  type="text"  @click="togglePopover($event)">
      AI6
    </el-button> -->

  <!-- 弹框 -->
  <div
    class="popover-box"
    :style="{ top: y + 'px', left: x + 'px' }"
    @click.stop
  >
    <!-- 输入框 -->
    <el-input
      v-model="inputText"
      placeholder="输入问题，或从下方选择场景提问..."
      class="custom-input"
      @focus="showOptions = true"
      @blur="hideOptionsWithDelay"
    >
      <template #prefix>
        <div class="prefix-icon">
          <!-- <i class="el-icon-magic-stick"></i> AI -->
          <img
            src="../../../assets/images/ai/bling_fill.png"
            alt="AI备课"
          >
        </div>
      </template>

      <template #suffix>
        <div class="suffix-icons">
          <i
            class="el-icon-circle-close close-icon"
            @click="clearInput"
          />

          <img
            src="../../../assets/images/ai/send_fill.png"
            alt="AI备课"
            @click="sendChat"
          >


          <!-- <i class="el-icon-position right-icon"></i> -->
        </div>
      </template>
    </el-input>

    <!-- 选项菜单 -->
    <div
      v-show="showOptions"
      class="menu-options"
    >
      <div
        class="menu-title"
        @click="selectOption('继续写')"
      >
        <img
          src="../../../assets/images/ai/jxx.png"
          alt="AI备课"
        >
        <span>继续写</span>

        <div class="menu-name">
          {{ curChatParent.name || "" }}
        </div>
      </div>
      <div
        class="menu-title"
        @click="selectOption('缩写')"
      >
        <img
          src="../../../assets/images/ai/sx.png"
          alt="AI备课"
        > <span>缩写</span>
        <div class="menu-name">
          {{ curChatParent.name || "" }}
        </div>
      </div>
      <div
        class="menu-title"
        @click="selectOption('扩写')"
      >
        <img
          src="../../../assets/images/ai/kx.png"
          alt="AI备课"
        > <span>扩写</span>
        <div class="menu-name">
          {{ curChatParent.name || "" }}
        </div>
      </div>
      <div
        class="menu-title"
        @click="selectOption('润色')"
      >
        <img
          src="../../../assets/images/ai/rs.png"
          alt="AI备课"
        > <span>润色</span>
        <div class="menu-name">
          {{ curChatParent.name || "" }}
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
export default {
  props: {
    // value: {
    //   type: Boolean,
    //   default: false,
    // },

    x: Number,
    y: Number,
    curChatParent: {
      type: Object,
      default() {
        return {};
      }

    }

  },

  data() {
    return {
      inputText: "",
      showOptions: false,
      hideTimeout: null,
      popoverPosition: { top: 0, left: 0 },
    };
  },

  computed: {
  },
  methods: {
    togglePopover(event) {
      event.stopPropagation(); // 阻止事件冒泡，防止触发 handleClickOutside

      this.$emit('onChat')
      // this.showPopover = !this.showPopover; // 切换显示状态
    },
    hideOptionsWithDelay() {
      // this.hideTimeout = setTimeout(() => {
      //   // this.showOptions = false;
      // }, 200)
    },
    clearInput() {
      this.inputText = ""
      // this.showOptions = false;
    },
    selectOption(option) {
      // this.inputText = option
      // this.showOptions = false;
      this.$emit('onChat', option)
    },
    sendChat() {
      this.$emit('onChat', this.inputText)

    }
    // handleClickOutside(event) {
    //   const popoverEl = this.$refs.popoverBox&&this.$refs.popoverBox.$el || this.$refs.popoverBox; 
    //   // 如果弹框存在，并且点击的不是弹框内部，则关闭3
    //   if (popoverEl && !popoverEl.contains(event.target)) {
    //     this.showPopover = false;
    //   }
    // },
  },
  // mounted() {
  //   document.addEventListener("click", this.handleClickOutside);
  // },
  // beforeUnmount() {
  //   document.removeEventListener("click", this.handleClickOutside);
  // },
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  /* bottom:-100px;
  right: 60px;  */
  z-index: 99;
  display: flex;
}


.popover-box {

  position: fixed;
  width: 600px;
  z-index: 99;
  /* bottom:30px;
  right:90px; */
  /* background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000; */
}

/* 自定义输入框 */
.custom-input :deep(.el-input__inner) {
  height: 50px;
  border-radius: 14px;
  padding-left: 50px;
  padding-right: 70px;
  border: 2px solid #8B70FC;
  /* box-shadow: 0 0 8px rgba(167, 158, 240, 0.6); */
  font-size: 12px !important;
}

/* AI 图标 */
.prefix-icon {
  display: flex;
  height: 100%;
  align-items: center;
  color: #9b82f3;
  /* font-size: 14px;
  font-weight: bold; */
  margin-left: 10px;

  img {
    width: 24px;
    height: 24px;
  }
}

/* 右侧图标 */
.suffix-icons {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
  margin-left: 14px;

  img {
    width: 24px;
    height: 24px;
  }

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

.menu-options {

  width: 200px;

  background: #FFFFFF;
  box-shadow: 0px 3px 20px 1px rgba(0, 0, 0, 0.05);
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #E2E2E2;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
}

/* 单个选项样式 */
.menu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease-in-out;
}

/* 左侧图标 */
.menu-title img {
  /* margin-right: 20px; */
}

/* 鼠标悬停效果 */
.menu-title:hover {
  background: #f9f9f9;
  /* 淡紫色背景 */
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
  background: #f9f9f9;
}

.menu-name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 20px;
  background: #ECEFF3;
  border-radius: 4px 4px 4px 4px;
}
</style>
