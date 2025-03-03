<template>
  <div
    v-if="gradesList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in gradesList"
        :key="item.code"
        class="category-item"
        :class="item.code == currGradeCode ? 'active' : ''"
        @click="selectType(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
export default {
  name: 'SyncBookType',
    props: {
        /* currGradeCode: {
        type: String || Number,
        default: 0
      }, */
        categoryLabel: {
            type: String,
            default: '类型',
        },
        // 是否显示全部
        isShowAll: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            currGradeCode: 0,
            gradesList: [],
        }
    },
    computed: {
        ...mapState(['currSubject']),
    },
    watch: {
        currSubject() {
            this.getTypesList()
        },
    },
    created() {
        this.getTypesList()
    },
    methods: {
        //去重
        returnDistinct(data) {
            let newArrId = []
            let newArrObj = []
            data.forEach(item => {
                if (newArrId.indexOf(item.code) == -1) {
                    newArrId.push(item.code)
                    newArrObj.push(item)
                }
            })
            console.log(newArrObj);
            return newArrObj
        },
        getTypesList() {
            let params = {
                stage: this.currSubject.periodCode,
                subject: this.currSubject.subjectCode,
            }
            this.apiGet({ urlPath: '/paper-builder/config/getBookType' }).then(res => {
                if (res.code === CTS.constant.SUCCESS_CODE) {
                    let arrData = []
                    res.data.paperScene.forEach(item => {
                        arrData.push({ 'code': item.id, 'name': item.name })
                    })
                    if (this.isShowAll) {
                        arrData.unshift({
                            code: 0,
                            name: '全部',
                        })
                    }
                    this.gradesList = this.returnDistinct(arrData)
                }
            })
        },

        selectType(item) {
            this.currGradeCode = item.code
            this.$emit('selectType', item)
        },
    },
}
</script>

<style lang="scss" scoped>
.category-content {
    @include flex();

    .category-label {
        width: 35px;
        line-height: 24px;
        align-self: flex-start;
        margin-right: 13px;
        color: $color-text-d;
        font-weight: 700;
    }

    .category-list {
        width: 855px;

        .category-item {
            display: inline-block;
            padding: 5px 16px;
            margin: 0 4px 12px 4px;
            border-radius: 16px;
            cursor: pointer;
            transition: 0.2s;

            &:hover {
                color: $color-theme;
            }

            &.active {
                background: $color-theme;
                color: $color-white;
            }
        }

        .sub-category-list {
            width: 100%;
        }

        .sub-category-item {
            display: inline-block;
            padding: 4px 16px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: 0.2s;
            color: $color-text;

            &:hover,
            &.active {
                color: $color-theme;
            }
        }
    }
}
</style>
