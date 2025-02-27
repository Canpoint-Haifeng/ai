<script>
import paperMaker from '@/views/paper-maker/paper-maker'
// import CTS from '@/common/js/constant'
export default {
  name: 'PaperMaker',
  extends: paperMaker,
  data() {
    return {
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '细目表组卷'
        },
        {
          path: '',
          isLink: false,
          text: '下一步'
        }
      ]
    }
  }
}
</script>

<style></style>
