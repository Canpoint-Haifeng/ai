<template>
  <div>
    <div class="content-display">
      <statusNotice
        v-if="data.apprStatus == 3 || data.isPublished == 2"
        :data="data"
      />
      <!-- 以课备课 -->
      <div
        v-if="$route.query.ext == 1 || $route.query.showEdit == 1"
        class="content-display-head"
      >
        <div class="pulic">
          <div class="title">
            <span class="plan"> 教案</span>
            <span class="name">{{ data.name }}</span>
          </div>
          <div class="description">
            <div class="logo" />
            <div class="description-title">
              全品文教
            </div>
            <div class="description-time">
              发布于 {{ formatTimestamp(data.createTime) }}
            </div>
            <div class="description-num">
              <div
                v-for="common in commonData"
                :key="common.type"
                :title="common.value"
              >
                <span class="num">{{ formatNumber(data[common.type]) }}</span>
                <span>{{ common.value }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="data.id"
          class="operation flex column"
        >
          <div class="column">
            <div
              v-for="op in operations2"
              :key="op.label"
              class="ope-i row"
              @click="executeAction(op.action)"
            >
              <span
                v-if="op.show && data[op.show] == 1"
                :class="['icon', 'iconfont', op.iconHas]"
              />
              <span
                v-else
                :class="['icon', 'iconfont', op.icon]"
              />
              <span>{{ op.label }}</span>
            </div>
          </div>
          <el-button
            type="primary"
            class="btn btn-shadow"
            @click="handleEdit"
          >
            开始备课
          </el-button>
        </div>
      </div>
      <div
        v-else
        class="content-display-head"
      >
        <div class="pulic">
          <div class="title">
            <span class="plan"> 教案</span>
            <span class="name">{{ data.name || '' }}</span>
          </div>
          <div class="description">
            <div class="logo" />
            <div class="description-title">
              全品文教
            </div>
            <div class="description-time">
              发布于
              {{ (data.createTime && formatTimestamp(data.createTime)) || '' }}
            </div>
          </div>
        </div>
        <div
          v-if="data.id"
          class="operation"
        >
          <div
            v-for="op in operations"
            :key="op.label"
            class="ope-i"
            @click="executeAction(op.action)"
          >
            <template
              v-if="(onlyDownload && op.label === '下载') || !onlyDownload"
            >
              <span :class="['icon', 'iconfont', op.icon]" />
              <span>{{ op.label }}</span>
            </template>
          </div>
        </div>
      </div>

      <div class="view-paper">
        <div class="second-title flex">
          {{ data.title }}
        </div>
        <div class="second-title second-title-1 flex">
          {{ data.subTitle }}
        </div>
        <PrePaper
          v-if="data.outline"
          :outline="data.outline"
          :level="1"
        />
      </div>
      <ContributeDialog
        ref="contributeDialog"
        :form="form"
        :rules="rules"
        @confirm="onContributePaper"
      />
      <download
        v-model="downloadVisible"
        :info="data"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import PrePaper from '@/components/PreparePapers/prePaper.vue'
import ContributeDialog from '@/components/Dialog/contributeDialog.vue'
import download from '@/views/teachingPlanEdit/components/download.vue'
import statusNotice from './components/tips.vue'

export default {
  components: {
    PrePaper,
    ContributeDialog,
    download,
    statusNotice,
  },
  setup() {
    const contributeDialog = ref(null)
    const downloadVisible = ref(false)
    const info = ref({})
    const form = reactive({
      paperName: '',
      name: '',
      stage: '',
      lessonType: '',
      suitType: 1,
    })
    const commonData = [
      {
        type: 'pageView',
        value: '浏览',
      },
      {
        type: 'usageCount',
        value: '使用',
      },
      {
        type: 'collectNum',
        value: '收藏',
      },
      {
        type: 'Downloads',
        value: '下载',
      },
      {
        type: 'likes',
        value: '点赞',
      },
    ]
    const rules = {
      suitType: [
        { required: true, message: '请选择适用难度', trigger: 'blur' },
      ],
    }
      params: {
        id: this.$route.query.id,
        type: this.$route.query.type,
      },
      newdata: {},
      operations: [
        {
          icon: 'icon-plus-download',
          label: '下载',
          action: 'handleDownload',
        },
        {
          icon: 'icon-pencil_3_line',
          label: '投稿',
          action: 'handleContribute',
        },
        {
          icon: 'icon-edit_line',
          label: '编辑',
          action: 'toEdit',
        },
      ],
      operations2: [
        {
          icon: 'icon-zan1',
          iconHas: 'icon-zan',
          label: '点赞',
          action: 'handleLike',
          show: 'isLike',
        },
        {
          icon: 'icon-nobg-star',
          iconHas: 'icon-star',
          label: '收藏',
          action: 'handleCollect',
          show: 'isCollect',
        },
        {
          icon: 'icon-plus-download',
          label: '下载',
          action: 'handleDownload',
          // status:  onlyDownload,
        },
      ],
      data: {},
    }
  },
  computed: {
    onlyDownload() {
      if (this.data.isPublished === 1 || this.data.apprStatus === 3) {
        return true
      }
      return false // 确保有默认返回值
    },
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const data = {
        lessonId: this.$route.query.id,
        lessonType: this.$route.query.type,
        source: this.$route.query.source,
      }
      this.apiPost({ urlPath: '/lesson-app/myLesson/lessonDetail' }, data, {
        showLoading: true,
      })
        .then(res => {
          this.data = res.data
          console.log('res:备课详情', res)
        })
        .catch(err => {})
    },
    handleClick(e) {
      console.log(e)
    },
    handleConfirm() {},
    handleContribute() {
      //  this.data = {
      //   name: 1, pageSize: 10, stage: '初中', subject: '数学',
      //   gradeName: 123
      // }

      let {
        name,
        suitType,
        lessonType,
        paperName,
        stageId,
        subjectName,
        grade,
        stageName,
        subjectId,
      } = this.data
      this.form.name = name || paperName
      this.form.suitType = suitType
      this.form.lessonType = lessonType
      this.form.stageId = stageId
      this.form.stage = stageName
      this.form.subjectId = subjectId
      this.form.subject = subjectName

      console.log('form', form)
      contributeDialog.value.show()
    },
    executeAction(action) {
      if (typeof this[action] === 'function') {
        this[action]()
      } else {
        console.error(`Method ${action} is not defined`)
      }
    },
    handleLike() {
      this.apiPost(
        { urlPath: '/lesson-app/myLesson/lesson/like' },
        { lessonId: this.data.id, status: this.data.isLike === 2 ? 1 : 2 },
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success(res.msg)
          this.getDetail()
        }
      })
    },
    handleCollect() {
      this.apiPost(
        { urlPath: '/lesson-app/myLesson/lesson/collect' },
        {
          lessonId: this.data.id,
          status: this.data.isCollect === 2 ? 1 : 2,
        },
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success(res.msg)
          this.getDetail()
        }
      })
      // this.apiPost({ urlPath: '/lesson-app/myLesson/deleteMyLesson' }, {
      //   lessonId: this.currPaperItem.id
      // }).then(res => {
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     this.$message.success(res.msg)
      //     this.$refs.deleteDialog.hide()
      //     this.pageData.currPage = 1
      //     this.getDataList()
      //   }
      // })
    },
    handleDownload() {
      console.log('下载文件')
      this.downloadVisible = true
    },
    // 开始备课
    handleEdit() {
      const params = {
        lessonInfoId: this.$route.query.id,
        lessonType: this.$route.query.type,
      }
      this.apiPost(
        { urlPath: '/lesson-app/lessonPreparation/copyLesson' },
        params,
      ).then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: '/teachingPlanEdit',
            query: {
              id: res.data,
              type: this.$route.query.type,
              source: 2,
            },
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toEdit() {
      this.$router.push({
        path: '/teachingPlanEdit',
        query: {
          id: this.data.id,
          type: this.$route.query.type,
          source: 2,
        },
      })
    },
    onContributePaper(formData) {
      console.log('提交的表单数据:', formData)
      this.apiPost(
        { urlPath: '/lesson-app/lessonApp/lessonContribute' },
        { lessonInfoId: this.data.id, suitType: this.form.suitType },
      ).then(res => {
        if (res.code === 200) {
          contributeDialog.value.hide()
          this.$message.success(
            '投稿成功请耐心等待审核,可在我的备课-我的投稿中查看审核结果',
          )
          this.getDataList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    formatTimestamp(value) {
      if (typeof value === 'number' || /^\d+$/.test(value)) {
        let timestamp = Number(value)

        if (timestamp.toString().length === 10) {
          timestamp *= 1000
        }

        const date = new Date(timestamp)

        if (isNaN(date.getTime())) {
          return value
        }

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      return value
    },
    // 获取教材版本列表
    async getBookCategoryId() {
      const url = { urlPath: '/lesson-app/config/getInvokeInfo' }
      const params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        if (res.data.length) {
          this.teachData = res.data[0].children
          this.teachCurrentCode = this.teachData[0].code
          this.teachCurrentName = this.teachData[0].name
          this.classData = this.teachData[0].children
          const data = this.classData[0]
          this.gradeCurrentCode = data.code
          this.gradeCurrentName = data.name
          this.getChapter()
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    formatNumber(value) {
      console.log('value', value)
      if (!value) return '0'
      if (value >= 10000) {
        return (value / 10000).toFixed(1) + 'w'
      }
      return value
    },
  },
}
</script>
<style lang="scss" scoped>
  
.content-display {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  margin-bottom: 30px;

  .content-display-head {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 20px;
    width: 100%;
    height: 110px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    margin-bottom: 16px;

    .pulic {
      height: 100%;
      flex-direction: column;
      display: flex;
      justify-content: space-between;
    }

    .title {
      //height: 20px;
      .plan {
        color: #487fff;
        padding: 2px 8px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #487fff;
        font-size: 12px;
        margin-right: 8px;
      }

      .name {
        line-height: 20px;
        font-size: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        color: #333333;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

    .description {
      display: flex;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: normal;
      font-size: 12px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      line-height: 21px;

      .logo {
        display: flex;
        width: 15px;
        height: 20px;
        background-size: cover;
        background-size: 15px 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/images/preview/main-logo.png');
        margin-right: 5px;
        vertical-align: bottom;
      }

      .description-time {
        margin-left: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 12px;
        color: #8491a5;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

    .operation {
      &.column {
        flex-direction: column;

        .ope-i {
        }

        .icon {
          background: none;
          width: 26px;
          height: 24px;
          font-size: 16px;
          margin-bottom: 8px;
          border-radius: 8px 8px 8px 8px;
          color: #8491a5;
          font-weight: 500px;
        }
        .icon-star {
          color: #487fff;
        }
        .icon-zan {
          color: #487fff;
        }
      }

      .column {
        display: flex;
      }

      display: flex;
      align-items: center;

      .ope-i {
        display: flex;
        flex-direction: column;
        margin-right: 30px;
        cursor: pointer;

        &.row {
          flex-direction: row;
          align-items: center;
          margin-right: 16px;
        }

        &:hover {
          color: #487fff;

          .icon {
            color: #487fff;
          }
        }

        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 12px;
        color: #666666;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }

      .icon {
        margin-bottom: 8px;
        padding: 8px;
        background-color: rgba(72, 127, 255, 0.1);
        border-radius: 8px 8px 8px 8px;
        color: #487fff;
        font-weight: 500px;
      }

      .el-button {
        width: 180px;
        height: 36px;
        border-radius: 4px 4px 4px 4px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 14px;
        color: #ffffff;
        font-style: normal;
        text-transform: none;
      }
    }
  }

  .text-left {
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .content-display-content {
    clear: both;
    background: #fff;
    overflow: hidden;

    .head-title {
      padding: 20px;
    }

    .section-title {
      text-align: center;
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      color: #333333;
      line-height: 36px;
      font-style: normal;
      text-transform: none;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei-Bold;
    }

    .section-sub-title {
      margin-top: 20px;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      width: 100%;
      text-align: center;
      font-weight: normal;

      font-size: 18px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }

    section {
      .border-b {
        border-bottom: 1px solid #ccc;
      }

      padding: 20px;
      text-align: left;

      .section-title {
        text-align: left;
        //padding: 8px;
      }

      .first-level-heading {
      }

      .second-level-heading {
        padding-bottom: 20px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .second-level {
        padding: 20px 10px;
        //padding-bottom: 20px;
      }

      .second-level-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 18px;
        text-align: left;
        font-style: normal;
        text-transform: none;

        &:first-of-type {
          justify-content: center;
        }
      }
    }
  }

  .flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .view-paper {
    margin-top: 16px;

    .second-title {
      background-color: #ffffff;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei-Bold;
      font-weight: bold;
      font-size: 20px;
      color: #333333;
      line-height: 36px;
      text-align: left;
      font-style: normal;
      text-transform: none;

      &:first-of-type {
        padding-top: 20px;
      }
    }

    .second-title-1 {
      font-size: 18px;
      font-weight: normal;
      padding-top: 14px;
    }
  }

  .description-num {
    display: flex;
    margin-left: 20px;

    & > div:hover {
      :last-child {
        color: #487fff;
      }
    }

    .num {
      color: #ff6900;
    }

    div > :last-child {
      margin-right: 8px;
    }
  }
}
</style>
