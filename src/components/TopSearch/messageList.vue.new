<template>
  <transition name="el-zoom-in-top">
    <div
      v-show="isShow"
      class="messageList"
      :class="{
        addClass: currSearchOption == '1',
        paperHeight: currSearchOption == '2',
      }"
    >
      <div v-if="historyList.length">
        <div class="div_header">
          <span class="span_title"> 搜索历史 </span>
          <!--优先级  mousedown > blur > click  需要理解鼠标事件的 顺序-->
          <span
            class="span_clear"
            @mousedown="clear"
          > 清空 </span>
        </div>
        <!-- 搜索历史 -->
        <div class="div_history">
          <div
            v-for="(item, index) in historyList"
            :key="index"
            class="div_item"
          >
            <!-- 最多可显示15个文字 -->
            <span
              class="span_name"
              :title="item"
              @mousedown="changeHistoryText(item)"
            >{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- tab切换到试卷的时候才显示 -->
      <div
        v-if="currSearchOption == '2'"
        class="div_recommend"
      >
        <span class="span_title">试卷推荐</span>
        <i class="iconfont iconfire_fill icont-tip" />
        <ul>
          <li
            v-for="(item, index) in value"
            :key="item.paperId"
          >
            <div
              :class="{
                div_item_tag: index + 1 >= 4,
                div_tag_bg: index + 1 < 4,
              }"
            >
              <span
                v-if="index >= 3"
                class="span1"
              >
                {{ index + 1 }}
              </span>
            </div>
            <span
              class="span2"
              :title="item.paperName"
              @mousedown="changePaperName(item)"
            >
              {{ item.paperName }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MessageList',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    currSearchOption: {
      type: Number,
      default: 1,
    },
    historyList: {
      type: Array,
      default: () => {
        return []
      },
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clearList', 'changeHistoryText', 'changePaperName'],
  setup(props, { emit }) {
    // Methods
    const clear = (event) => {
      // 点击清除后 ，input 不失焦
      event.preventDefault()
      emit('clearList')
    }
    
    const changeHistoryText = (item) => {
      console.log('底层事件触发')
      emit('changeHistoryText', item)
    }
    
    const changePaperName = (item) => {
      emit('changePaperName', item)
      console.log(item, 'item--')
    }
    
    return {
      clear,
      changeHistoryText,
      changePaperName
    }
  }
})
</script>

<style lang="scss" scoped>
.messageList {
  position: absolute;
  right: 0px;
  top: 46px;
  width: 628px;
  //   min-height: 208px;
  background: #ffffff;
  box-shadow: 0px 0px 30px 1px rgba(27, 50, 89, 0.2);
  border-radius: 12px;
  border: 1px solid #c1c9cd;
  z-index: 9999;
  padding: 20px 20px;
  margin-top: 8px;
  box-sizing: border-box;
  .div_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .span_clear {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      color: #8590a6;
      cursor: pointer;
      user-select: none;
    }
  }
  .div_history {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .div_item {
      //   width: 80px;
      //   line-height: 28px;
      line-height: 14px;
      text-align: center;
      padding: 7px 12px;
      background: #f5f5f5;
      border-radius: 10px 10px 10px 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(n + 5) {
        margin-bottom: 0px;
      }
      span {
        color: #333333;
        font-size: 14px;
        display: block;
        max-width: 222px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
  .span_title {
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #8590a6;
  }
  .div_recommend {
    text-align: left;
    .icont-tip {
      padding-left: 6px;
      color: #ff985d;
    }
  }
  ul {
    padding-top: 10px;
    li {
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 10px;
      color: #333333;
      font-size: 14px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0px;
      }
      .span2 {
        padding-left: 10px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .div_item_tag {
        width: 12px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        background: #eeeeee;
        border-radius: 2px 2px 2px 2px;
        text-align: center;
        .span1 {
          color: #333333;
        }
      }
      .div_tag_bg {
        width: 12px;
        height: 18px;
        text-align: center;
      }
      &:first-child {
        .div_tag_bg {
          background: url('../../assets/images/tag_one.png');
        }
      }

      &:nth-child(2) {
        .div_tag_bg {
          background: url('../../assets/images/tag_two.png');
        }
      }
      &:nth-child(3) {
        .div_tag_bg {
          background: url('../../assets/images/tag_three.png');
        }
      }
    }
  }
}
.addClass {
  height: 172px;
}
.paperHeight {
  min-height: 208px;
}
</style>
