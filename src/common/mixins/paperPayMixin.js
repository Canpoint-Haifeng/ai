import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { isLogin, getElementXyHw } from '@/common/js/util'
import PayDialog from '@/components/DownloadDialog/PayDialog'
import DownloadDialog from '@/components/DownloadDialog/DownloadDialog'
import CpWarningDialog from '@/components/AuthorityVip/CpWarningDialog'

const paperPayMixin = {
  data() {
    return {
      payData: {
        orderNumCloud: 0, // 订单号
        amountOrder: 0, // 商品金额
        weChatQrcode: '', // 微信支付二维码
        buyerBalanceAvailable: 0, // 可用全品币
        orderType: 1, // 订单类型 1：组卷下载 2：试卷下载 3：充值
        showClearBasket: false, //  是否显示 清除 试题篮
        showRecommendTask: false, // 是否是智慧作业 推荐
      },
      payCurrPaper: {}, // {paperIdEnc,source,paperName}
      timer: 0,
      formData: {},
      orderPayStatus: 0,
      downLoadType: 1,
    }
  },
  methods: {
    showDownloadDialog() {
      this.downLoadType = 1
      this.$refs.downloadDialog.showDialog(this.payData)
      return
      // 监听下载试卷
      if (this.payData.showRecommendTask) {
        this.downloadRecommendTask({
          paperIdEnc: this.payCurrPaper.paperIdEnc,
          source: this.payCurrPaper.source,
        })
      } else {
        this.downLoadType = 1
        this.$refs.downloadDialog.showDialog(this.payData)
      }
    },
    // 监听下载试卷
    onDownloadPaper(formData, currPaper) {
      // 开始下载
      let parms = formData
      console.log(parms, currPaper);
      parms.paperIdEnc = this.payCurrPaper.paperIdEnc
      parms.source = currPaper.source || currPaper.paperSource
      parms.paperUid = currPaper.paperUid || currPaper.paperId
      //  是否使用下载券
      // parms.useDownloadCoupon = true
      let copyOffset = null
      if (this.downLoadType === 1) {
        copyOffset = getElementXyHw(this.$refs.downloadDialog.getBodyEl())
      } else {
        copyOffset = getElementXyHw(this.$refs.payDialog.getBodyEl())
      }
      if (this.payData.showRecommendTask) {
        if (this.$refs.downloadDialog) {
          this.$refs.downloadDialog.hideDialog()
        }
        if (this.$refs.payDialog) {
          this.$refs.payDialog.hideDialog()
        }
        if (this.downloadRecommendTask) {
          this.downloadRecommendTask(parms)
        }
        return
      }

      this.Bus.$emit('addCpFileDownLoad', {
        ...parms,
        copyOffset: copyOffset,
        currPaper: currPaper || {}
      })
      if (this.$refs.downloadDialog) {
        this.$refs.downloadDialog.hideDialog()
      }
      if (this.$refs.payDialog) {
        this.$refs.payDialog.hideDialog()
      }
      if (this.downloadPaperEnd) {
        this.downloadPaperEnd(parms)
      }
    },

    // 获取 用户下载券数量
    getUsableCoupon() {
      return this.apiGet(API.QUERY_USABLE_COUPON).then(
        (res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            return res.data.usableCouponCount || 0
          } else {
            return 0
          }
        },
        (err) => {
          console.log(err)
          return 0
        },
      )
    },
    // 是否 还有音频文件  /personal/isHaveAudio
    getIsHaveAudio() {
      let parms = {}
      parms.paperIdEnc = this.payCurrPaper.paperIdEnc
      parms.source = this.payCurrPaper.source
      return this.apiGet(API.QUERY_PERSONAL_ISHAVEAUDIO, parms, {
        showLoading: true,
      }).then(
        (res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            return res.data
          } else {
            return false
          }
        },
        (err) => {
          console.log(err)
          return false
        },
      )
    },
    // 查询试卷/组卷订单状态
    async queryOrder(paperItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      this.payData.paperUid = paperItem.paperUid
      this.showDownloadDialog()
      this.orderPayStatus = 0
      let { paperIdEnc, source, paperName } = paperItem
      this.payData.orderType = source
      this.payCurrPaper = { paperIdEnc, source, paperName }
      let parms = {
        paperIdEnc: paperIdEnc,
        source: source,
      }
      return

      let usableCoupon = await this.getUsableCoupon()
      let isHaveAudio = await this.getIsHaveAudio()
      this.payData.usableCoupon = usableCoupon
      this.payData.isHaveAudio = isHaveAudio
      this.payData.showClearBasket = paperItem.showClearBasket || false
      this.payData.showRecommendTask = paperItem.showRecommendTask || false

      this.newPost(API.QUERY_ORDER, parms, { showLoading: true }).then(
        (res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            const { status } = res.data

            this.payData.remainderTime =
              res.data.remainderTime || res.data.freeTime
            // status 0-已创建订单/未支付 1-已创建订单/已支付 2-已创建订单/已关闭 3-未创建订单
            // 4 有免费次数 可以使用下载券
            // 6 ， 10 支付费用 ，不能使用 下载券
            this.payData.status = res.data.status
            if (status === 0) {
              // 调用继续支付接口
              this.continuePay(res.data.orderNumMerchantEnc)
            } else if (
              status === 1 ||
              status === 4 ||
              status == 6 ||
              status === 10
            ) {
              // 调用下载接口
              // this.freeTimes = 0
              // this.totalFreeCount = 0
              // this.freeCount = 0
              this.payData.freeTime =
                res.data.freeTime || res.data.remainderTime || 0
              this.payData.totalFreeCount = res.data.totalFreeCount || 0
              this.payData.freeCount = res.data.freeCount || 0

              this.showDownloadDialog()
              // this.payData.orderNumCloud = 123
              // this.payData.amountOrder = 1
              // this.payData.buyerBalanceAvailable = 123
              // this.payData.weChatQrcode = true
              // this.$nextTick(() => {
              //   this.$refs.payDialog.showDialog()
              // })
            } else {
              // 2,3 调用创建订单接口
              this.createOrder(paperItem)
            }
          } else {
            if (res.msg === '1000' || res.msg === '1001') {
              // 1000 免费次数用完
              // 1001 下载次数用完 可以升级
              this.showWarningDialog(res.msg)
            }
          }
        },
      )
      this.showDownloadDialog()
    },
    // 显示 提示语
    showWarningDialog(code) {
      CpWarningDialog.install({
        code: code,
        onBuyVip: () => {
          // CpBuyVip.install({})
        },
      })
    },
    // 发起微信支付/显示支付框
    weChatPay() {
      console.log('获取二维码')
      this.clearTimeclearInterval()
      let parms = {
        orderNumCloud: this.payData.orderNumCloud,
      }
      this.apiPost(API.WECHAT_PAY, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.payData.weChatQrcode = res.data.baseImage
          this.$nextTick(() => {
            this.downLoadType = 2
            this.$refs.payDialog.showDialog(this.payData)
            if (!this.timer) {
              this.timer = setInterval(this.weChatPayResult, 2000)
            }
          })
        }
      })
    },
    // 轮询查询微信支付结果
    weChatPayResult() {
      let parms = {
        orderNumCloud: this.payData.orderNumCloud,
      }
      let set = {
        authCode: 2,
      }
      this.apiPost(API.WECHAT_PAY_RESULT, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // 订单支付成功
          this.clearTimeclearInterval()
          this.orderPayStatus = 1
          this.changeOrderPayStatus()
          // 先 支付成功
        } else if (res.code === -1) {
          // 订单未支付
          this.orderPayStatus = 0
          this.changeOrderPayStatus()
        } else if (res.code === -2) {
          // 订单支付失败
          this.clearTimeclearInterval()
          this.orderPayStatus = 2
          this.changeOrderPayStatus()
          //  显示刷新
          // this.$message.error(res.msg)
        } else {
          // 其它系统错误
          //  显示刷新
          this.clearTimeclearInterval()
          this.orderPayStatus = 2
          this.changeOrderPayStatus()
          // this.$message.error(res.msg)
        }
      })
    },
    changeOrderPayStatus() {
      if (this.$refs.payDialog) {
        this.$refs.payDialog.changeOrderPayStatus(this.orderPayStatus)
      }
    },
    // 监听选择支付方式
    onChangePayType(payType) {
      // if (payType === 2) { // 全品币支付
      //   clearInterval(this.timer)
      // } else { // 微信支付
      //   this.timer = setInterval(this.weChatPayResult, 2000)
      // }
    },
    // 监听余额支付
    onBalancePay(formData, currPaper) {
      this.formData = formData
      this.onDownloadPaper(this.formData, currPaper)
      // let parms = {
      //   orderNumCloud: this.payData.orderNumCloud
      // }
      // this.apiPost(API.BALANCE_PAY, parms).then(res => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     // this.showDownloadDialog()
      //     this.onDownloadPaper(this.formData)
      //     this.$refs.payDialog.hideDialog()
      //   }
      // })
    },
    // 订单已创建，继续支付
    continuePay(orderNumMerchantEnc) {
      let parms = {
        orderNumMerchantEnc,
      }
      this.apiPost(API.CONTINUE_PAY, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          const result = res.data
          if (result.orderNumCloud) {
            // 需要支付
            this.payData.orderNumCloud = result.orderNumCloud
            this.payData.amountOrder = result.amountOrder
            this.payData.buyerBalanceAvailable = result.buyerBalanceAvailable
            this.weChatPay()
          } else {
            // 不需要支付直接下载
            this.showDownloadDialog()
          }
        }
      })
    },
    // 创建订单
    createOrder(paperItem) {
      let parms = {
        paperIdEnc: this.payCurrPaper.paperIdEnc,
        productDetail: this.payCurrPaper.paperName,
        orderType: this.payData.orderType,
      }
      this.apiPost(API.CREATE_ORDER, parms, { showLoading: true }).then(
        (res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            const result = res.data
            if (result.orderNumCloud) {
              // 需要支付
              this.payData.orderNumCloud = result.orderNumCloud
              this.payData.amountOrder = result.amountOrder
              this.payData.buyerBalanceAvailable = result.buyerBalanceAvailable
              this.payData.weChatQrcode = true
              this.weChatPay()
            } else {
              // 不需要支付直接下载
              this.showDownloadDialog()
            }
          }
        },
      )
    },
    clearTimeclearInterval() {
      clearInterval(this.timer)
      this.timer = 0
    },
    // 监听关闭支付弹窗
    onClosePayDialog() {
      this.clearTimeclearInterval()
    },
    // 监听进入我的钱包
    onEntryMyWallet() {
      this.$router.push({
        name: 'myWallet',
      })
    },
    async downloadRecommendTask(params) {
      params.paperSize = 'B5'
      params.paperVersion = 'pdf'
      if (this.payData.isHaveAudio) {
        params.generateQrCode = true
        params.downloadAudio = 'only'
      } else {
        params.generateQrCode = false
        params.downloadAudio = 'noAudio'
      }
      let set = {
        authCode: 2,
        timeout: 1800000,
        showLoading: true,
      }
      let resData = await this.apiPost(
        API.RESOURCE_PAPER_DOWNLOAD,
        params,
        set,
      ).then(
        (res) => {
          if (this.checkoutRes(res)) {
            return res.data
          } else {
            return ''
          }
        },
        () => {
          return ''
        },
      )
      if (resData) {
        if (this.syncUploadFile) {
          this.syncUploadFile(resData)
        }
      }
    },
  },
  unmounted() {
    clearInterval(this.timer)
    this.timer = 0
  },
  components: {
    PayDialog,
    DownloadDialog,
  },
}

export default paperPayMixin
