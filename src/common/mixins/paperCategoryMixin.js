import PaperType from '@/components/Category/PaperType'
import PaperTypeAll from '@/components/Category/PaperTypeAll'
import Grade from '@/components/Category/Grade'
import Years from '@/components/Category/Years'
import Areas from '@/components/Category/Areas'
import PaperTimes from '@/components/Category/PaperTimes'
import CategoryList from '@/components/Category/CategoryList'


const paperCategoryMixin = {
  data() {
    return {
      currTypeCode: '',
      currGradeCode: '',
      currYearCode: '',
      currAreaCode: '',
      currTimesCode: [],
      currGradeVolumeCode: '',
      currVersionCode: '',
      currDiffCode: '',
    }
  },
  methods: {
    onSelectVersion(item) {
      this.currVersionCode = item.code
      this.currGradeVolumeCode = ''
      this.gradeCurrentCode = ''
      this.resetSearchParam()
    },
    // 监听选择试卷类型
    onSelectType(item) {
      this.currTypeCode = item.code
      this.resetSearchParam()
    },
    // 监听选择年级
    onSelectGrade(item) {
      this.currGradeCode = item.code
      this.resetSearchParam()
    },
    // 监听选择年级册别
    onSelectGradeVolume(item) {
      console.log('aaaaaaa', item)
      this.currGradeVolumeCode = item.volumeCode
      this.resetSearchParam()
    },
    // 监听选择年份
    onSelectYear(item) {
      this.currYearCode = item.code
      this.resetSearchParam()
    },
    onSelectDiff(item) {
      this.currDiffCode = item.code
      this.resetSearchParam()
    },
    // 监听选择地区
    onSselectArea(item) {
      this.currAreaCode = item.code
      this.resetSearchParam()
    },
    onSelectTimes(item) {
      this.currTimesCode = item
      this.resetSearchParam()
    },
  },
  components: {
    PaperType,
    Grade,
    Years,
    Areas,
    PaperTimes,
    CategoryList,
    PaperTypeAll,
  },
}
export default paperCategoryMixin
