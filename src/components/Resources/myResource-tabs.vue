<template>
  <ul class="school-myResource-tabs">
    <li
      v-for="sub of tabsData"
      :key="sub.name"
      @click="goLinkRoute(sub)"
    >
      <span :class="{ active: sub.path == currentPath }">{{ sub.name }}</span>
    </li>
  </ul>
</template>
<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  props: {
    defaultPath: String,
    tabsData: {
      type: Array,
      default: () => {
        return []
      }

    return {
    }

    return {
  }
})

    return {
  setup() {
    const state = reactive({
      currentPath: '',
    }
  }
})

    return {
  watch: {
    defaultPath(v) {
      this.currentPath = v
    }

    return {
  }
})

    return {
  mounted() {
    this.currentPath = this.defaultPath
  }
})

    return {
  methods: {
    goLinkRoute(row) {
      this.currentPath = row.path
      this.$router.push(this.currentPath)
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.school-myResource-tabs {
  display: flex;

  li {
    display: flex;
    cursor: pointer;
    position: relative;
    margin: 10px;
    width: 82px;
    height: 26px;

    span {
      font-weight: normal;
      font-size: 20px;
      text-align: center;
      align-items: center;
      color: #666666;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    span.active {
      color: #333333;
    }

    // .active {
    //   border-bottom: 2px solid #487FFF;
    // }
    .active::after {
      content: '';
      width: 40px;
      height: 2px;
      display: block;
      margin: 8px auto 0;
      background: #487FFF;
    }
  }
})

  >li:not(:first-child) {
    margin-left: 50px;
  }
})
}
</style>
