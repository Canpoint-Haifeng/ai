<template>
  <div>
    <el-dialog
      :visible="visible"
      title="下载教案"
      width="600px"
      @update:visible="visible = $event"
    >
      <div class="download_content">
        <div class="item">
          <div class="label">
            <span>下载版本：</span>
          </div>
          <div>
            <el-radio-group v-model="formData.downloadType">
              <el-radio :label="1">
                教师版
              </el-radio>
              <el-radio :label="2">
                学生版（答案解析统一放置在卷尾）
              </el-radio>
            </el-radio-group>
            <!-- <div class="tip"></div> -->
          </div>
        </div>
        <!-- <div class="item">
                    <div class="label">
                        <span>是否显示答案解析：</span>
                    </div>
                    <div>
                        <el-radio-group v-model="formData.showAnswer">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </div>
                </div> -->
        <div class="item">
          <div class="label">
            <span>知识讲解模板：</span>
            <p @click="viewExample('1' + formData.knowledgeType)">
              查看样例
            </p>
          </div>
          <div>
            <el-radio-group v-model="formData.knowledgeType">
              <el-radio :label="1">
                聚合式（知识梳理汇总在一起）
              </el-radio>
              <el-radio :label="2">
                分散式（知识梳理分散在各知识点内）
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <span>文件类型：</span>
          </div>
          <div>
            <!-- <el-checkbox-group v-model="formData.fileType" style="margin-bottom: 8px;">
                            <el-checkbox label="word">Word</el-checkbox>
                            <el-checkbox label="pdf">PDF</el-checkbox>
                            <el-checkbox label="ppt" v-show="formData.downloadType === 1">PPT</el-checkbox>
                        </el-checkbox-group> -->
            <el-radio-group
              v-model="formData.fileType"
              style="margin-bottom: 8px;"
            >
              <el-radio label="doc">
                Word2003
              </el-radio>
              <el-radio label="docx">
                Word2010
              </el-radio>
              <el-radio label="pdf">
                PDF
              </el-radio>
            </el-radio-group>

            <!-- <el-radio-group v-show="formData.fileType.includes('word')" v-model="formData.word">
                        </el-radio-group> -->
          </div>
        </div>
        <div class="item">
          <div class="label">
            <span>文档模板样式：</span>
            <p @click="viewExample('2' + formData.fileTempStyle)">
              查看样例
            </p>
          </div>
          <div>
            <el-radio-group v-model="formData.fileTempStyle">
              <el-radio :label="1">
                样式一
              </el-radio>
              <el-radio :label="2">
                样式二
              </el-radio>
              <el-radio :label="3">
                样式三
              </el-radio>
              <el-radio :label="4">
                样式四
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- <div class="item" v-show="formData.fileType.includes('ppt') && formData.downloadType === 1">
                    <div class="label">
                        <span>PPT模板样式：</span>
                        <p>查看样例</p>
                    </div>
                    <div>
                        <el-radio-group v-model="formData.ppt">
                            <el-radio :label="1">样式一</el-radio>
                            <el-radio :label="2">样式二</el-radio>
                            <el-radio :label="3">样式三</el-radio>
                            <el-radio :label="4">样式四</el-radio>
                        </el-radio-group>
                    </div>
                </div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="confirm"
          >下 载</el-button>
        </span>
      </template>
      <el-image
        ref="img"
        style="width: 0; height: 0"
        :src="img"
        :preview-src-list="[img]"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import question from './question.vue'
export default {
  components: {
    question,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    info: {
      default: () => {},
    },
    source: {
      default: '',
    },
  },
  setup(props, { emit }) {
    const imgRef = ref(null)
    const state = reactive({
      formData: {
        downloadType: 1,
        knowledgeType: 1,
        fileType: 'doc',
        word: 'doc',
        fileTempStyle: 1,
        ppt: 1,
      },
      img: '',
      loading: false
    })

    const visible = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const oldQuestion = computed(() => {
      return props.currentObj?.generalQuestionVo || {}
    })

    const viewExample = (i) => {
      // Use Vite's asset handling for images
      const images = import.meta.glob('./img/*.jpg', { eager: true })
      state.img = new URL(`./img/${i}.jpg`, import.meta.url).href
      imgRef.value.clickHandler()
    }
    
    const confirm = () => {
      state.loading = true
      let params = {
        ...state.formData,
        // fileType: state.formData.fileType === 'word' ? state.formData.word : state.formData.fileType,
        lessonInfoId: props.info.id,
        source: props.source || props.route?.query.source || 2,
        lessonType: props.info.lessonType,
        showAnswer: state.formData.downloadType === 1,
      }
      const urlPath = `/lesson-app/myLesson/downloadWithOSS`
      // Using the global API client
      // TODO: Replace with proper API call
      fetch(urlPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
        .then(response => response.json())
        .then(res => {
          if (res.code == 200) {
            download(res.data)
            emit('input', false)
            // TODO: Replace with Element Plus message
            alert('开始下载')
          } else {
            // TODO: Replace with Element Plus message
            alert(res.msg || '下载失败')
          }
        })
        .finally(() => {
          state.loading = false
        })
    }
    
    const download = (url) => {
      const link = document.createElement('a')
      link.href = url
      link.download = `${props.info.title || '教案'}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return {
      ...toRefs(state),
      imgRef,
      viewExample,
      confirm,
      download,
      visible
    }
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
:deep(.el-dialog) {
  .download_content {
    padding: 20px 30px 0;
    .item {
      .label {
        display: flex;
        margin-bottom: 12px;
        p {
          color: #487fff;
          font-size: 12px;
          cursor: pointer;
          margin-left: 12px;
        }
      }
      margin-bottom: 16px;
    }
  }
  .el-dialog__footer {
    padding: 20px;
    text-align: center;
  }
  .el-image {
    .el-icon-circle-close {
      color: #fff;
    }
  }
}
</style>

