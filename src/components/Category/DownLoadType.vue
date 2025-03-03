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
  export default {
  name: 'DownLoadType',
    props: {
      categoryLabel: {
        type: String,
        default: '下载类别',
      },
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        currTypeCode: '',
        currSubTypeCode: 0,
        typesList: [
          { name: '全部', code: '' },
          { name: '试卷下载', code: '2' },
          { name: '组卷下载', code: '1' },
        ],
      }
    },
    methods: {
      selectType(item, params) {
        this[params] = item.code
        this.$emit('selectType', item)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
