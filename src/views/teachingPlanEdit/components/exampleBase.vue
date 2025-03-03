<template>
  <div>
    <el-drawer
      v-model:visible="visible"
      title="碎片库"
      direction="rtl"
      size="800px"
    >
      <div class="drawer_content">
        <div class="knowledge_point">
          <el-popover
            v-model="popoverVisible"
            placement="bottom-start"
            width="700"
            trigger="click"
            popper-class="version_grade"
          >
            <treeSelect @select="selectNode" />
            <template #reference>
              <div 
                class="checked"
              >
                <span>{{ knowledge.name || '请选择知识点' }}</span>
                <i class="iconfont icon-down_line" />
              </div>
            </template>
          </el-popover>
        </div>
        <div class="sort_total">
          <div class="sort_list">
            <span
              :class="sortType === 1 ? 'active' : ''"
              @click="changeSortType(1)"
            >最新<i
              class="iconfont icon-transfer_2_line"
            /></span>
            <span
              :class="sortType === 2 ? 'active' : ''"
              @click="changeSortType(2)"
            >最热<i
              class="iconfont icon-transfer_2_line"
            /></span>
          </div>
          <div class="total">
            共 <span>{{ pagination.total }}</span> 条
          </div>
        </div>
        <div class="list">
          <noresult-common
            v-if="!pagination.total"
            slot="empty"
            text="很遗憾，没有找到您要的内容"
          />
          <div
            v-for="(v, i) in list"
            :key="i"
            class="item"
          >
            <div class="content">
              <div class="example">
                <span class="iconfont icon-tag_2_fill" />
                <h5>例题</h5>
              </div>
              <question
                type="4"
                :info="v.outline.content[0].generalQuestionVo"
              />
              <template v-for="(y, j) in v.outline.child">
                <div v-if="y.name === '课内练习'">
                  <h5>课内练习</h5>
                  <question
                    v-for="(x, k) in y.content"
                    :key="k"
                    type="4"
                    :info="x.generalQuestionVo"
                  />
                </div>
                <div v-else>
                  <h5>课后作业</h5>
                  <question
                    v-for="(x, k) in y.content"
                    :key="k"
                    type="4"
                    :info="x.generalQuestionVo"
                  />
                </div>
              </template>
            </div>
            <div id="footer">
              <span>提供者：全品文教</span>
              <div>
                <el-button type="text">
                  <i class="iconfont icon-zan1" />999
                </el-button>
                <el-button type="text">
                  详情
                </el-button>
                <el-button
                  type="primary"
                  round
                  size="mini"
                  icon="el-icon-plus"
                  @click="select(v)"
                >
                  添加
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
import treeSelect from "./treeSelect.vue";
import question from "./question.vue";
export default {
    components: {
        treeSelect, question, 
    },
    inject: ['app'],
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        type: {
            type: Number,
        }
    },
    data() {
        return {
            sortType: 1,
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
        };
    },
    computed: {
        visible: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
    watch: {
        value(v) {
            if(v) {
                this.knowledge = this.app.currentKnowledge
                this.getList()
            } else {
                this.list = []
                this.pagination.total = 0
            }
        }
    },
    created() {
        this.catalogType = this.app.type
    },
    methods: {
        selectNode(v) {
            this.catalogType = v.catalogType
            this.knowledge.id = v.uuid;
            this.knowledge.name = v.name;
            this.popoverVisible = false;
            this.pagination.pageNum = 1
            this.getList()
        },
        changeSortType(i) {
            this.sortType = i;
            this.pagination.pageNum = 1
            this.getList()
        },
        currentChange(i) {
            this.pagination.pageNum = i;
            this.getList()
        },
        getList() {
            const params = {
                // stage: this.currSubject.periodCode,
                // subject: this.currSubject.subjectCode,
                catalogType: this.catalogType,
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                catalogIds: this.knowledge.id || '01071821-0cc7-9566-f578-544695447552',
                sortType: this.sortType,
                pieceType: 3,
            }
            this.apiGet({ urlPath: '/lesson-app/material/getPieceList' }, params).then(res => {
                if(res.code == 200) {
                    this.list = res.data.records
                    this.pagination.total = res.data.total
                } else {
                    this.list = []
                    this.pagination.total = 0
                }
            })
        },
        select(v) {
            this.$emit('select', v)
        },
    },
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer) {
    .el-drawer__body .drawer_content{
        padding: 0 20px 20px;
        .knowledge_point {
            display: flex;
            margin-bottom: 20px;
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
        .sort_total {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            .sort_list {
                display: flex;
                align-items: center;
                >span {
                    margin-right: 30px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    &.active,
                    &:hover {
                        color: #487FFF;
                    }
                    i {
                        font-size: 16px;
                        transform: translate(-4px, 1px) rotateX(180deg);
                    }
                }
            }
            .total {
                font-size: 12px;
                span {
                    color: #FF6900;
                }
            }
        }
        .list {
            height: calc(100vh - 190px);
            overflow: auto;
            .item {
                border-radius: 6px;
                border: 1px solid #E2E2E2;
                margin-top: 20px;
                h5 {
                    padding-left: 10px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 14px 10px;
                    .example {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        padding-left: 10px;
                        h5 {
                            padding-left: 0;
                            margin-bottom: 0;
                        }
                        span {
                            color: #487FFF;
                            margin-right: 10px;
                        }
                    }
                    .question {
                        .question_info {
                            padding: 10px;
                        }
                    }
                }
                #footer {
                    background: #F6F6F6;
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
                    >div {
                        display: flex;
                        align-items: center;
                    }
                    .el-button {
                        margin-left: 12px;
                        display: flex;
                        align-items: center;
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
