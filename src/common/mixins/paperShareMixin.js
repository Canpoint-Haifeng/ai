import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { ShareDialog, AppendPaperBookDialog } from '@/components/CpFan/index.js'
const paperShareMixin = {
  data() {
    return {

    }
  },
  methods: {
    OnShowShareDialog(paperItem) {
      this.$refs.shareDialog.show(paperItem)
    },
    sharePaperDown(params) {
      this.apiPost(API.SCHOOL_PAPER_SHARE, params, { showLoading: true }).then(res => {
        if (res.code == CTS.constant.SUCCESS_CODE) {
          this.$message.success('分享成功！')
          this.$refs.shareDialog.hide()
          if (this.updateListEvent) {
            this.updateListEvent()
          }
        }
      })
      // SCHOOL_PAPER_SHARE
    },
    OnShowAddBookDialog(paperItem) {
      // 这个用一个公共的
      if (this.$refs.appendPaper2BookDialog) {
        this.$refs.appendPaper2BookDialog.show(paperItem)
      }
    }

  },
  components: {
    ShareDialog,
    AppendPaperBookDialog
  }
}

export default paperShareMixin
