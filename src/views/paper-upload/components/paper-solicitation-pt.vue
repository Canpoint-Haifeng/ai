<template>
  <div class="paper-solicitation-pt">
    <div class="form-search">
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="searchFormInline"
        class="demo-form-inline"
      >
        <el-form-item
          label="征集状态："
          prop="state"
        >
          <el-radio-group
            v-model="searchFormInline.state"
            size="mini"
            @change="search"
          >
            <el-radio-button :label="0">
              全部
            </el-radio-button>
            <el-radio-button :label="1">
              待上传
            </el-radio-button>
            <el-radio-button :label="2">
              已结束
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="截止日期："
          prop="timer"
        >
          <paper-times-picker @select-times="search" />
          <!-- <el-date-picker @change="search" v-model="searchFormInline.timer" type="daterange" value-format="yyyy-MM-dd" clearable
            format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
        </el-form-item>
        <el-form-item>
          <span
            class="my-uploads"
            style="cursor: pointer"
            @click="
              $router.push(
                '/paper/resources/papers?tabActiveName=myUploadPaper',
              )
            "
          ><i class="icon iconfont iconshangchuan" />我的上传</span>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-loading="loading"
      class="file-list"
    >
      <ul v-if="tableData.list && tableData.list.length">
        <li
          v-for="item in tableData.list"
          :key="item.id"
        >
          <div class="file-attr">
            <h1>{{ item.name || '-' }}</h1>
            <div class="time">
              <span>截止日期：</span>
              <span>{{ item.stopTime || '-' }}</span>
            </div>
          </div>
          <el-button
            size="mini"
            plain
            round
            :class="{ isend: item.state !== 1 && item.state !== 5 }"
            @click="uploadFile(item)"
          >
            {{ stateObj[item.state] }}
          </el-button>
        </li>
      </ul>
      <noresult-common
        v-else
        text="暂无试卷征集任务"
      />
      <!-- <div class="no-data" v-else>
        <img :src="noDataUrl" />
        <p>暂无试卷征集任务</p>
      </div> -->
      <pagination
        v-if="tableData.list.length > 0"
        :page-data="tableData"
        @page-curr-change="handleCurrentChange"
      />
      <!-- <div class="pagination-container" style="text-align: center;" v-if="tableData.list && tableData.list.length">
        <el-pagination @current-change="handleCurrentChange" background :current-page="tableData.currPage" @update:current-page="tableData.currPage = $event"
          :page-size="tableData.pageSize" layout="prev, pager, next, jumper" :total="tableData.totalCount">
        </el-pagination>
      </div> -->
    </div>
    <el-dialog
      v-model:visible="dialogVisible" @update:visible="dialogVisible = $event"
      title="文件上传"
      width="1050px"
      custom-class="upload-dia"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :before-close="closes"
    >
      <div
        ref="select_frame"
        class="upload-file-paper"
      >
        <el-upload
          ref="elupload"
          action=""
          class="upload-demo"
          drag
          :disabled="isDisabled"
          :limit="1"
          :headers="myHeaders"
          :data="formInline"
          :http-request="myRequest"
          name="uploadFiles"
          :before-upload="handbeforeupload"
          :on-progress="handprogress"
          :on-success="handleAvatarSuccess"
          :on-error="imgOnError"
          :on-exceed="handleExceed"
        >
          <img :src="uploadFileUrl">
          <div class="el-upload__text">
            <h1 :class="{ error: isError, success: isSuccess }">
              {{ uploadTitle }}
            </h1>
            <p @click="continueUpload(startTip, $event)">
              <span>{{ startTip }}</span>
            </p>
          </div>
          <template #tip>
            <div class="el-upload__tip" />
          </template>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  import { getToken } from '@/common/js/util'
  import { mapState } from 'vuex'
  import { PaperTimesPicker } from '@/components/CpFan/index.js'
  export default {
    components: {
      PaperTimesPicker,
      NoresultCommon,
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        stateObj: {
          1: '待上传',
          2: '已结束',
          3: '已结束',
          4: '已结束',
          5: '待上传',
        },
        searchFormInline: {
          state: 0,
          timer: '',
        },
        tableData: {
          list: [],
          currPage: 1,
          pageSize: 15,
          totalCount: 0,
        },
        formInline: {
          taskId: null,
        },
        myHeaders: {
          CANPOINTTOKEN: getToken(),
          'Resource-Request-Source': 'RESOURCE_WEB',
        },
        isUpload: false, // 是否正在上传
        uploadFileUrl: require('@/assets/images/resource/document-icon.png'),
        uploadTitle: '将文件拖拽至此处上传',
        startTip: '点击选择文件',
        isError: false, // 是否上传失败
        isSuccess: false, // 是否上传成功
        isDisabled: false, // 是否可以上传
        noDataUrl: require('@/assets/images/nodata.png'),
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mounted() {
      this.getPaperList()
    },
    methods: {
      // 分页
      handleSizeChange(val) {
        this.tableData.pageSize = val
        this.getPaperList()
      },
      handleCurrentChange(val) {
        this.tableData.currPage = val
        this.getPaperList()
      },
      // 获取列表
      getPaperList() {
        this.loading = true
        let url = {
          urlPath:
            import.meta.env.VITE_PAPER_GENERATOR + '/v2/paper/collect/task',
        }
        let parms = {
          pageSize: this.tableData.pageSize,
          currPage: this.tableData.currPage,
          stageSubject: this.currSubject.subjectCode,
          // stageSubject: 1112,
          state:
            this.searchFormInline.state === 0
              ? null
              : this.searchFormInline.state,
        }
        if (
          this.searchFormInline.timer &&
          this.searchFormInline.timer.length &&
          this.searchFormInline.timer.length === 2
        ) {
          parms.sTime = this.searchFormInline.timer[0]
          parms.eTime = this.searchFormInline.timer[1]
        }
        this.apiGet(url, parms).then((res) => {
          this.loading = false
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              this.tableData = res.data
            }
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        })
      },
      // 搜索
      search(v) {
        this.tableData.currPage = 1
        this.searchFormInline.timer = v
        this.getPaperList()
      },
      // 上传
      uploadFile(item) {
        this.formInline.taskId = item.id
        if (item.state === 1 || item.state === 5) {
          this.dialogVisible = true
        }
      },
      myRequest(params) {
        console.log(params)
        let url = {
          urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/v2/paper/upload',
        }
        let parms = this.formInline
        parms.uploadFile = params.file
        parms.paperType = 2
        const uploadProgressEvent = (progressEvent) => {
          this.startTip = '0%'
          params.onProgress({
            percent: (progressEvent.loaded * 100) / progressEvent.total,
          })
        }
        this.apiPost(url, parms, {
          file: true,
          uploadProgressEvent,
        }).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            params.onSuccess(res)
          } else {
            params.onError(res)
            this.$message({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        })
      },
      // 上传文件
      handbeforeupload(file) {
        console.log(file)
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({
            type: 'warning',
            showClose: true,
            message: file.name + '文件大小超过 5MB!',
          })
          return false
        }
        let fileType = file.name.substring(file.name.lastIndexOf('.'))
        if (!/.(doc|docx|pdf)$/.test(fileType.toLowerCase())) {
          this.$message({
            type: 'warning',
            showClose: true,
            message: '上传文件只能是.doc/.docx/.pdf格式!',
          })
          return false
        }
        this.uploadTitle = '正在上传'
        this.isError = false
        this.isSuccess = false
        this.isUpload = true
        this.$emit('setFormDisabled', true)
        return isLt5M
      },
      // 上传中
      handprogress(event, file, fileList) {
        console.log(event.percent)
        this.startTip = event.percent.toFixed(2) + '%'
        this.isUpload = true
      },
      handleAvatarSuccess(res, file, fileList) {
        if (res && res.code === 200) {
          this.isUpload = false
          this.uploadFileUrl = require('@/assets/images/resource/upload-success.png')
          this.uploadTitle = '上传成功'
          this.startTip = '点击继续上传'
          this.isSuccess = true
          this.isDisabled = true
        } else {
          this.uploadTitle = '上传失败'
          this.startTip = '请重新拖拽或选择文件进行上传'
          this.isError = true
          this.isUpload = false
          this.$message({
            type: 'error',
            showClose: true,
            message: '上传文件失败！',
          })
          this.$refs.elupload.clearFiles()
        }
      },
      imgOnError() {
        this.uploadTitle = '上传失败'
        this.startTip = '请重新拖拽或选择文件进行上传'
        this.isError = true
        this.isUpload = false
        this.$message({
          type: 'error',
          showClose: true,
          message: '上传文件失败！',
        })
        this.$refs.elupload.clearFiles()
      },
      handleExceed(files, fileList) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '不能上传多个文件',
        })
      },
      // 继续上传
      continueUpload(val, e) {
        if (val === '点击继续上传') {
          e.stopPropagation() // 阻止拖放后的浏览器默认行为
          this.isError = false
          this.isSuccess = false
          this.uploadFileUrl = require('@/assets/images/resource/document-icon.png')
          this.uploadTitle = '将文件拖拽至此处上传'
          this.startTip = '点击选择文件'
          this.$refs.elupload.clearFiles()
          this.isDisabled = false
          this.dialogVisible = false
        }
      },
      closes(done) {
        if (this.isUpload) {
          this.$message({
            type: 'warning',
            showClose: true,
            message: '正在上传文件，勿关闭弹窗',
          })
        } else {
          this.uploadFileUrl = require('@/assets/images/resource/document-icon.png')
          this.isError = false
          this.isSuccess = false
          this.uploadTitle = '将文件拖拽至此处上传'
          this.startTip = '点击选择文件'
          this.$refs.elupload.clearFiles()
          this.isDisabled = false
          done()
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .paper-solicitation-pt {
    padding: 20px 20px;

    .form-search {
      .el-form {
        display: flex;
        justify-content: space-between;

        :deep(.el-form-item) {
          .el-radio-group {
            .el-radio-button {
              margin-right: 16px;

              .el-radio-button__inner {
                border: none;
                border-radius: 14px;
                padding: 6px 15px;
              }
            }
          }

          .el-date-editor {
            border: none;
            height: 28px;
            line-height: 28px;
            padding: 3px 0;

            .el-range__icon {
              display: none;
            }

            .el-range__close-icon {
              line-height: 23px;
              margin-left: -28px;
            }

            .el-range-input {
              border: 1px solid #dcdfe6;
              border-radius: 14px;
            }

            .el-range-separator {
              line-height: 23px;
            }
          }

          .my-uploads {
            color: #487FFF;
            font-weight: bold;

            i {
              font-weight: 100;
              padding-right: 6px;
              font-size: 14px;
            }
          }
        }
      }
    }

    .file-list {
      min-height: 470px;
      ul {
        li {
          height: 108px;
          border: 1px solid #e2e2e2;
          border-radius: 6px;
          padding: 24px 20px;
          box-sizing: border-box;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-end;
          .file-attr {
            display: inline-block;
            width: calc(100% - 180px);
            flex: 1;
            h1 {
              font-size: 14px;
              font-weight: 400;
              font-family: Microsoft YaHei;
              color: #333333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .time {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #999999;
              margin-top: 30px;
            }
          }

          .el-button {
            background: #fff;
            border-color: $color-theme;
            color: $color-theme;
            padding: 6px 20px;
          }

          .isend {
            border: 1px solid #999999;
            color: #999999;
          }
        }

        li:hover {
          border-color: $color-theme;
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
        }

        li:hover h1 {
          color: $color-theme;
        }
      }

      .no-data {
        margin: 100px auto;
        position: relative;
        text-align: center;

        p {
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #666666;
          text-align: center;
          position: absolute;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    :deep(.upload-dia) {
      .el-dialog__header {
        background: #f3f7fb;
        line-height: 44px;
        padding: 0 40px;

        .el-dialog__title {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }

        .el-dialog__headerbtn {
          top: 10px;
        }
      }

      .el-dialog__body {
        overflow: hidden;

        .upload-file-paper {
          margin: 40px 40px 50px 40px;

          .upload-demo {
            .el-upload {
              width: 100%;

              .el-upload-dragger {
                width: 100%;
                background: #f4f5fa;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
                border-radius: 4px;
                height: 290px;

                &:hover {
                  border-color: $color-theme;
                }

                > img {
                  margin-top: 67px;
                }

                .el-upload__text {
                  margin-top: 10px;

                  > h1 {
                    font-size: 20px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #333333;
                  }

                  .error {
                    color: #ff7575;
                  }

                  .success {
                    color: #52cc87;
                  }

                  .success + p {
                    color: $color-theme;
                  }

                  > p {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: $color-theme;
                    margin-top: 14px;

                    span {
                      display: inline-block;
                      // border-bottom: 1px solid;
                      padding-bottom: 3px;
                    }
                  }
                }
              }
            }

            .el-upload-list {
              .el-upload-list__item {
                .el-upload-list__item-name {
                  font-size: 16px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #333333;
                  display: flex;
                  align-items: center;

                  .el-icon-document {
                    font-family: 'iconfont' !important;
                    font-size: 20px;
                    color: $color-theme;
                    font-style: normal;
                    -webkit-font-smoothing: antialiased;
                  }

                  .el-icon-document:before {
                    content: '\e6a8';
                  }
                }

                .el-icon-close {
                  top: 10px;

                  display: none;
                }
              }

              .el-progress {
                display: none;
              }
            }
          }
        }
      }
    }
  }

  .demo-form-inline {
    :deep(.el-form-item__label) {
        color: #999999;
      }
    }
    :deep(.el-radio-button--mini .el-radio-button__inner) {
        font-size: 14px;
      }
    }
  }
</style>
