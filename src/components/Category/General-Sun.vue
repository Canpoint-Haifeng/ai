<template>
  <div
    v-if="gradesData.length"
    class="user-category-content"
  >
    <label
      v-if="categoryLabel"
      :class="
        categoryLabel && categoryLabel.length >= 4
          ? 'category-label-4'
          : 'category-label'
      "
    >{{ categoryLabel }}</label>
    <div
      v-if="categoryData.length"
      class="category-list"
    >
      <div
        v-for="item in categoryData"
        :key="item.gradeId"
        class="category-item"
        :class="item.gradeId === currGradeId ? 'active' : ''"
        @click="selectGrade(item)"
      >
        {{ item.gradeName }}
      </div>
    </div>
    <p
      v-else
      class="text-empty"
    >
      暂无数据!
    </p>
  </div>
</template>

<script>
  export default {
  name: 'GeneralSun',
    props: {
      categoryLabel: {
        type: String,
        default: '',
      },
      categoryData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        currGradeId: 0,
        gradesData: [
          {
            gradeId: 0,
            gradeName: '全部',
          },
          {
            gradeId: 6,
            gradeName: '昨天',
          },
          {
            gradeId: 7,
            gradeName: '今天',
          },
          {
            gradeId: 8,
            gradeName: '本周',
          },
          {
            gradeId: 9,
            gradeName: '本月',
          },
        ],
      }
    },
    methods: {
      selectGrade(item) {
        this.currGradeId = item.gradeId
        this.$emit('selectGeneral', item.gradeId)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
