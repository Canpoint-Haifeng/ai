<template>
  <div class="user-feed-back-body">
    <div class="user-feed-back-info">
      <div class="t1">
        欢迎提出宝贵的意见和建议
      </div>
      <div class="t2">
        每周首次提交意见反馈将获得1张下载券+5颗胖大海
      </div>
    </div>

    <div class="user-feed-back-title">
      请选择您遇到的问题
      <div
        class="title_right"
        @click="skipPage"
      >
        <span>看大家常遇到的问题</span>
        <i class="el-icon-d-arrow-right icont_right2" />
      </div>
    </div>

    <div class="user-feed-back-list">
      <div
        v-for="item in questionList"
        :key="item.id"
        class="user-feed-back-item"
        :class="item.checked ? 'checked' : ''"
        @click="changeChecked(item)"
      >
        {{ item.questionDesc }}
      </div>
      <div
        class="user-feed-back-other-item"
        @click="openOtherFeedBack"
      >
        <div class="t1">
          其他问题>
        </div>
        <div class="t2">
          反馈其他问题有机会获得会员奖励
        </div>
      </div>
    </div>

    <div class="user-feed-back-part">
      <span
        class="feed-back-confirm"
        @click="confirmFeedBack"
      >提交反馈</span>
    </div>
  </div>
</template>

<script>
  import { API } from '@/api/config'
  import { isLogin } from '@/common/js/util'
  import { defineComponent, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'UserFeedBackBody',
    props: {
      showPopover: Boolean,
    },
    emits: ['showLogin', 'confirmSuccess'],
    setup(props, { emit }) {
      const instance = getCurrentInstance()
      const store = useStore()
      const router = useRouter()
      const questionList = ref([])
      
      const currSubject = computed(() => store.state.currSubject)
      
      watch(() => props.showPopover, (v) => {
        if (v) {
          initQuestionList()
        }
      })
      
      onMounted(() => {
        getBaseQuestionConfigList()
      })
      
      const skipPage = () => {
        instance.proxy.openWindowLink(
          'https://help.canpoint.cn/#/help-doc/detail?lid=26807f49cc77ab14&fid=8bc90b53ae97267d',
        )
      }
      
      const initQuestionList = () => {
        questionList.value.forEach((item) => {
          item.checked = false
        })
      }
      
      const confirmFeedBack = () => {
        if (!isLogin()) {
          emit('showLogin')
          return
        }
        let list = []
        questionList.value.forEach((item) => {
          if (item.checked) {
            list.push(item.id)
          }
        })
        if (list.length) {
          let params = {
            period: currSubject.value.periodCode,
            subjectCode: currSubject.value.subjectCode,
            questionId: list.join(','),
          }

          instance.proxy.apiPost(API.FEEDBACK_ADDBASEQUESTIONINFO, params).then((res) => {
            if (instance.proxy.checkoutRes(res)) {
              instance.proxy.showMessage('提交反馈成功', 'success')
              if (res.data && res.data.length) {
                instance.proxy.showCpReceiveReward(res.data)
              }
              emit('confirmSuccess')
            } else {
              instance.proxy.showMessage(res.msg)
            }
          })
        } else {
          instance.proxy.showMessage('请选择您遇到的问题')
        }
      }
      
      const openOtherFeedBack = () => {
        if (!isLogin()) {
          emit('showLogin')
          return
        }
        router.push({ path: '/topstb/otherfeedback' })
      }
      
      const changeChecked = (item) => {
        item.checked = !item.checked
      }
      
      const getBaseQuestionConfigList = () => {
        instance.proxy.apiGet(API.FEEDBACK_GETBASEQUESTIONCONFIGLIST).then((res) => {
          if (instance.proxy.checkoutRes(res)) {
            res.data.forEach((item) => {
              item.checked = false
            })
            questionList.value = res.data
          }
        })
      }
      
      return {
        questionList,
        skipPage,
        initQuestionList,
        confirmFeedBack,
        openOtherFeedBack,
        changeChecked,
        getBaseQuestionConfigList
      }
    }
  })
</script>

<style scoped lang="scss">
  .user-feed-back-body {
    height: 370px;
    padding: 18px;
    .user-feed-back-info {
      text-align: center;
      font-size: 14px;
      line-height: 24px;
      width: 330px;
      margin: 0 auto;
      .t1 {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        padding-bottom: 5px;
      }
      .t2 {
        color: #999999;
      }
    }
    .div_title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
    }
    .user-feed-back-title {
        padding-top: 20px;
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
      .span1 {
        font-size: 16px;
        font-weight: 400;
        color: #222222;
        line-height: 24px;
      }
      .title_right {
          font-size: 14px;
          font-weight: 400;
          color: $color-button-d;
          cursor: pointer;
        .icont_right2 {
             color: $color-button-d;
             padding-left: 2px;
             font-size: 14px;
        }
      }

    }
    .icont_right {
      padding-left: 16px;
      font-size: 18px;
      color: black;
    }
    .user-feed-back-list {
      position: relative;
      .user-feed-back-item {
        text-align: center;
        line-height: 49px;
        display: inline-block;
        width: 211px;
        height: 49px;
        background: #f9f9f9;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        margin-bottom: 20px;
        cursor: pointer;
        user-select: none;
        &:nth-child(2n + 1) {
          margin-right: 19px;
        }
        &.checked {
          background: #f2f6ff;
          border: 1px solid #c2daff;
          color: #487FFF;
        }
      }
      .user-feed-back-other-item {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        margin-bottom: 20px;
        height: 51px;
        vertical-align: bottom;
        .t1 {
          padding-top: 8px;
          padding-bottom: 6px;
          font-size: 14px;
          font-weight: 400;
          color: $color-button-d;
          line-height: 14px;
        }
        .t2 {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
        }
        &:hover {
          .t1 {
            color: $color-button-d-hover;
          }
        }
      }
    }
    .user-feed-back-part {
      padding-top: 10px;
      text-align: center;
      .feed-back-confirm {
        display: inline-block;
        width: 230px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: $color-button-d;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        user-select: none;
        &:hover {
          background: $color-button-d-hover;
        }
      }
    }
  }
</style>
