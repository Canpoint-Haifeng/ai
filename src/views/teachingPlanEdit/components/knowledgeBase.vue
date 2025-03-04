<template>
  <div>
    <el-drawer
      :visible="visible"
      @update:visible="visible = $event"
      title="知识库"
      direction="rtl"
      size="800px"
    >
      <div class="drawer_content">
        <div class="knowledge_point">
          <el-popover
            v-model="popoverVisible"
            placement="bottom-start"
            width="400"
            trigger="click"
            popper-class="version_grade"
          >
            <treeSelect @select="selectNode" />
            <template #reference>
              <div class="checked">
                <span>{{ knowledge.name || '请选择知识点' }}</span>
                <i class="iconfont icon-down_line" />
              </div>
            </template>
          </el-popover>
        </div>
        <div class="list">
          <noresult-common
            v-if="!pagination.total"
            #empty"
            text="很遗憾，没有找到您要的内容"
          />
          <div
            v-for="(v, i) in list"
            :key="i"
            class="item"
          >
            <div class="content">
              <h5>{{ names[type - 1] }}</h5>
              <p v-html="v.contentText" />
              <!-- <div class="img">
                                <img src="" alt="">
                            </div> -->
            </div>
            <div id="footer">
              <span>提供者：全品文教</span>
              <div>
                <el-button type="text">
                  <i class="iconfont icon-zan1" />999
                </el-button>
                <el-button
                  type="text"
                  @click="reportError(v)"
                >
                  报错
                </el-button>
                <el-button
                  type="primary"
                  round
                  size="mini"
                  @click="handleReplace(v)"
                >
                  替换
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            v-if="pagination.total"
            background
            layout="prev, pager, next, jumper"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.pageNum"
            @current-change="currentChange"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import treeSelect from './treeSelect.vue'

export default {
  components: {
    treeSelect,
  },
  inject: ['app'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
    },
  },
  data() {
    return {
      names: [
        '知识结构',
        '预习目标',
        '预习任务',
        '预习填空',
        '教学目标',
        '重点难点',
        '教学方法',
        '知识梳理',
      ],
      pagination: {
        total: 100,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      knowledge: {
        name: '',
        id: '',
      },
      popoverVisible: false,
      catalogType: 1,
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    value(v) {
      if (v) {
        this.knowledge = this.app.currentKnowledge
        this.getList()
      } else {
        this.list = []
        this.pagination.pageNum = 1
        this.pagination.total = 0
      }
    },
  },
  created() {
    this.catalogType = this.app.type
  },
  methods: {
        currentChange(i) {
            this.pagination.pageNum = i;
            this.getList()
        },
        selectNode(v) {
            this.catalogType = v.catalogType
            this.knowledge.id = v.uuid;
            this.knowledge.name = v.name;
            this.popoverVisible = false;
            this.pagination.pageNum = 1
            this.getList()
        },
        getList() {
            const params = {
                // stage: this.currSubject.periodCode,
                // subject: this.currSubject.subjectCode,
                catalogType: +this.catalogType || 1,
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                catalogIds: this.knowledge.id || '01071821-0cc7-9566-f578-544695447552',
                objectiveType: this.type,
                // version: 3,
            }
            const urlPath = this.type === 8 ? '/lesson-app/material/getKnowledgeList' : '/lesson-app/material/getObjectiveList'
            this.apiGet({ urlPath }, params).then(res => {
                if(res.code == 200) {
                    this.list = res.data.records
                    this.pagination.total = res.data.total
                } else {
                    this.list = []
                    this.pagination.total = 0
                }
            })
        },
        handleReplace(v) {
            this.$emit('select', v.contentText)
        },
        reportError(v){
            this.$emit('knowledgeErrorClick', v)
        }
  },
  
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer) {
  .el-drawer__body .drawer_content {
    padding: 0 20px 20px;
    .knowledge_point {
      display: flex;
      .checked {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          font-weight: bold;
          font-size: 16px;
          margin-right: 4px;
        }
      }
    }
    .list {
      height: calc(100vh - 160px);
      overflow: auto;
      h5 {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .item {
        border-radius: 6px;
        border: 1px solid #e2e2e2;
        margin-top: 20px;
        .content {
          padding: 20px;
          max-height: 300px;
          overflow: auto;
        }
        #footer {
          background: #f6f6f6;
          border-radius: 0px 0px 6px 6px;
          padding: 0 20px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          border-top: 1px solid #e2e2e2;
          .el-button--mini.is-round {
            padding: 4px 15px;
          }
          .el-button {
            margin-left: 12px;
            padding: 0;
            > span {
              display: flex;
              align-items: center;
              i {
                font-size: 16px;
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
