import CTS from '@/common/js/constant'
import { API } from '@/api/config'
// getToken
import { isLogin } from '@/common/js/util'
import AnalysisDialog from '@/components/AnalysisDialog/AnalysisDialogMaker'

const paperAnalysisMixin = {
  data() {
    return {
      questionAnalysis: {},
    }
  },
  methods: {
    // 显示分析试卷提示框
    onShowAnalysisDialog(paperItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      let parms = {
        paperId: paperItem.paperUid || paperItem.paperId,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        source: paperItem.source,
      }
      this.apiGet({ urlPath: '/paper-builder/paper/paperAnalyze' }, parms, {
        showLoading: true,
      }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data) {
            this.questionAnalysis = res.data
            this.questionAnalysis.paperIdEnc = paperItem.paperIdEnc
            this.questionAnalysis.source = paperItem.source
            this.$refs.analysisDialog.showDialog()
          }
        }
      })

    },
    // 监听点击查看
    onCheckPaperDetail(paperItem) {
      let viewCount = paperItem.viewCount || paperItem.totalCountView || 0
      // console.log(paperItem)
      let queryStr =
        '?paperIdEnc=' +
        paperItem.paperIdEnc +
        '&source=' +
        paperItem.source +
        '&viewCount=' +
        viewCount +
        '&pn=' +
        (paperItem.provinceName || '') +
        '&paperId=' + paperItem.paperId +
        '&isCollect=' + paperItem.isCollect
      queryStr += '&subject=' + this.currSubject.subjectCode
      window.open(this.$router.resolve('/paper/detail').href + queryStr)
      //   if (!isLogin()) {
      //     this.$refs.appLogin.showLogin()
      //   } else {
      //     let parms = {
      //       token: getToken()
      //     }
      //     this.wayGet(API.TOKEN_VERIFY, parms).then(res => {
      //       if (res.code === CTS.constant.SUCCESS_CODE) {
      //         let queryStr = '?paperIdEnc=' + paperItem.paperIdEnc + '&source=' + paperItem.source
      //         window.open(import.meta.env.VITE_SRC + 'paper/detail' + queryStr)
      //       } else {
      //         this.$refs.appLogin.showLogin()
      //         this.$message.error('验证已经失效，请重新登录!')
      //       }
      //     })
      //   }
    },
  },
  components: {
    AnalysisDialog,
  },
}
export default paperAnalysisMixin
