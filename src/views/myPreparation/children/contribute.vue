<template>
  <div class="content-container">
    <el-tabs
      v-model="currentIndex"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in tabsData"
        :key="item.order"
        :label="item.name"
        :name="item.order"
      />
    </el-tabs>
    <div class="data-num">
      共计 <span>{{ tableData.totalCount }}</span> 份教案
    </div>
    <el-table
      :data="tableData.list"
      :header-cell-style="{ background: '#E6F1FF' }"
    >
      <el-table-column
        prop="name"
        label="稿件名称"
        width="380"
      >
        <template #default="scope">
          <div style="text-align: left;color:#333333 ;">
            {{ row.name }}
          </div>
          <div style="text-align: left;color: #8491A5;">
            稿件ID: {{ row.id }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="稿件类型"
      >
        <template #default="scope">
          <div class="table-type">
            <span>{{ suitType[row.suitType - 1] }}</span>
            <span>{{ lessonType[row.lessonType - 1] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="最近投稿时间"
      >
        <template #default="scope">
          <div class="table-status">
            {{ row.createTime | datetime('YYYY/MM/DD HH:mm:ss') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="最新审核状态"
      >
        <template #default="scope">
          <div class="table-status">
            <span
              class="status-icon"
              :style="{ display: 'inline-block', width: '8px', height: '8px', background: row.apprStatus === 3 ? '#FFB341' : row.apprStatus === 2 ? '#FF4B36' : '#45D837', borderRadius: '50%' }"
            />
            <span> {{ apprStatus[row.apprStatus - 1] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template #default="scope">
          <el-button
            v-if="row.apprStatus == 2"
            type="text"
            size="small"
            @click="showEdit(row)"
          >
            修订
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="showDetail(row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="tableData.list.length > 0"
      style="text-align: right;"
      :page-data="tableData"
      @page-curr-change="handleCurrentChange"
    />
    <base-dialog
      ref="checkDialog"  <!-- Keep the template ref -->
      title="审核结果"
      width="480px"
      cancel-btn-text="忽略"
      confirm-btn-text="修订"
      @comfirm="showEdit(shabby)"
    >
      <template #dialogTips>
        <div 
          v-if="list.length"
          class="dialog-tips"
        >
          <div class="dialog-tips-title">
            <i class="icon iconfont icon-guize" /> 审核未通过，请修订后重新提交
          </div>
          <div class="tips_time">
            审核时间：<span>{{ list[0].createTime | datetime('YYYY/MM/DD HH:mm:ss') }}</span>
          </div>
          <div class="byd">
            审核意见
          </div>
          <div class="yijian">
            感谢您的投稿，审核意见如下：
          </div>
          <div class="yijian">
            {{ list[0].remark }}
          </div>
          <div class="yijian">
            请您修订后重新投稿，谢谢！
          </div>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
export default {
    components: {
        BaseDialog
    },
    setup() {
        const checkDialog = ref(null)
        const state = reactive({
            tabsData: [
                {
                    name: '全部',
                    order: '0',
                },
                {
                    name: '审核中',
                    order: '3',
                },
                {
                    name: '未通过',
                    order: '2',
                },
                {
                    name: '已通过',
                    order: '1',
                }
            ],
            tableData: {
                list: [],
                pageSize: 6,
                currPage: 1,
                totalCount: 3,
            },
            apprStatus: ['已通过', '未通过', '审核中'],
            suitType: ['基础课', '标准课', '拔高课'],
            lessonType: ['同步教案', '阶段复习', '专题备考'],
            currentIndex: 0,
            list: [],
            shabby: ''
        })
    computed: {
        ...mapState(['currSubject']),
    },
    watch: {
        $route: {
            handler(newUrl, oldUrl) {
            },
            immediate: true
        },
    },
    created() {
        this.getDataList()
    },
    methods: {
        async getDataList() {
            const params = {
                stage: this.currSubject.periodCode,
                subject: this.currSubject.subjectCode,
                pageNum: this.tableData.currPage,
                pageSize: this.tableData.pageSize,
                apprStatus: Number(this.currentIndex)
            }
            const url = { urlPath: '/lesson-app/myLesson/mySubmissionList' }
            const res = await this.apiGet(url, params)
            if (res.code === CTS.constant.SUCCESS_CODE) {
                this.tableData = {
                    list: res.data.records,
                    pageSize: res.data.size,
                    currPage: res.data.current,
                    totalCount: res.data.total,
                }
            }
        },
        handleClick(e) {
            this.tableData.currPage = 1
            this.getDataList()
        },
        showEdit(data) {
            this.apiPost({ urlPath: '/lesson-app/backstage/lessonRevise' }, { lessonInfoId: data.id, lessonType: data.lessonType }).then(res => {
                if (res.code === CTS.constant.SUCCESS_CODE) {
                    this.$router.push({
                        path: '/teachingPlanEdit',
                        query: {
                            id: res.data,
                            type: data.lessonType,
                            revise: 1,
                            source: 2
                        }
                    })
                }
            })
        },
        showDetail(data) {
            if (data.apprStatus === 2) {
                this.apiGet({ urlPath: '/lesson-app/myLesson/getLessonApprRecord' }, { lessonId: data.id }).then(res => {
                    if (res.code === CTS.constant.SUCCESS_CODE) {
                        this.list = res.data
                        this.shabby = data
                        checkDialog.value.show()
                    } else {
                        this.$message.error('获取审核记录失败')
                    }
                }
                )
            } else {
                this.$router.push({
                    path: '/smartPaper/prePare',
                    query: {
                        id: data.id,
                        source: 1,
                        type: data.lessonType,
                    }
                })
            }
        },
        onCheckDialog() {

        },
        handleCurrentChange(currPage) {
            this.tableData.currPage = currPage
            this.getDataList()
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
.content-container {
    width: 100%;
    min-height: 473px;
    padding: 0px 20px;
    background-color: $color-white;

    :deep(.el-tabs__nav-wrap)::after {
        display: none;
    }

    .table-type {
        span {
            padding: 2px 8px;
            font-size: 12px;
            color: #487FFF;
            background: rgba(72, 127, 255, 0.1);
        }

        & span:nth-child(1) {
            margin-right: 10px;
        }
    }

    .data-num {
        font-size: 16px;
        text-align: right;
        padding-bottom: 5px;
        border-bottom: 1px solid #EEEEEE;

        span {
            color: #FF6900;
        }
    }

    .dialog-tips {
        text-align: left;
        padding-top: 20px;
        margin-left: 70px;
        margin-right: 70px;


        .dialog-tips-title {
            font-weight: bold;
            font-size: 18px;
            color: #FF4B36;
            font-style: normal;
            margin-left: -50px;
            margin-bottom: 10px;
        }

        .tips_time {
            font-size: 14px;
            color: rgb(127, 127, 127);
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 40px;
            margin-bottom: 20px;
        }

        .byd {
            font-size: 14px;
            color: #487FFF;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .yijian {
            margin-bottom: 10px;
        }
    }

    :deep(.el-dialog__footer)) {
        text-align: center !important;
    }
}
</style>
