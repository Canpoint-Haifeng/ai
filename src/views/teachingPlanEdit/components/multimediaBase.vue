<template>
  <div>
    <el-drawer
      v-model:visible="visible"
      title="多媒体库"
      direction="rtl"
      size="900px"
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
        <div class="multimedia_filter">
          <div>
            <em>类型</em>
            <span
              v-for="v in options"
              :key="v.value"
              :class="{'active': formData.type === v.value}"
              @click="typeChange(v)"
            >{{ v.label }}</span>
          </div>
          <div>
            <em>搜索</em>
            <el-input
              v-model="formData.keyword"
              placeholder="请输入内容"
              size="small"
              clearable
              @keyup.enter="currentChange(1)"
            >
              <template #suffix>
                <i
                  class="iconfont icon-search_3_line"
                  @click="currentChange(1)"
                />
              </template>
            </el-input>
          </div>
        </div>
        <div class="sort_total">
          <div class="sort_list">
            <!-- <span :class="{ active: params.sortType === 1 }" @click="changeSortState(1)">
                            综合<i class="iconfont icon-transfer_2_line"></i>
                        </span> -->
            <span
              :class="formData.sortType === 2 ? 'active' : ''"
              @click="changeSortType(2)"
            >最新<i
              class="iconfont icon-transfer_2_line"
            /></span>
            <span
              :class="formData.sortType === 3 ? 'active' : ''"
              @click="changeSortType(3)"
            >最热<i
              class="iconfont icon-transfer_2_line"
            /></span>
          </div>
          <div class="total">
            共 <span>{{ pagination.total }}</span> 条
          </div>
        </div>
        <div class="multimedia_list">
          <noresult-common
            v-if="!pagination.total"
            v-slot:empty
            text="很遗憾，没有找到您要的内容"
          />
          <div
            v-for="(v, i) in list"
            :key="i"
            class="item"
          >
            <div
              v-if="formData.type === 3"
              class="audio"
            >
              <i class="iconfont icon-yinle" />
              <div>
                <p>sjkdskjdhsjs</p>
                <span>10:10:10</span>
              </div>
            </div>
            <div
              v-else
              class="content"
            >
              <div class="img">
                <img
                  src=""
                  alt=""
                >
                <span>10:10:10</span>
              </div>
              <p>锐角三角形函数</p>
            </div>
            <div id="footer">
              <span>提供者：全品文教</span>
              <div>
                <el-button type="text">
                  <i class="iconfont icon-zan1" />999
                </el-button>
                <el-button type="text">
                  报错
                </el-button>
                <el-button
                  type="primary"
                  round
                  size="mini"
                  icon="el-icon-plus"
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
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import treeSelect from "./treeSelect.vue";
import question from "./question.vue";
import filterItem from "./filterItem.vue";
import more from "./more.vue";
export default {
    components: {
        treeSelect, question, filterItem, more, 
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
            options: [{ label: '视频', value: 1 }, { label: '动画', value: 2 }, { label: '音频', value: 3 }],
            formData: {
                type: 1,
                keyword: '',
                sortType: 1,
            },
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
        moreChange() {

        },
        typeChange(v) {
            this.formData.type = v.value;
            this.getList()
        },
        changeSortType(i) {
            this.formData.sortType = i;
            this.getList()
        },
        currentChange(i) {
            this.pagination.pageNum = i;
            this.getList()
        },
        getList() {
            this.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        },
    },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
:deep(.el-drawer) {
    .el-drawer__body .drawer_content{
        padding: 0 20px;
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
        .multimedia_filter {
            border-radius: 8px;
            border: 1px solid #E2E2E2;
            padding: 20px;
            margin: 20px 0 30px;
            >div {
                display: flex;
                align-items: center;
                &:not(:last-child) {
                    margin-bottom: 14px;
                }
                >em {
                    font-weight: bold;
                    font-size: 14px;
                    margin-right: 30px;
                    line-height: 24px;
                }
                >span {
                    border-radius: 12px;
                    line-height: 24px;
                    padding: 0 15px;
                    margin-right: 4px;
                    cursor: pointer;
                    transition: all .2s;
                    &:not(.active):hover {
                        color: #487FFF;
                    } 
                    &.active {
                        background: #487FFF;
                        color: #fff;
                    }
                }
                .el-input {
                    width: 380px;
                    input {
                        border-radius: 4px;
                    }
                    .el-input__suffix {
                        display: flex;
                        align-items: center;
                    }
                    .iconfont {
                        font-size: 20px;
                        cursor: pointer;
                    }
                }
            }
        }
        .sort_total {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
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
        .multimedia_list {
            height: calc(100vh - 335px);
            overflow: auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 20px 10px;
            align-content: start;
            .item {
                border-radius: 6px;
                border: 1px solid #E2E2E2;
                .audio {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    i {
                        font-size: 20px;
                        color: #487FFF;
                        margin-right: 12px;
                    }
                    div {
                        p {
                            margin-bottom: 4px;
                        }
                        span {
                            font-size: 12px;
                            color: #666;
                        }
                    }
                }
                .content {
                    padding: 10px;
                    .img {
                        position: relative;
                        margin-bottom: 10px;
                        img {
                            width: 100%;
                            height: 230px
                        }
                        span {
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            font-size: 12px;
                            color: #fff;
                            padding: 4px 10px;
                            border-radius: 5px;
                            background: rgba(0, 0, 0, .5);
                        }
                    }
                }
                #footer {
                    background: #F6F6F6;
                    border-radius: 0px 0px 6px 6px;
                    padding: 0 10px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 12px;
                    border-top: 1px solid #e2e2e2;
                    .el-button--mini.is-round {
                        padding: 4px 8px;
                    }
                    >div {
                        display: flex;
                        align-items: center;
                    }
                    .el-button {
                        margin-left: 10px;
                        display: flex;
                        font-size: 12px;
                        > span {
                            display: flex;
                            align-items: center;
                            i {
                                font-size: 16px;
                                margin-right: 1px;
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
