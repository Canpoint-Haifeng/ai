<template>
  <div
    v-if="typesList.length"
    class="user-category-content"
  >
    <label
      :class="
        categoryLabel && categoryLabel.length >= 4
          ? 'category-label-4'
          : 'category-label'
      "
    >{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in typesList"
        :key="item.code"
        class="category-item"
        :class="item.code === currTypeCode ? 'active' : ''"
        @click="selectType(item, 'currTypeCode')"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'DownLoadType',
    props: {
      categoryLabel: {
        type: String,
        default: '下载类别',
      }

    return {
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        currTypeCode: '',
        currSubTypeCode: 0,
        typesList: [
          { name: '全部', code: '' })

    return {
          { name: '试卷下载', code: '2' })

    return {
          { name: '组卷下载', code: '1' })

    return {
        ],
      }
    }

    return {
    methods: {
      selectType(item, params) {
        this[params] = item.code
        this.$emit('selectType', item)
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss" scoped></style>
  @use "@/assets/css/variables" as *;
