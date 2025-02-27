<template>
  <div class="div_knowPreview content-container">
    <!-- 头部内容 -->
    <div class="div_header">
      <span class="span_text">
        选择场景:
        <!-- <el-tooltip class="scsne_tip" effect="dark" placement="top">
          <template v-slot:content>
            <span>中高考复习试卷更适合细目表组卷或平行组卷</span>
          </template>
          <span class="dot el-icon-warning"></span>
        </el-tooltip> -->
      </span>
      <div class="itemWrap">
        <div
          v-for="item in scenceList"
          :key="item.id"
          class="div_item"
        >
          <div
            class="div_header_btn"
            :class="{ addClass: item.paperTypeId == currScence.paperTypeId }"
            @click="changeCurrScence(item)"
          >
            <i class="iconfont icon-bookmark_fill1" />
            {{ item.paperTypeName }}
          </div>
          <!-- <span class="span_line"> </span> -->
        </div>
      </div>
    </div>
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="header">
            <span v-if="teachCurrentName && volumeCurrentName">
              <span v-if="currSubject && currSubject.periodCode == '13'">{{ teachCurrentName }} / {{ gradeCurrentName }}</span>
              <span v-else>{{ teachCurrentName }} / {{ volumeCurrentName }}</span>
            </span>
            <span v-else>请点击图标，选择教材</span>
            <el-popover
              v-model="visible"
              placement="bottom"
              popper-class="select-popper"
              width="800"
              trigger="click"
            >
              <p class="popper-text-d">
                教材版本
              </p>
              <div class="popper-category-content">
                <div
                  v-if="teachData.length"
                  class="category-list"
                >
                  <div
                    v-for="item in teachData"
                    :key="item.dictId"
                    class="category-item"
                    :class="
                      String(teachCurrentCode) === String(item.id)
                        ? 'active'
                        : ''
                    "
                    @click="selectBook(item)"
                  >
                    {{ item.versionName }}
                  </div>
                </div>
                <p
                  v-else
                  class="text-empty"
                >
                  暂无数据!
                </p>
              </div>
              <div class="pd10" />
              <p
                v-show="classData.length"
                class="popper-text-d"
              >
                年级册
              </p>
              <div
                v-show="classData.length"
                class="popper-category-content"
              >
                <div
                  v-if="classData.length"
                  class="category-list"
                >
                  <div
                    v-for="(item, index) in classData"
                    :key="index"
                    class="category-item"
                    :class="
                      String(gradeCurrentCode) === String(item.gradeCode) &&
                        String(volumeCurrentCode) === String(item.volumeCode)
                        ? 'active'
                        : ''
                    "
                    @click="selectGrade(item)"
                  >
                    {{ item.volumeName }}
                  </div>
                </div>
              </div>
              <template #reference>
                <i class="iconfont icon-transfer_line" />
              </template>
            </el-popover>
          </div>
          <div
            v-loading="treeLoading"
            class="content mytree"
          >
            <el-tree
              ref="lemonTree"
              :data="treeDataList"
              :indent="0"
              :props="defaultProps"
              :highlight-current="true"
              show-checkbox
              empty-text="暂无数据"
              icon-class="icon-expand el-icon-plus"
              check-on-click-node
              node-key="id"
              :filter-node-method="filterNode"
              @check="checkClick"
            >
              <template #default="{ data }">
                <div class="custom-tree-node">
                  <span class="tree-node-label">
                    <!-- <el-tooltip class="item" effect="dark" placement="right">
                  </el-tooltip> -->
                    <!-- <template v-slot:content>
                      <span v-html="data.name"></span>
                    </template> -->
                    <i
                      v-if="data.types === 2"
                      class="el-icon-star-on coefficient"
                      style="color:#ff6e5d"
                    />
                    <span
                      class="nodeName"
                      :title="data.name"
                      v-html="data.name"
                    />
                  </span>
                </div>
              </template>
            </el-tree>
            <!-- <el-tree
              :data="treeDataList"
              :indent="0"
              show-checkbox
              :props="defaultProps"
              :check-strictly="checkStrictly"
              :highlight-current="true"
              :expand-on-click-node="false"
              :empty-text="treeNotMsg"
              icon-class="icon-expand el-icon-plus"
              ref="lemonTree"
              @check="checkClick"
              node-key="chapterCode"
            >
              <div class="custom-tree-node" v-v-slot:{ node, data }>
                <span
                  class="tree-node-label"
                  :title="data.chapterName"
                  @click="handleRowClick(node, data)"
                >
                  <span :title="data.chapterName">{{ data.chapterName }}</span>
                </span>
              </div>
            </el-tree> -->
          </div>
        </div>
      </div>
      <div class="user-content-right min-height750">
        <item-one
          :is-chapter="true"
          :cache="cache"
          :curr-scence="currScence"
          @delete-all="deleteAll"
          @del-parent="delParent"
          @del-children="delChildren"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import {
  isLogin,
  setCookieSubjectVolume,
  getCookieSubjectVolume,
} from '@/common/js/util'
import ItemOne from '@/views/smartPaper/components/one-selection-knowledge'
import { merge } from "lodash";
import { delCatalogueTypeByTree } from '@/common/js/util.js'
export default {
  name: 'Chapter',
  components: { ItemOne },
  beforeRouteEnter(to, form, next) {
    if (form.path === '/smartpaper/paperView') {
      next(vm => {
        vm.cache = true
      })
    } else {
      next(vm => {
        vm.cache = false
        vm.selectData = []
        vm.deleteAll()
        sessionStorage.removeItem('questionParams')
      })
    }
  },
  data() {
    return {
      checkStrictly: false,
      treeLoading: false,
      questionId: '',
      questionDome: '',
      questionVisible: false,
      nickName: 'Smile',
      visible: false,
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '智能选题',
        },
        {
          path: '',
          isLink: false,
          text: '按章节',
        },
      ],
      teachData: [],
      teachCurrentCode: '',
      teachCurrentName: '',
      classData: [],
      gradeCurrentCode: '',
      gradeCurrentName: '',
      volumeCurrentCode: '',
      volumeCurrentName: '',
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: 'chapterName',
        // disabled: function (data) {
        //   return !data.isClick
        // }
      },
      bookText: {},
      treeDataList: [],
      treeNotMsg: '暂无数据',
      currentNodeCodeChapter: null,
      currScence: {},
      scenceList: [],
      cache: false,
      selectData: [],
      queue: [],
    }
  },
  watch: {
    currSubject(n, o) {
      if (n.periodCode === o.periodCode && n.subjectCode === o.subjectCode)
        return
      this.getBookCategoryId()
      this.treeDataList = [] // 自控章节选题
    },
    // userInfo(v) {
    //   // 监听 userInfo 才会 访问
    //   this.getDefaultBookToBack() // 获取基本学段学科信息
    // },
  },
  activated() {
    if (!this.cache) {
      // this.getTreeDataList() // 获取侧边栏数据
      this.$refs.lemonTree.store._getAllNodes().map(n => (n.expanded = false))
    }
  },
  deactivated() {},
  computed: {
    ...mapState(['currSubject', 'userInfo']),
    tabActiveName() {
      return this.$route.query.tabActiveName
        ? this.$route.query.tabActiveName
        : 'first'
    },
  },
  mounted() {
    if (this.currSubject && this.currSubject.subjectCode) {
      this.getBookCategoryId()
    }
  },
  created() {
    this.activeName = this.tabActiveName
    // this.getDefaultBookToBack() // 获取基本学段学科信息
  },
  methods: {
    changeCurrScence(item) {
      this.currScence = item
      // this.checkClick()
      this.$refs.lemonTree.filter()
    },
    filterNode(v, data) {
      return !(data.types === 2 && [3, 4].includes(this.currScence.paperTypeId))
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
          // 帮后端处理数据
          res.data.forEach(v => {
            v.version = v.id
            v.versionName = v.name
            v.gradeList &&
              v.gradeList.forEach(y => {
                y.grade = y.gradeId
                y.volume = y.volumeId
              })
          })
          this.teachData = res.data
          const i = this.teachData.findIndex(v => v.versionIsDefault === 1)
          let item
          let child
          if (i !== -1) {
            item = this.teachData[i]
            child = this.teachData[i].gradeList
          } else {
            item = this.teachData[0]
            child = this.teachData[0].gradeList
          }
          this.teachCurrentCode = item.version
          this.classData =
            child &&
            child.map(v => {
              return {
                gradeCode: v.grade,
                gradeName: v.gradeName,
                volumeCode: v.volume,
                volumeName: v.volumeName,
              }
            })
          const data = this.classData[0]
          this.gradeCurrentCode = data.gradeCode
          this.volumeCurrentCode = data.volumeCode
          this.teachCurrentName = item.versionName
          this.volumeCurrentName = data.volumeName
          // if (this.currSubject.periodCode == '13') {
          //   this.gradeCurrentName = data.gradeName
          // } else {
          //   this.gradeCurrentName = data.gradeName + data.volumeName
          // }
          this.getChapter()
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    async getChapter() {
      const url = { urlPath: '/lesson-app/config/getCatalogueTree' }
      const params = {
        catalogueType: 10,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        grade: this.gradeCurrentCode,
        version: this.teachCurrentCode,
        volume: this.volumeCurrentCode,
      }
      const res = await this.apiGet(url, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        const list = res.data || []
        const loop = arr => {
          arr.forEach(v => {
            v.id = v.uuid
            v.isKnowledge = v.types === 1
            v.children && loop(v.children)
          })
        }
        loop(list)
        this.treeDataList = list
      } else {
        this.$message.error(res.msg)
      }
    },
    // 获取默认教材版本
    // getDefaultBook() {
    //   this.apiGet(API.GET_DEFAULT_SUBJECT).then(res => {
    //     if (res.data && res.code === CTS.constant.SUCCESS_CODE) {
    //       if (
    //         res.data.periodName === this.currSubject.periodName &&
    //         res.data.subjectName === this.currSubject.subjectName
    //       ) {
    //         this.teachCurrentName = res.data.bookVersionName
    //         this.teachCurrentCode = res.data.bookVersionCode
    //         this.gradeCurrentCode = res.data.gradeCode
    //         this.gradeCurrentName = res.data.gradeName
    //         this.volumeCurrentCode = res.data.volumeCode
    //         this.volumeCurrentName = res.data.volumeName
    //         this.getGradeCategoryId() // 获取年级
    //         this.getPaperList() // 获取右侧栏数据
    //       } else {
    //         this.getDefaultBookToBack() // 获取全品AI教研云后台的信息
    //       }
    //     }
    //   })
    // },
    // 获取全品AI教研云后台的默认学段学科
    // getDefaultBookToBack() {
    //   if (isLogin()) {
    //     if (!this.userInfo.userGuid) return
    //   } else {
    //     // 看缓存 里面有没有
    //     let currS = getCookieSubjectVolume(this.currSubject.subjectCode)
    //     if (currS && currS.volume) {
    //       this.teachCurrentName = currS.volume.tName
    //       this.volumeCurrentName = currS.volume.vName
    //       this.gradeCurrentName = currS.volume.gName
    //       this.teachCurrentCode = currS.volume.tCode
    //       this.gradeCurrentCode = currS.volume.gCode
    //       this.volumeCurrentCode = currS.volume.vCode

    //       this.getGradeCategoryId(this.teachCurrentCode) // 获取年级
    //       this.getPaperList() // 获取右侧栏数据
    //       return
    //     }
    //   }

    //   let strParams = {
    //     periodCode: this.currSubject.periodCode,
    //     subjectCode: this.currSubject.subjectCode,
    //   }
    //   this.getInvokeData(3, strParams, this.userInfo.userGuid || '').then(
    //     res => {
    //       if (res.code === CTS.constant.SUCCESS_CODE) {
    //         let codeObj = res.data.paramValue
    //         this.teachCurrentName = res.data.textbookVersionName
    //         this.volumeCurrentName = res.data.volumeName
    //         this.gradeCurrentName = res.data.gradeName
    //         this.teachCurrentCode = codeObj.textbookVersionCode
    //         this.gradeCurrentCode = codeObj.gradeCode
    //         this.volumeCurrentCode = codeObj.volumeCode
    //         this.getGradeCategoryId(codeObj.textbookVersionCode) // 获取年级
    //         this.getPaperList() // 获取右侧栏数据
    //       } else {
    //         return null
    //       }
    //     },
    //   )
    // },
    // 选择教材版本
    selectBook(item) {
      this.teachCurrentName = item.versionName
      this.teachCurrentCode = item.id
      this.gradeCurrentCode = ''
      this.gradeCurrentName = ''
      this.classData = item.gradeList.map(v => {
        return {
          gradeCode: v.grade,
          gradeName: v.gradeName,
          volumeCode: v.volume,
          volumeName: v.volumeName,
        }
      })
      this.volumeCurrentCode = ''
      this.volumeCurrentName = ''
      // this.getGradeCategoryId()
    },
    // 获取年级和册列表
    getGradeCategoryId() {
      // 需求分解 查询教材版本下的所有类
      let strParams = {
        versionCode: this.teachCurrentCode,
        subjectCode: this.currSubject.subjectCode,
      }
      var classArrVom = []
      this.$store
        .dispatch('getConfigData', {
          vm: this,
          type: 5,
          strParams: strParams,
          setKey: 'configVolume',
        })
        .then(res => {
          // 判断是否是高中学段
          if (String(this.currSubject.periodCode) === '13') {
            res.forEach(item => {
              let currItem = {
                gradeCode: item.code,
                gradeName: item.name,
                volumeCode: item.code,
                volumeName: '',
              }
              classArrVom.push(currItem)
            })
            this.classData = classArrVom
          } else {
            res.forEach(item => {
              if (item.children && item.children.length) {
                item.children.forEach(value => {
                  let currItem = {
                    gradeCode: item.code,
                    gradeName: item.name,
                    volumeCode: value.code,
                    volumeName: value.name,
                  }
                  classArrVom.push(currItem)
                })
              }
            })
            this.classData = classArrVom
          }
        })
    },
    // 选择年级版本
    selectGrade(item) {
      this.gradeCurrentCode = item.gradeCode
      this.gradeCurrentName = item.gradeName
      this.volumeCurrentCode = item.volumeCode
      this.volumeCurrentName = item.volumeName
      // 重置数据
      this.bookText = {}
      this.treeDataList = []
      this.visible = false
      this.getChapter()

      // // {"grade": "12121117", "volume": "121211171", "version": "121211"}
      // let volume = {
      //   tCode: this.teachCurrentCode,
      //   gCode: this.gradeCurrentCode,
      //   vCode: this.volumeCurrentCode,
      //   tName: this.teachCurrentName,
      //   gName: this.gradeCurrentName,
      //   vName: this.volumeCurrentName,
      // }
      // setCookieSubjectVolume(this.currSubject, volume)
      // this.addChooseConfig(this.currSubject.subjectCode, {
      //   grade: item.gradeCode,
      //   volume: item.volumeCode,
      //   version: this.teachCurrentCode,
      // })
    },
    // 获取侧边栏数据
    // getPaperList() {
    //   let strParams = {
    //     stage: this.currSubject.periodCode,
    //     subject: this.currSubject.subjectCode,
    //     versions: this.teachCurrentCode,
    //     grade: this.gradeCurrentCode,
    //     volume: this.volumeCurrentCode ? this.volumeCurrentCode : '0',
    //   }
    //   if (this.currSubject.periodCode == '13') {
    //     strParams.volume = '0'
    //   }
    //   if (
    //     strParams.stage &&
    //     strParams.subject &&
    //     strParams.versions &&
    //     strParams.grade
    //   ) {
    //     this.$store
    //       .dispatch('getConfigData', {
    //         vm: this,
    //         type: 6,
    //         strParams: strParams,
    //         setKey: 'configBookText',
    //       })
    //       .then(res => {
    //         if (res) {
    //           if (res && res.bookText) {
    //             this.bookText = res.bookText
    //           }
    //           if (res && res.chapters) {
    //             // this.treeDataList = this.setTreeLevel(res.chapters)
    //             let catalist = this.setTreeLevel(res.chapters)
    //             // 处理 将树中 catalogueType=='1' 的去掉
    //             this.treeDataList = delCatalogueTypeByTree(catalist)
    //           } else {
    //             this.treeDataList = []
    //           }
    //           this.treeLoading = false
    //         } else {
    //           this.treeLoading = false
    //           this.treeDataList = []
    //         }
    //       })
    //   }
    // },
    // 点击行的选中状态
    handleRowClick(node, data) {
      node.checked = !node.checked
      if (node.checked) {
        this.$refs['lemonTree'].setChecked(node, true, true)
      } else {
        this.$refs['lemonTree'].setChecked(node, false, true)
      }
      this.checkClick() // 调用获取题目接口
    },
    // 点击复选框选中事件
    // checkClick(data, isChecked) {
    //   let noMore = this.getSimpleCheckedNodes(this.$refs['lemonTree'].store)
    //   this.currentNodeCodeChapter = noMore
    // },
    handleClick(tab, event) {
      this.$router.push({
        query: merge(this.$route.query, { tabActiveName: tab.name }),
      })
      this.crumbsData[1].text = tab.label
    },
    // 全部清空知识点
    deleteAll() {
      this.$refs['lemonTree'].setCheckedKeys([])
    },
    delParent(node) {
      this.$refs['lemonTree'].setChecked(node.id, false, true)
      this.checkClick()
    },
    // 单个删除
    delChildren(node) {
      this.$refs['lemonTree'].setChecked(node.id, false, true)
      this.checkClick()
    },
    // 复选框点击
    checkClick() {
      this.selectData = []
      const testType = this.currScence.testType
      console.log(this.$refs['lemonTree'].store, 111)
      let nodes = this.getSimpleCheckedNodes(this.$refs['lemonTree'].store)
      // let nodes = this.$refs['lemonTree'].getCheckedNodes()
      console.log(nodes, 'nodes')
      nodes.forEach(v => {
        const node = this.$refs.lemonTree.getNode(v.id)
        // if (testType) {
        //   // 大考
        //   if (v.level < 3) {
        //     v.children.forEach((c) => {
        //       const sNode = this.$refs.lemonTree.getNode(c.id)
        //       this.examTransform(sNode.parent, sNode)
        //     })
        //   } else {
        //     this.examTransform(node.parent, node)
        //   }
        //   // this.examTransform(node.parent, node)
        // } else {
        // 普通
        const flag = this.transformNode(node.parent, node)
        if (!flag && v.children && v.children.length) {
          this.queue.push(...v.children)
          this.findDown()
        }
        // }
      })

      this.Bus.$emit('interCheckNodeCodeKnowledge', this.selectData)
    },
    findDown() {
      console.log('this.queue=======', this.queue)
      while (this.queue.length !== 0) {
        const data = this.queue.shift()
        if (data.isKnowledge) {
          const index = this.selectData.findIndex(v => v.id === data.id)
          const cNode = { ...data, selChildren: data.children || [] }
          if (index !== -1) {
            if (data.children) {
              this.selectData[index].selChildren.push(data.children)
            }
          } else {
            this.selectData.push(cNode)
          }
        } else {
          if (data.children && data.children.length) {
            this.queue.unshift(...data.children)
          }
        }
      }
    },
    transformNode(pNode, node) {
      const data = node.data
      const pData = pNode.data
      if (Array.isArray(pData)) {
        // this.$message.error('当前节点上没有知识点')
        return false
      }
      if (data.isKnowledge) {
        const cNode = { ...data, selChildren: data.children || [] }
        this.selectData.push(cNode)
        return true
      } else if (pData.isKnowledge) {
        const index = this.selectData.findIndex(v => v.id === pData.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...pData, selChildren: [data] }
          this.selectData.push(p)
        }
        return true
      } else {
        return this.transformNode(pNode.parent, node)
      }
    },
    // findDown(data) {
    //   if (data.isKnowledge) {
    //     const index = this.selectData.findIndex(v => v.id === data.id)
    //     const cNode = { ...data, selChildren: data.children || [] }
    //     if (index !== -1) {
    //       if (data.children) {
    //         this.selectData[index].selChildren.push(data.children)
    //       }
    //     } else {
    //       this.selectData.push(cNode)
    //     }
    //   } else {
    //     if (data.children) {
    //       data.children.forEach(v => {
    //         this.findDown(v)
    //       })
    //     }
    //   }
    // },
    examTransform(pNode, node) {
      const data = node.data
      const pData = pNode.data
      if (Array.isArray(pData)) {
        this.$message.error('当前节点上没有知识点')
        return false
      }
      if (data.isKnowledge) {
        const index = this.selectData.findIndex(v => v.id === pData.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...pData, selChildren: [data] }
          this.selectData.push(p)
        }
      } else if (pData.isKnowledge) {
        const aNode = pNode.parent.data
        const index = this.selectData.findIndex(v => v.id === aNode.id)
        if (index !== -1) {
          this.selectData[index].selChildren.push(data)
        } else {
          const p = { ...aNode, selChildren: [data] }
          this.selectData.push(p)
        }
      } else {
        this.examTransform(pNode.parent, node)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.div_header {
  padding: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  margin: 12px 0px 12px 286px;
  min-height: 56px;
  box-sizing: border-box;
  .itemWrap {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
  }
  .span_text {
    width: 80px;
    min-width: 70px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    position: relative;
    :deep(.scsne_tip) {
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: 11px;
      border-radius: 50%;
      color: #ff0000;
    }
  }
  .div_item {
    padding: 0px 20px;
    box-sizing: border-box;
    margin-right: 10px;
    position: relative;
    flex: 0 1 auto;

    &::after {
      content: '';
      width: 0px;
      height: 20px;
      border: 1px solid #eeeeee;
      position: absolute;
      right: -2px;
      top: 7px;
    }
    &:last-child {
      &::after {
        content: '';
        display: none;
      }
    }
    // .span_line {
    //   width: 0px;
    //   height: 20px;
    //   border: 1px solid #eeeeee;
    // }
  }
  .div_header_btn {
    padding: 0 5px;
    width: 90px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .addClass {
    border-radius: 20px 20px 20px 20px;
    background: #4b8ff5;
    color: #ffffff;
  }
}
.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 20px;
  display: flex;
  .user-content-left {
    width: 270px;
    margin-right: 16px;
    margin-top: -68px;
    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;
      .header {
        height: 44px;
        line-height: 44px;
        padding: 0 14px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        border-bottom: 1px solid $color-background-l;
        position: relative;
        box-sizing: border-box;
        i {
          position: absolute;
          right: 14px;
          cursor: pointer;
          color: $color-theme;
        }
      }
      .content {
        padding: 17px 14px 17px 0;
      }
    }
  }
  .user-content-right {
    width: 914px;
    height: min-content;
    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
    }
    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
    }
    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
    }
  }
}
.custom-tree-node {
  text-indent: 0 !important;
  padding-left: 0 !important;
}
.nodeName {
  // overflow: hidden;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // -webkit-box-orient: vertical;
  // text-overflow: ellipsis;
  // white-space: normal;
}
</style>
