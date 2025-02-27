import { computed, defineComponent, inject, onMounted, onUnmounted, reactive, ref, watch }, { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated }, { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
<template>
  <div>
    <div
      class="cp-basket-handler"
      @click="toggleBasket"
    >
      <div
        id="basket-btn"
        class="basket-btn"
      >
        <div class="basket-num">
          <span class="text">{{ basketData.totalCount || 0 }}</span>
        </div>
        <i class="iconfont icon-basket_fill" />
        <p class="text">
          试题篮
        </p>
      </div>
    </div>
    <div class="cp-new-tool-basket">
      <div
        class="new-tool-basket-body"
        :class="isShowBasket ? 'show-baseket' : ''"
      >
        <div
          class="basket-handler"
          @click="toggleBasket"
        >
          <div
            id="basket-btn"
            class="basket-btn"
          >
            <i class="iconfont icon-arrows_right_line" />
            <p class="text">
              收起
            </p>
          </div>
        </div>

        <div class="tool-basket-segment">
          <div class="tool-basket-handler">
            <div class="title-clear">
              <span class="title-name">共<span class="title-num">{{
                basketData.totalCount || 0
              }}</span>题</span>
              <span
                v-if="basketData.totalCount"
                class="clear-ques"
                @click="showEmptyDialog"
              >清空试题</span>
            </div>
            <div class="preview-paper">
              <span
                v-if="basketData.totalCount"
                class="perview-paper-btn"
                @click="previewPaper"
              ><i class="icon el-icon-view" />试卷预览</span>
            </div>
          </div>
          <div class="basket-group-list">
            <div
              v-for="(item, index) in basketData.list"
              :key="index"
              class="basket-group-item"
            >
              <span
                class="item-type"
                :title="item.typeName"
              >{{
                item.typeName
              }}</span>
              <span class="item-num font-12">
                <em class="text">{{ item.count }}</em>题
              </span>
              <span
                class="item-del"
                @click="showDeleteDialog(item.type)"
              >
                <i class="el-icon-delete" />
              </span>
            </div>
          </div>

          <div
            v-if="questionsData && questionsData.length"
            class="basket-question-list"
          >
            <div
              v-for="item in questionsData"
              :key="item.id"
            >
              <div class="basket-paper-type-name">
                {{ item.name }}
              </div>
              <div
                v-for="ques in item.list"
                :key="ques.questionId"
              >
                <BasketQuestionItem
                  :question-item="ques"
                  @delete-question="onDeleteQuestion"
                />
              </div>
            </div>
          </div>

          <div
            v-show="basketData.list.length === 0"
            class="basket-noresult"
          >
            <div class="icon-box">
              <i class="noresult-icon" />
            </div>
            <p class="noresult-text font-16 color-3">
              试题篮空空的~
            </p>
            <p class="noresult-text1 font-12 color-9">
              您还没有添加试题，赶快去添加吧！
            </p>
          </div>
        </div>
      </div>
    </div>
    <base-dialog
      ref="deleteDialog"
      :addbody="true"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          确认删除试题？
        </div>
      </template>
    </base-dialog>
    <base-dialog
      ref="emptyDialog"
      :addbody="true"
      @comfirm="onEmptyBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          确认清空全部试题吗？
        </div>
      </template>
    </base-dialog>
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue'
import BasketQuestionItem from '@/components/QuestionItem/BasketQuestionItem.vue'
import { isLogin, getDigitalChinese } from '@/common/js/util'
import { decrypt } from '@/common/js/util.js'


export default defineComponent({
  name: 'ToolBasket',
  components: { BasketQuestionItem, BaseDialog })

    return {
  setup() {
    const store = useStore()
    const router = useRouter()
    const Bus = inject('Bus')
    
    const deleteDialog = ref(null)
    const emptyDialog = ref(null)
    const appLogin = ref(null)
    const currentType = ref(null)
    const basketData = ref({
      list: [],
      totalCount: 0,
    }
    const isShowBasket = ref(false)
    const questionsData = ref([])
    const basketInit = ref(false)
    const questionTypes = ref([])
    
    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    
    // Methods
    const showDeleteDialog = (type) => {
      currentType.value = type
      deleteDialog.value.show()
    }
    
    const onDeleteBasket = async () => {
      let parms = {
        removeType: 2,
        stage: currSubject.value.periodCode,
        subject: currSubject.value.subjectCode,
        type: currentType.value,
      }
      let res = await newPost(API.DELETE_BASKET, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        deleteDialog.value.hide()
        await getBasketList()
        Bus.emit('deleteBasket', getBaskQuesList())
      }
    }
    
    const onDeleteQuestion = async (questionItem) => {
      // 判断有没有登录
      if (!isLogin()) {
        appLogin.value.showLogin()
        return
      }
      let parms = {
        questionId: questionItem.questionInfo.questionId,
        stage: currSubject.value.periodCode,
        subject: currSubject.value.subjectCode,
        source: questionItem.source || 1,
        removeType: 1,
      }
      let set = {
        authCode: 1,
        showLoading: true,
      }
      let res = await newPost(API.DELETE_BASKET, parms, set)
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        await getBasketList()
        Bus.emit('deleteBasket', getBaskQuesList())
      }
    }
    
    const previewPaper = () => {
      router.push('/paper/maker')
    }
    
    const getBaskQuesList = () => {
      let dict = {}
      if (basketData.value && basketData.value.list) {
        for (let sub of basketData.value.list) {
          for (let ques of sub.list) {
            dict[ques] = 1
          }
        }
      }
      return dict
    }
    
    const showEmptyDialog = () => {
      emptyDialog.value.show()
    }
    
    const onEmptyBasket = async () => {
      let parms = {
        stage: currSubject.value.periodCode,
        subject: currSubject.value.subjectCode,
        removeType: 3,
      }
      let res = await newPost(API.DELETE_BASKET, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        emptyDialog.value.hide()
        await getBasketList()
        Bus.emit('deleteBasket', {})
      }
    }
    
    const getBasketList = async () => {
      let parms = {}
      let set = {
        authCode: 2,
      }

      return apiGet(API.BASKET_LIST, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          basketInit.value = true
          basketData.value = res.data
          if (isShowBasket.value) {
            getPaperDetail()
          }
        }
      }
    }
    
    const getPaperDetail = () => {
      let baseUrl = API.TEMP_PAPER_PREVIEW
      let parms = {
        stage: currSubject.value.periodCode,
        subject: currSubject.value.subjectCode,
      }
      return apiGet(baseUrl, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          executePaperData(res.data.list)
        }
      }
    }
    
    const executePaperData = (arrList) => {
      questionTypes.value = []
      let questionListOrder = {
        questionTypeOrderDtoList: [],
        questionOrderDtoList: [],
      }
      let indexId = 1
      let getIndexId = function() {
        return indexId++
      }
      let typeIndex = 0
      let questionNum = 0
      arrList.forEach((item, index) => {
        item.list.sort(sortNumber)
        item.id = getIndexId()
        item.makertype = 1
        item.groupName = {
          ordinal: item.ordinal,
          text: item.name,
          isShowInput: false,
          index: index,
          element: 'groupNameInput',
        }
        item.groupDesc = {
          ordinal: item.ordinal,
          text: item.desc,
          isShowInput: false,
          index: index,
          element: 'groupDescInput',
        }
        item.list.forEach((subItem, subIndex) => {
          subItem.list.sort(sortNumber)
          typeIndex = typeIndex + 1
          subItem.id = getIndexId()

          subItem.name =
            getDigitalChinese(typeIndex) + '、' + subItem.questionTypeName
          subItem.makertype = 2
          questionTypes.value.push(subItem.questionTypeName)
          questionListOrder.questionTypeOrderDtoList.push({
            type: subItem.questionType,
            ordinal: typeIndex,
          }
          subItem.typeIndex = typeIndex
          subItem.typesInfo = {
            text: subItem.questionTypeName,
            typeCode: subItem.questionType,
            isShowInput: false,
            index: typeIndex - 1,
            element: 'questionTypeInput',
          }
          subItem.pordinal = item.ordinal
          subItem.list.forEach(childItem => {
            questionNum = questionNum + 1
            childItem.id = getIndexId()
            childItem.makertype = 3
            childItem.questionNum = questionNum
            childItem.ordinal = questionNum
            childItem.showQuestionNum = true
            childItem.oldscore = childItem.score
            questionListOrder.questionOrderDtoList.push({
              questionId: childItem.questionId,
              ordinal: questionNum,
            }
          }
        }
      }
      questionsData.value = [...arrList[0].list, ...arrList[1].list]
      console.log(questionsData.value)
    }
    
    const sortNumber = (a, b) => {
      return a.ordinal - b.ordinal
    }
    
    const onAddBasket = () => {
      getBasketList()
    }
    
    const toggleBasket = () => {
      if (!isLogin()) {
        appLogin.value.showLogin()
        return
      }
      if (!basketInit.value) return

      isShowBasket.value = !isShowBasket.value

      if (isShowBasket.value) {
        getPaperDetail()
      }
    }
    
    // Window event handlers for scroll reset
    const initWindowsEvent = () => {
      window.addEventListener('scroll', handleScroll)
    }
    
    const unmountedWindowsEvent = () => {
      window.removeEventListener('scroll', handleScroll)
    }
    
    const handleScroll = () => {
      // Implementation of scroll reset logic
    }
    
    // Lifecycle hooks
    onMounted(() => {
      if (isLogin()) {
        getBasketList()
      }
      initWindowsEvent()
      
      // Listen for events
      Bus.on('addBasket', onAddBasket)
      Bus.on('refreshBasket', onAddBasket)
    }
    
    onUnmounted(() => {
      Bus.off('addBasket', onAddBasket)
      Bus.off('refreshBasket', onAddBasket)
      unmountedWindowsEvent()
    }
    
    const state = reactive({
      deleteDialog,
      emptyDialog,
      appLogin,
      currentType,
      basketData,
      isShowBasket,
      questionsData,
      basketInit,
      showDeleteDialog,
      onDeleteBasket,
      onDeleteQuestion,
      previewPaper,
      getBaskQuesList,
      showEmptyDialog,
      onEmptyBasket,
      getBasketList,
      getPaperDetail,
      executePaperData,
      onAddBasket,
      toggleBasket
    }
  }
})
}
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
.cp-new-tool-basket {
  position: fixed;
  top: 0;
  height: 100vh;
  right: -500px;
  z-index: 1003;
  width: 420px;
  .new-tool-basket-body {
    position: relative;
    height: 100%;
    background: #ffffff;
    transform: translate3d(0, 0, 0);
    box-shadow: 0px 6px 10px 0px rgba(49, 78, 134, 0.1);
    transition: transform 0.5s;
    &.show-baseket {
      transform: translate3d(-500px, 0, 0);
    }
  }
})
}
.basket-handler {
  position: absolute;
  top: 40%;
  left: -40px;
  width: 40px;
  height: 50px;
  background: #ffffff;
  box-shadow: -2px 1px 3px 0px rgba(42, 77, 138, 0.09);
  border-radius: 8px 0px 0px 8px;

  .basket-btn {
    padding: 10px 0;
    text-align: center;
    cursor: pointer;
    color: $color-theme;
    .iconfont {
      font-size: 12px;
      display: inline-block;
      padding-bottom: 5px;
    }
    .text {
      font-size: $font-size-small;
    }
    &:hover {
      color: $color-theme-d;
    }
  }
})
}

.tool-basket-segment {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.basket-group-list {
  padding: 80px 20px 0px 20px;
}
.basket-question-list {
  padding: 10px 20px 20px 20px;
}
.basket-paper-type-name {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  padding-bottom: 20px;
}

.tool-basket-handler {
  top: 0;
  left: 0;
  z-index: 99;
  width: 420px;
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  .title-clear {
    padding-top: 12px;
    .title-name {
      font-size: 20px;
      font-weight: 400;
      color: #333333;
      .title-num {
        font-weight: bold;
        padding: 0 5px;
        display: inline-block;
      }
    }
    .clear-ques {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      padding-left: 20px;
      cursor: pointer;
      user-select: none;
    }
  }
})
  .preview-paper {
    .perview-paper-btn {
      display: inline-block;
      width: 120px;
      height: 32px;
      background: #4b8ff5;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      color: white;
      cursor: pointer;
      user-select: none;
      .icon {
        font-size: 12px;
        display: inline-block;
        padding-right: 5px;
      }
      &:hover {
        background-color: $color-theme-d;
      }
    }
  }
})
}
.basket-group-list {
  // width: 380px;
  .basket-group-item {
    width: 178px;
    height: 40px;
    line-height: 40px;
    background: #f8f8f8;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 16px;
    padding: 0 10px;
    box-sizing: border-box;
    .item-type {
      overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
      display: inline-block;
      width: 80px;
      overflow: hidden;
      vertical-align: bottom;
      font-size: 14px;
      color: #333333;
    }
    .item-num {
      display: inline-block;
      width: 60px;
      text-align: center;
      font-size: 14px;
      color: #333333;
      .text {
        color: #fea600;
      }
    }

    .item-del {
      width: 22;
      cursor: pointer;
      user-select: none;
      i {
        font-size: 14px;
        color: #ff6e5d;
      }
    }

    &:nth-child(2n) {
      margin-left: 16px;
    }
  }
})
}

.basket-noresult {
  text-align: center;
  .icon-box {
    display: inline-block;
    width: 107px;
    height: 122px;
    margin-bottom: 26px;
    .noresult-icon {
      display: inline-block;
      width: 72px;
      height: 88px;
      padding: 0 12px;
      margin-top: 30px;
      background: url(../../assets/images/noresult-basket.png) no-repeat;
      background-size: 72px 88px;
      background-position: center;
    }
  }
})
  .noresult-text {
    margin-bottom: 14px;
  }
})
}

.cp-basket-handler {
  position: fixed;
  top: 40%;
  right: 0px;
  width: 40px;
  background: #fff;
  // box-shadow: -3px 3px 6px 0px rgba(42, 77, 138, 0.2);
  border-radius: 8px 0px 0px 8px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover {
    // background: $color-theme-d;
  }
})
  .basket-btn {
    padding: 20px 0;
    cursor: pointer;
    color: #487fff;
    width: 44px;
    font-size: 12px;
    text-align: center;
    &:hover {
      color: #66b1ff;
    }
    .iconfont {
      font-size: 20px;
    }
    p {
      margin-top: 5px;
      line-height: 16px;
    }
  }
})
  .basket-num {
    width: 20px;
    height: 20px;
    background: #ff4b36;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -10px;
    left: -10px;
    color: #fff;
    .text {
    }
  }
})
}
</style>
