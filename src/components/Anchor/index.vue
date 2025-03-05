<template>
  <div class="anchor-container">
    <div class="anchor-list">
      <div
        v-for="(item, index) in anchorList"
        :key="index"
        class="anchor-item"
        :class="{ active: activeIndex === index }"
        @click="scrollToAnchor(index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useAnchor } from './composition/useAnchor'

export default defineComponent({
  name: 'Anchor',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { activeIndex, anchorList, scrollToAnchor } = useAnchor()
    
    // Initialize anchor list from props
    anchorList.value = props.list
    
    return {
      activeIndex,
      anchorList,
      scrollToAnchor
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.anchor-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  
  .anchor-list {
    background: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 0;
    
    .anchor-item {
      padding: 8px 16px;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s;
      
      &:hover {
        color: #487fff;
      }
      
      &.active {
        color: #487fff;
        background: #f5f7fa;
      }
    }
  }
}
</style>
