<template>
  <ul class="school-resource-tabs">
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

    return {
    setup() {
      const state = reactive({
        currentPath: '',
      }
    }

    return {
    watch: {
      defaultPath(v) {
        this.currentPath = v
      }

    return {
    }

    return {
    mounted() {
      this.currentPath = this.defaultPath
    }

    return {
    methods: {
      goLinkRoute(row) {
        this.currentPath = row.path
        this.$router.push(this.currentPath)
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .school-resource-tabs {
    li {
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      width: 80px;
      height: 20px;
      padding-top: 25px;
      padding-bottom: 21px;
      span {
        text-align: center;
        display: inline-block;
        position: absolute;
        padding-bottom: 10px;
        user-select: none;
        color: #666666;
      }
      span.active {
        color: #338ffd;
      }
      // .active {
      //   border-bottom: 2px solid #487FFF;
      // }
      .active::after {
        content: '';
        width: 50%;
        height: 1px;
        display: block;
        padding-top: 10px;
        margin: 0 auto;
        border-bottom: 2px solid #338ffd;
      }
    }

    > li:not(:first-child) {
      margin-left: 50px;
    }
  }
})
</style>
