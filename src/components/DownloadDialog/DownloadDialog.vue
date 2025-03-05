<template>
  <div class="download-wrapper">
    <el-dialog
      v-model="downloadDialog.visible"
      :title="downloadDialog.title"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :width="downloadDialog.width"
      @close="resetFields"
    >
      <div
        ref="downloadWrapperBody"
        class="free-download-content"
      >
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          label-width="95px"
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
                {{
                  item.name }}
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
            v-if="!showRecommendTask"
            label="纸张大小："
            prop="paperSize"
            class="form-item-radio"
          >
            <el-radio-group v-model="formData.paperSize">
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
                {{
                  item.name }}
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
            v-if="usableCoupon && status != 10 && status != 6"
            label="卡券使用："
            class="form-item-radio"
          >
            <div class="el-cyy-rewrite cyy-use-coupon">
              <el-checkbox v-model="formData.useDownloadCoupon">
                使用下载券
              </el-checkbox>
              <!-- <CpRadio v-model="formData.useDownloadCoupon">使用下载券</CpRadio> -->
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
      </div>
      <div>
        <div
          v-if="freeTime"
          class="download-free-times"
        >
          今日剩余下载次数：<span style="color: #333333">{{ freeTime }}</span>次/天
          <span
            v-if="totalFreeCount"
            style="margin-left: 9px"
          >已使用题量<span style="color: #333333">{{
            totalFreeCount - freeCount
          }}</span>/{{ totalFreeCount }}题</span>
          <i
            class="iconfont iconshangchuanbangzhu"
            @click="openVip"
          />
        </div>
      </div>

      <template #footer>
        <div class="free-dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="downloadDialog.visible = false"
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
import { ref, nextTick } from 'vue'

export default {
  name: 'DownloadDialog',
  props: {
    currPaper: {
      type: Object,
      default: () => { }
    }
  },
  emits: ['downloadPaper'],
  setup(props, { emit, refs }) {
    const downloadDialog = ref({
      title: '下载确认',
      visible: false,
      width: '570px',
    })
    
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
      downloadAudio: 'only',
      generateQrCode: false,
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
    
    const payStatus = ref(2) // 0-已完成支付，1-微信支付，2-全品支付 3-支付成功
    const freeTime = ref(0)
    const totalFreeCount = ref(0)
    const freeCount = ref(0)
    const paperVersionTips = ref('docx格式文档，可编辑公式')
    const usableCoupon = ref(0)
    const status = ref(0) // 4 表示已经 付费过了 ，10表示有免费次数
    const isHaveAudio = ref(false)
    const showClearBasket = ref(false)
    const showRecommendTask = ref(false)
    const downloadWrapperBody = ref(null)
    
    // Methods
    const changePaperVersion = (v) => {
      let item = paperVersion.value.find((item) => item.label == v)
      if (item) {
        paperVersionTips.value = item.tips
      }
    }
    
    const openVip = () => {
      skinToVipHelper()
    }
    
    const getBodyEl = () => {
      return downloadWrapperBody.value
    }
    
    // 表单重置
    const resetFields = () => {
      nextTick(() => {
        // refs.form.resetFields()
      })
    }
    
    const showDialog = (args) => {
      if (refs.form) {
        refs.form.resetFields()
      }
      paperVersionTips.value = 'docx格式文档，可编辑公式'
      formData.value.useDownloadCoupon = false
      formData.value.clearBasket = false
      if (args) {
        freeTime.value = args.freeTime || 0
        totalFreeCount.value = args.totalFreeCount || 0
        freeCount.value = args.freeCount || 0
        usableCoupon.value = args.usableCoupon || 0
        status.value = args.status
        isHaveAudio.value = args.isHaveAudio || false
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
        freeTime.value = 0
        totalFreeCount.value = 0
        freeCount.value = 0
        usableCoupon.value = 0
        isHaveAudio.value = false
        formData.value.generateQrCode = false
        formData.value.downloadAudio = 'noAudio'
      }
      downloadDialog.value.visible = true
    }
    
    const hideDialog = () => {
      downloadDialog.value.visible = false
    }
    
    // 创建订单或者直接下载试卷
    const downloadPaper = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          console.log(props.currPaper);
          if (props.currPaper && Object.keys(props.currPaper).length) {
            // Assuming Bus is available globally or injected
            Bus.$emit('downloading', props.currPaper, true)
          }
          emit('downloadPaper', formData.value, props.currPaper, true)
        } else {
          return false
        }
      })
    }
    
    return {
      downloadDialog,
      paperVersion,
      paperSize,
      paperType,
      paperAudio,
      formData,
      formRules,
      payStatus,
      freeTime,
      totalFreeCount,
      freeCount,
      paperVersionTips,
      usableCoupon,
      status,
      isHaveAudio,
      showClearBasket,
      showRecommendTask,
      downloadWrapperBody,
      changePaperVersion,
      openVip,
      getBodyEl,
      resetFields,
      showDialog,
      hideDialog,
      downloadPaper
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.download-wrapper :deep(.el-dialog__footer)) {
  padding: 20px;
}

.free-download-content {
  padding: 20px 20px 10px 20px;
}

.form-item-radio :deep(.el-radio__label)) {
  padding-left: 6px;
}

.form-item-radio:nth-child(1) :deep(.el-radio)) {
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
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

.color-theme {
  cursor: pointer;

  &:hover {
    color: $color-theme-d;
  }
}

.succss-box {
  margin: 80px 18px;
  text-align: center;

  .icon-box {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-bottom: 30px;

    .iconsuccess {
      color: #7ac23c;
      font-size: 40px;
    }
  }

  .text1 {
    margin-bottom: 15px;
  }
}

.radio-label-group {
  padding-top: 8px;
  width: 350px;
}

.download-free-times {
  padding: 0 20px;
  text-align: right;
  color: #999999;
  font-size: 12px;
  line-height: 16px;

  .iconfont {
    color: #487FFF;
    margin-left: 10px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      color: $color-button-d-hover;
    }
  }
}

.free-dialog-footer {
  padding-bottom: 10px;
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

.free-download-content :deep(.el-form-item)) {
  margin-bottom: 10px;
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
</style>
