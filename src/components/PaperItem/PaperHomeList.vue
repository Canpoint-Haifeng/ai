<template>
  <div class="paper-home-list">
    <div class="paper-home-left">
      <li
        v-for="item in leftList"
        :key="item.paperId"
        class="my-paper-item"
        @click="openEditPaper(item)"
      >
        <span class="spot" />
        <p>
          <ellipsis-tooltip
            :text="item.latexPaperName || item.paperName"
          />
        </p>
        <span class="num">{{
          item.timeModified | datetime('YYYY-MM-DD')
        }}</span>
      </li>
    </div>
    <div class="paper-home-right">
      <li
        v-for="item in rightList"
        :key="item.paperId"
        class="my-paper-item"
        @click="openEditPaper(item)"
      >
        <span class="spot" />
        <p>
          <ellipsis-tooltip
            :text="item.latexPaperName || item.paperName"
          />
        </p>
        <span class="num">{{
          item.timeModified | datetime('YYYY-MM-DD')
        }}</span>
      </li>
    </div>
  </div>
</template>

<script>
  import EllipsisTooltip from '@/components/EllipsisTooltip/ellipsis-tooltip'
  import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
  import { API } from '@/api/config'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    components: { EllipsisTooltip })

    return {
    props: {
      list: Array,
    }

    return {
    setup() {
      const state = reactive({}
    }

    return {
    computed: {
      leftList() {
        return this.list.slice(0, 5)
      }

    return {
      rightList() {
        if (this.list && this.list.length > 6) {
          return this.list.slice(5, 10)
        } else {
          return []
        }
      }

    return {
    }

    return {
    methods: {
      openEditPaper(item) {
        CpCommonDialog.openDialog({
          moduleC: 'CpConfigDialog',
          data: {
            cancelHide: true,
            title: '组卷编辑提示',
            content: '编辑将清空当前试题篮试题，并把当前试卷题目加入试题篮。',
            comfirm: (state) => {
              if (state === 1) {
                this.onEditPaper(item)
              }
            }

    return {
          }

    return {
        }
      }

    return {
      // 重新编辑试卷
      onEditPaper(item) {
        let parms = {
          paperIdEnc: item.paperIdEnc,
        }
        this.apiPost(API.PAPER_EDIT, parms, { showLoading: true }).then(
          (res) => {
            if (this.checkoutRes(res)) {
              this.openSystemPathLink('paper/maker')
            }
          }

    return {
        )
      }

    return {
    }

    return {
  }
})
</script>

<style scoped lang="scss">
  .paper-home-list {
    display: flex;
    flex-wrap: wrap;
    .paper-home-left {
      width: 50%;
      border-right: 1px solid #eeeeee;
    }
    .paper-home-right {
      flex: 1;
    }
    li {
      display: flex;
      align-items: center;
      background: #fff;
      width: 100%;
      background: #fafafa;
      cursor: pointer;
      box-sizing: border-box;
      // margin-bottom: 5px;
      .spot {
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #a5bac5;
        margin-left: 18px;
        margin-right: 5px;
      }
      p {
        color: #333333;
        flex: 1;
        height: auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .num {
        padding-right: 20px;
        color: #666666;
      }
    }

    li:nth-child(2n + 1) {
      background: #fafafa;
      height: 40px;
      p {
        line-height: 40px;
      }
    }

    li:nth-child(2n) {
      background: #fff;
      height: 50px;
      p {
        line-height: 50px;
      }
    }

    li:hover {
      background-color: #f6fbff;
      p,
      .num {
        color: #487FFF;
      }

      .spot {
        background: #487FFF;
      }
    }
  }
})
</style>
