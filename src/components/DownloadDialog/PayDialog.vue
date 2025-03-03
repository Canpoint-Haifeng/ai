<template>
  <div class="pay-wrapper">
    <el-dialog
      v-model="payDialog.visible"
      :title="dialogTitle"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :width="payDialog.width"
      :close-on-click-modal="false"
      @close="closePayDialog"
    >
      <div
        ref="payWrapperBody"
        class="pay-dialog-box"
        :class="showRecommendTask ? 'space_around' : ''"
      >
        <div
          v-if="!showRecommendTask"
          class="download-content"
        >
          <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            label-width="90px"
          >
            <el-form-item
              label="文件格式："
              prop="paperVersion"
              class="form-item-radio"
              style="margin-bottom: 20px"
            >
              <el-radio-group
                v-model="formData.paperVersion"
                @change="changePaperVersion"
              >
                <el-radio
                  v-for="item in paperVersion"
                  :key="item.label"
                  class="el-cyy-rewrite"
                  :label="item.label"
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
              <div
                v-if="formData.paperVersion"
                class="tips"
                :class="formData.paperVersion + ''"
              >
                提示：{{ paperVersionTips }}
              </div>
            </el-form-item>
            <el-form-item
              label="纸张大小："
              prop="paperSize"
              class="form-item-radio line42"
            >
              <el-radio-group
                v-model="formData.paperSize"
                class="pay-dialog-group"
              >
                <el-radio
                  v-for="item in paperSize"
                  :key="item.label"
                  :label="item.label"
                >
                  <span
                    v-if="item.label === 'A4'"
                    class="radio-label-item"
                  >
                    <span class="name">{{ item.name }}</span>
                    <img
                      width="42px"
                      height="59px"
                      src="./A4-icon.svg"
                      alt="A4"
                      class="icon"
                    >
                  </span>
                  <span
                    v-if="item.label === 'A3H'"
                    class="radio-label-item"
                  >
                    <span class="name">{{ item.name }}</span>
                    <img
                      width="81px"
                      height="59px"
                      src="./A3H-icon.svg"
                      alt="A3H"
                      class="icon"
                    >
                  </span>
                  <span
                    v-if="item.label === 'B4H'"
                    class="radio-label-item"
                    style="margin-bottom: 0"
                  >
                    <span class="name">{{ item.name }}</span>
                    <img
                      width="70px"
                      height="50px"
                      src="./B4H-icon.svg"
                      alt="B4H"
                      class="icon"
                    >
                  </span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="试卷类型："
              prop="paperType"
              class="form-item-radio"
            >
              <el-radio-group
                v-model="formData.paperType"
                class="radio-label-group"
              >
                <el-radio
                  v-for="item in paperType"
                  :key="item.label"
                  class="el-cyy-rewrite"
                  :label="item.label"
                >
                  <span class="radio-label-item">
                    <span class="name">{{ item.name }}</span>
                    <span class="text">{{ item.text }}</span>
                  </span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="isHaveAudio"
              label="听力音频："
              prop="paperVersion"
              class="form-item-radio"
              style="margin-bottom: 20px"
            >
              <el-radio-group v-model="formData.downloadAudio">
                <el-radio
                  v-for="item in paperAudio"
                  :key="item.label"
                  class="el-cyy-rewrite"
                  :label="item.label"
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>

              <div class="qr-word-audio el-cyy-rewrite">
                <div class="qr-word-audio-line" />
                <el-checkbox v-model="formData.generateQrCode">
                  音频二维码
                </el-checkbox>
                <div class="audio-tips">
                  (试卷显示音频二维码和链接，扫码或打开链接可播放音频)
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-if="usableCoupon"
              label="卡券使用："
              class="form-item-radio"
            >
              <div class="el-cyy-rewrite cyy-use-coupon">
                <el-checkbox
                  v-model="formData.useDownloadCoupon"
                  :disabled="orderPayStatus == 1"
                >
                  使用下载券
                </el-checkbox>
                <span class="use-tips">（剩余{{ usableCoupon }}张）</span>
              </div>
            </el-form-item>
            <el-form-item
              v-if="showClearBasket"
              label="试题篮："
              prop="clearBasket"
              class="form-item-radio"
            >
              <div class="el-cyy-rewrite">
                <el-checkbox v-model="formData.clearBasket">
                  清空试题篮
                </el-checkbox>
              </div>
            </el-form-item>
          </el-form>
          <div
            v-if="remainderTime"
            class="residue-degree"
          >
            今日剩余下载次数：<span style="color: #333333">{{
              remainderTime
            }}</span>次/天
            <i
              class="iconfont iconshangchuanbangzhu"
              @click="openVip"
            />
          </div>
        </div>

        <div
          v-if="!showRecommendTask"
          class="download-content-line"
        />
        <div
          class="pay-content"
          :style="{ width: showRecommendTask ? '350px' : '240px' }"
          @click="paySuccess = !paySuccess"
        >
          <div v-if="orderPayStatus == 0">
            <div class="pay-item">
              <label class="pay-label">扣费提示</label>
            </div>
            <div class="pay-need-order">
              本次下载需要付费：<span
                :class="{ cross_off: formData.useDownloadCoupon }"
              >{{ payData.amountOrder }}</span>元
            </div>
            <div class="pay-qrcode">
              <img
                :src="payData.weChatQrcode"
                alt="qrcode"
                class="qrcode-img"
                :class="{ fuzzy_wx_chat: formData.useDownloadCoupon }"
              >
              <div
                v-if="formData.useDownloadCoupon"
                class="pay-qrcode-coupon"
              >
                已选择使用下载券，<br>
                无需支付
              </div>
            </div>
            <div class="wx-tips-day-dialog">
              请使用微信扫码支付
            </div>
          </div>
          <div
            v-if="orderPayStatus == 1"
            class="pay-success"
          >
            <div class="pay-success-icon">
              <i class="iconfont iconweishoucang" />
            </div>
            <div class="pay-success-label">
              支付成功
            </div>
            <div class="pay-success-tips">
              点击"确认下载"按钮开始下载吧
            </div>
          </div>

          <div
            v-if="orderPayStatus == 2"
            class="pay-error"
          >
            <div class="pay-error-icon">
              <i class="iconfont iconweishoucang" />
            </div>
            <div class="pay-error-label">
              支付失败
            </div>
            <div class="pay-error-tips">
              请在<span
                class="skip-my-order"
                @click="skipTOmyOrder"
              >个人中心-我的订单</span>查看详情
            </div>
          </div>

          <div class="pay-tips color-9 font-12">
            <div class="pay-tips-label">
              注：
            </div>
            <div class="pay-tips-content">
              <p class="text">
                1.支付后暂不支持退款;
              </p>
              <p class="text">
                2.开通<span
                  class="color-theme"
                  @click="openBuyVip"
                >会员服务</span>或<span
                  class="color-theme"
                  @click="openSchoolServer"
                >校园服务</span>享受更多免费试题下载。
                <!-- <span class="color-theme" @click="openSchoolServer"
                  >开通校园服务</span
                >可免费下载 -->
              </p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="payDialog.visible = false"
          >
            取消
          </el-button>
          <el-button
            class="btn btn-shadow"
            @click="downloadPaper('form')"
          >
            确认下载
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onCreated } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'PayDialog',
  props: {
    amountOrder: {
      type: Number,
      default: 0,
    },
    weChatQrcode: {
      type: String,
      default: '',
    },
    payData: {
      type: Object,
      default() {
        return {}
      },
    },
    currPaper: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['closePayDialog', 'changePayType', 'balancePay', 'entryMyWallet', 'downloadPaper'],
  setup(props, { emit, refs }) {
    const router = useRouter()
    
    const payDialog = ref({
      title: '组卷下载',
      visible: false,
      width: '756px',
    })
    
    const payStatus = ref(2) // 0-已完成支付，1-微信支付，2-全品支付 3-支付成功，
    const currPayType = ref(1) // 1-微信支付 2-余额支付
    const payTypes = ref([
      {
        label: 1,
        name: '微信支付',
      },
      {
        label: 2,
        name: '全品币支付',
      },
    ])
    
    const paperVersion = ref([
      {
        label: 'docx',
        name: 'Word2007/2013',
        tips: 'docx格式文档，可编辑公式',
      },
      {
        label: 'doc',
        name: 'Word2003',
        tips: 'doc格式文档，公式为图片，不可编辑公式',
      },
      {
        label: 'pdf',
        name: 'PDF',
        tips: 'pdf格式文档，不可编辑',
      },
    ])
    
    const paperSize = ref([
      {
        label: 'A4',
        name: '',
      },
      {
        label: 'A3H',
        name: '',
      },
      {
        label: 'B4H',
        name: '',
      },
    ])
    
    const paperType = ref([
      {
        label: 'normal',
        name: '普通试卷',
        text: '（答案集中在卷尾）',
      },
      {
        label: 'teacher',
        name: '教师用卷',
        text: '（每题后面跟答案）',
      },
      {
        label: 'student',
        name: '学生用卷',
        text: '（无答案）',
      },
      {
        label: 'answer',
        name: '纯答案用卷',
        text: '（只包含答案解析）',
      },
    ])
    
    const paperAudio = ref([
      {
        label: 'only',
        name: '下载音频',
      },
      {
        label: 'noAudio',
        name: '不下载音频',
      },
    ])
    
    const formData = ref({
      paperVersion: 'docx',
      paperSize: 'A4',
      paperType: 'normal',
      useDownloadCoupon: false,
      downloadAudio: 'noAudio',
      generateQrCode: true,
      clearBasket: false,
    })
    
    const formRules = ref({
      paperVersion: [
        { required: true, message: '请选择文件格式', trigger: 'change' },
      ],
      paperSize: [
        { required: true, message: '请选择纸张大小', trigger: 'change' },
      ],
      paperType: [
        { required: true, message: '请选择试卷类型', trigger: 'change' },
      ],
    })
    
    const orderPayStatus = ref(0)
    const remainderTime = ref(0)
    const paperVersionTips = ref('docx格式文档，可编辑公式')
    const usableCoupon = ref(0)
    const isHaveAudio = ref(false)
    const paySuccess = ref(true)
    const showClearBasket = ref(false)
    const showRecommendTask = ref(false)
    const payWrapperBody = ref(null)
    
    // Computed properties
    const dialogTitle = computed(() => {
      if (showRecommendTask.value) {
        return '下载确认'
      } else {
        return props.payData.orderType === 1 ? '组卷下载' : '试卷下载'
      }
    })
    
    // Methods
    const changePaperVersion = (v) => {
      let item = paperVersion.value.find((item) => item.label == v)
      if (item) {
        paperVersionTips.value = item.tips
      }
    }
    
    const openBuyVip = () => {
      payDialog.value.visible = false
      // CpBuyVip.install({})
    }
    
    const openVip = () => {
      skinToVipHelper()
    }
    
    const getBodyEl = () => {
      return payWrapperBody.value
    }
    
    const skipTOmyOrder = () => {
      router.push('/paper/users/myWallet')
    }
    
    const openSchoolServer = () => {
      router.push('/open/campus/service')
    }
    
    // 去充值
    const goMyWallet = () => {
      router.push('/paper/users/myWallet?tabActiveName=second')
    }
    
    // 关闭支付提示框
    const closePayDialog = () => {
      currPayType.value = 1
      emit('closePayDialog')
    }
    
    // 切换支付方式
    const changePayType = (payType) => {
      currPayType.value = payType
      emit('changePayType', payType)
    }
    
    // 全品币支付
    const balancePay = () => {
      emit('balancePay')
    }
    
    // 进入我的钱包
    const entryMyWallet = () => {
      emit('entryMyWallet')
    }
    
    const changeOrderPayStatus = (v) => {
      orderPayStatus.value = v
      if (orderPayStatus.value == 1) {
        formData.value.useDownloadCoupon = false
      }
      console.log('orderPayStatus:' + v)
    }
    
    const showDialog = (args) => {
      if (refs.form) {
        refs.form.resetFields()
      }
      paperVersionTips.value = 'docx格式文档，可编辑公式'
      formData.value.useDownloadCoupon = false
      formData.value.clearBasket = false

      if (args) {
        remainderTime.value = args.remainderTime || 0
        usableCoupon.value = args.usableCoupon || 0
        isHaveAudio.value = args.isHaveAudio || 0
        showClearBasket.value = args.showClearBasket || false
        showRecommendTask.value = args.showRecommendTask || false

        if (isHaveAudio.value) {
          formData.value.generateQrCode = true
          formData.value.downloadAudio = 'only'
        } else {
          formData.value.generateQrCode = false
          formData.value.downloadAudio = 'noAudio'
        }
      } else {
        remainderTime.value = 0
        usableCoupon.value = 0
        isHaveAudio.value = false
        formData.value.generateQrCode = false
        formData.value.downloadAudio = 'noAudio'
      }
      orderPayStatus.value = 0

      payDialog.value.visible = true
    }
    
    const hideDialog = () => {
      payDialog.value.visible = false
    }
    
    // 创建订单或者直接下载试卷
    const downloadPaper = (formName) => {
      if (!(orderPayStatus.value == 1 || formData.value.useDownloadCoupon)) {
        ElMessage({ type: 'error', message: '请扫码支付后下载' })
        return
      }
      if (showRecommendTask.value) {
        emit('balancePay', formData.value, props.currPaper)
        if (props.currPaper && Object.keys(props.currPaper).length) {
          // Assuming Bus is available globally or injected
          Bus.$emit('downloading', props.currPaper, true)
        }
      } else {
        refs[formName].validate((valid) => {
          if (valid) {
            if (props.currPaper && Object.keys(props.currPaper).length) {
              Bus.$emit('downloading', props.currPaper, true)
            }
            emit('balancePay', formData.value, props.currPaper)
            czcTrackEvent([
              '_trackEvent',
              '组卷预览',
              '点击确认下载',
              '次数',
            ])
            czcTrackEvent([
              '_trackEvent',
              '试卷预览',
              '点击确认下载',
              '次数',
            ])
            czcTrackEvent([
              '_trackEvent',
              '试卷列表',
              '点击确认下载',
              '次数',
            ])

            // emit('downloadPaper', formData.value)
          } else {
            return false
          }
        })
      }
    }
    
    return {
      payDialog,
      payStatus,
      currPayType,
      payTypes,
      paperVersion,
      paperSize,
      paperType,
      paperAudio,
      formData,
      formRules,
      orderPayStatus,
      remainderTime,
      paperVersionTips,
      usableCoupon,
      isHaveAudio,
      paySuccess,
      showClearBasket,
      showRecommendTask,
      payWrapperBody,
      dialogTitle,
      changePaperVersion,
      openBuyVip,
      openVip,
      getBodyEl,
      skipTOmyOrder,
      openSchoolServer,
      goMyWallet,
      closePayDialog,
      changePayType,
      balancePay,
      entryMyWallet,
      changeOrderPayStatus,
      showDialog,
      hideDialog,
      downloadPaper
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-content {
  padding: 20px 10px;
  width: 240px;
}
.pay-item {
  margin-bottom: 12px;
  .pay-label {
    font-family: Microsoft YaHei;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: center;
    display: inline-block;
    width: 100%;
  }
  .pay-type {
    display: inline-block;
  }
  .btn {
    width: 104px;
    height: 30px;
    border: 1px solid $color-border;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background: $color-theme;
      border-color: $color-theme;
      color: #fff;
    }
  }
}
.pay-need-order {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  margin-bottom: 20px;
  text-align: center;
  .cross_off {
    text-decoration: line-through;
  }
}
.pay-qrcode {
  width: 160px;
  height: 160px;
  margin: 0 auto 10px;
  position: relative;
  .qrcode-img {
    width: 100%;
    height: 100%;
    &.fuzzy_wx_chat {
      filter: blur(5px);
    }
  }
  .pay-qrcode-coupon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    text-align: center;
  }
}
.wx-tips-day-dialog {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  text-align: center;
  margin-bottom: 20px;
}
.pay-tips {
  display: flex;
  .pay-tips-label {
    width: 30px;
  }
  .pay-tips-content {
    flex: 1;
    .text {
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.pay-success {
  text-align: center;
  padding: 20px 0;
  .pay-success-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 20px;
    .iconfont {
      font-size: 40px;
      color: #7ac23c;
    }
  }
  .pay-success-label {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .pay-success-tips {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.pay-error {
  text-align: center;
  padding: 20px 0;
  .pay-error-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 20px;
    .iconfont {
      font-size: 40px;
      color: #ff5a5a;
    }
  }
  .pay-error-label {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .pay-error-tips {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    .skip-my-order {
      color: $color-theme;
      cursor: pointer;
    }
  }
}
.pay-dialog-box {
  display: flex;
  justify-content: space-between;
  &.space_around {
    justify-content: space-around;
  }
}
.download-content {
  width: 400px;
  padding: 20px 10px;
}
.download-content-line {
  width: 1px;
  background: #e2e2e2;
  margin: 20px 0;
}
.form-item-radio {
  .tips {
    display: inline-block;
    position: relative;
    width: 380px;
    height: 26px;
    margin-left: -75px;
    background: #fffaee;
    border-radius: 2px;
    font-size: 14px;
    color: #ff9831;
    line-height: 26px;
    text-align: center;
  }
  .tips:before {
    display: block;
    content: '';
    border-width: 5px 5px 5px 5px;
    border-style: solid;
    border-color: transparent transparent #fffaee transparent;
    position: absolute;
    top: -10px;
  }
  .tips.docx::before {
    left: 140px;
  }
  .tips.doc:before {
    left: 250px;
  }
  .tips.pdf:before {
    left: 330px;
  }
}
.form-item-radio:nth-child(2) {
  .radio-label-item {
    display: inline-block;
    margin-bottom: 20px;
    .icon {
      vertical-align: middle;
    }
  }
}
.form-item-radio:nth-child(3) {
  .radio-label-item {
    display: inline-block;
    margin-bottom: 14px;
    .text {
      color: $color-text-l;
    }
  }
}
.radio-label-group {
  padding-top: 8px;
  width: 350px;
}
.residue-degree {
  text-align: right;
  color: #999999;
  font-size: 12px;
  line-height: 16px;
  .iconfont {
    color: #487fff;
    margin-left: 10px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: $color-button-d-hover;
    }
  }
}
.cyy-use-coupon {
  .use-tips {
    color: #999999;
  }
}
.qr-word-audio {
  padding-top: 10px;
  .qr-word-audio-line {
    width: 338px;
    border-top: 1px dashed #e2e2e2;
  }
  .audio-tips {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.pay-wrapper :deep(.el-dialog__body) {
  padding: 0 20px;
}
.pay-wrapper :deep(.el-dialog__footer) {
  padding: 20px;
}
.pay-wrapper :deep(.el-form-item) {
  margin-bottom: 10px;
}
.pay-wrapper :deep(.el-radio__label) {
  padding-left: 6px;
}
.pay-wrapper :deep(.el-radio) {
  margin-right: 12px;
  &:last-child {
    margin-right: 0;
  }
}
.pay-wrapper :deep(.line42) {
  .el-radio {
    line-height: 42px;
  }
}
</style>
