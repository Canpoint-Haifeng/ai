<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="content-top">
      <img
        v-if="dataTop.cover"
        :src="dataTop.cover"
        :alt="dataTop.name"
      >
      <img
        v-else
        src="@/assets/images/resource/books.jpg"
        :alt="dataTop.name"
      >
      <div class="content-top-right">
        <div class="title">
          {{ dataTop.name }}
          <span @click="onCollected(dataTop)">
            <i
              :class="{
                'el-icon-star-on': iscollected === 1,
                'el-icon-star-off': iscollected !== 1,
              }"
            />
            {{ iscollected === 1 ? '取消收藏' : '收藏' }}
          </span>
        </div>
        <div class="details">
          <span>全品作业本</span>
          <span>总题量：332</span>
        </div>
        <div class="subscribe">
          以学生为主体，以单元为整体，强调真实情境下的教学活动，根据学情设计课堂教学方案，探究基于核心素养下的大单元教学，以大单元教学设计为统领，配套教学课件、课时检测，单元总结提升，专项训练升华。
        </div>
      </div>
    </div>
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <!-- <div class="header">
            <span>{{ bookName }}</span>
            <i #reference" class="iconfont iconqiehuan" @click="goBookIndex"></i></template>
          </div> -->
          <div
            v-loading="treeLoading"
            class="content mytree"
          >
            <el-tree
              v-if="treeDataList.length"
              ref="lemonTreeChoose"
              :data="treeDataList"
              :indent="0"
              show-checkbox
              :props="defaultProps"
              :check-strictly="checkStrictly"
              :highlight-current="true"
              :expand-on-click-node="false"
              icon-class="icon-expand el-icon-plus"
              :empty-text="treeNotMsg"
              :current-node-key="1"
              node-key="id"
              @check="checkClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <span
                    class="tree-node-label"
                    @click="handleRowClick(node, data)"
                  >
                    <!--{{data.chapterName}}-->
                    <!--<el-tooltip-->
                    <!--placement="top-start"-->
                    <!--effect="light"-->
                    <!--popper-class="page-tooltip">-->
                    <!--<span #content">-->
                    <!--{{data.chapterName}}-->
                    <!--</span>-->
                    <!--<span>{{data.chapterName}}</span>-->
                    <!--</el-tooltip>-->
                    <span :title="data.chapterName">{{ data.name }}</span>
                  </span>
                </div>
              </template>
            </el-tree>
            <noresult-common
              v-else
              #empty"
              text="很遗憾，没有找到您要的数据"
            />
          </div>
        </div>
      </div>
      <div class="user-content-right">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <item-one
            v-if="activeName === 'first'"
            :d-tree="treeDataList"
            :book-id="bookId"
            :teach-id="teachId"
          />
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import ItemOne from './one-selection'
import merge from 'webpack-merge'
export default {
  components: {
    Breadcrumb,
    ItemOne,
  },
  data() {
    return {
      checkStrictly: false,
      treeLoading: false,
      treeNotMsg: '',
      teachId: '',
      bookId: '',
      bookName: '',
      questionId: '',
      questionDome: '',
      questionVisible: false,
      nickName: 'Smile',
      visible: false,
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '图书选题 ',
        },
        {
          path: '',
          isLink: false,
          text: '选择图书 ',
        },
        {
          path: '',
          isLink: false,
          text: '选择题目 ',
        },
      ],
      iscollected: 1,
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: 'chapterName',
        isLeaf: (data, node) => {
          return !data.hasChild
        },
      },
      treeDataList: [],
      dataTop: {},
    }
  },
  watch: {
    currSubject(val, old) {
      this.getRelationCategoryId(val.subjectCode)
    },
  },
  computed: {
    ...mapState([
      'currSubject',
      'bookCurrent',
      'gradeCurrent',
      'volumeCurrent',
    ]),
    tabActiveName() {
      return this.$route.query.tabActiveName
        ? this.$route.query.tabActiveName
        : 'first'
    },
  },
  created() {
    this.activeName = this.tabActiveName
    this.teachId = this.$route.query.tid // 获取教材ID
    this.bookId = this.$route.query.bid // 获取教材ID
    let pid = Number(this.$route.query.pid) // 获取教材ID
    let sid = Number(this.$route.query.sid) // 获取教材ID
    if (this.bookId) {
      this.getBookList()
    }
    if (
      Number(this.currSubject.subjectCode) !== sid ||
      Number(this.currSubject.periodCode) !== pid
    ) {
      this.$router.push({ name: 'booksSelection' })
    }
    // this.bookName = this.$route.query.name // 获取教材ID
    this.getBookInfo() // 获取图书信息
    this.getTreeDataList() // 获取侧边栏数据
    // this.getRelationCategoryId(this.currSubject.subjectCode) // 获取关联id
  },
  methods: {
    // 获取详情
    getBookList() {
      let params = {
        pageSize: Number(this.$route.query.pageSize),
        pageNum: Number(this.$route.query.pageNum),
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/paper-builder/book/getBookList' }, params).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              res.data.records.map(v => {
                if (v.id === this.$route.query.bid) {
                  this.iscollected = v.isCollect
                  this.dataTop = {
                    ...v,
                    cover: Object.entries(JSON.parse(v.cover))[0][1],
                  }
                }
              })
            }
          }
        },
      )
    },
    onCollected(data) {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        bookId: data.id,
        isCollect: this.iscollected !== 1 ? 1 : 2,
        source: 1,
      }
      this.newPost(
        { urlPath: '/paper-builder/personal/book/collect' },
        params,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (this.iscollected !== 1) {
            this.iscollected = 1
            this.$message.success('收藏成功')
          } else {
            this.iscollected = 2
            this.$message.success('取消收藏成功')
          }
        }
      })
    },
    // 选择子节点存储到VUEX
    treeClick(data, node) {
      node.checked = true
    },
    // 获取侧边栏数据
    getBookInfo() {
      let parms = {
        id: this.bookId,
      }
      this.wayGet(API.BOOK_API_QUERY_TEACH_DETAIL_BOOK_ID, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.bookName = res.data.teachName
        }
      })
    },
    // 获取侧边栏数据
    getTreeDataList() {
      let parms = {
        bookId: this.bookId,
        // chapterType: '0',
      }
      this.apiGet(
        { urlPath: '/paper-builder/book/getBookChapter' },
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.treeDataList = res.data
          this.treeLoading = false
        } else {
          this.treeLoading = false
          // this.treeNotMsg = res.msg
          this.$message.error(res.msg)
        }
      })
    },
    // 懒加载子集
    loadNode(node, resolve) {
      // 如果是第一层级 就return
      if (node.level === 0) {
        return
      }
      let parms = {
        chapterCode: node.data.chapterCode,
      }
      this.wayGet(API.BOOK_API_QUERY_CHAPTER_BY_PARENT, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          resolve(res.data)
        }
      })
    },
    // 懒加载子集
    handleClick(tab, event) {
      this.$router.push({
        query: merge(this.$route.query, { tabActiveName: tab.name }),
      })
      this.crumbsData[1].text = tab.label
    },
    // 点击行的选中状态
    handleRowClick(node, data) {
      node.checked = !node.checked
      if (node.checked) {
        this.$refs['lemonTreeChoose'].setChecked(node, true, true)
      } else {
        this.$refs['lemonTreeChoose'].setChecked(node, false, true)
      }
      this.checkClick() // 调用获取题目接口
    },
    // 点击复选框
    checkClick(data, isChecked) {
      let noMore = this.getSimpleCheckedNodes(
        this.$refs['lemonTreeChoose'].store,
      )
      let str = this.reQuids(JSON.stringify(noMore), 'chapterCode')
      this.Bus.$emit('chooseCheckNodeCode', str)
    },
    goBookIndex() {
      this.$router.push({ name: 'booksSelection' })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.content-top {
  background-color: $color-white;
  display: flex;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 17px;

  img {
    width: 94px;
    height: 130px;
    margin-right: 17px;
  }

  .content-top-right {
    flex: 1;

    .title {
      font-size: 14px;
      font-family: 'Microsoft YaHei', 微软雅黑;
      text-align: left;
      color: rgb(51, 51, 51);
      letter-spacing: 0px;
      line-height: 20px;

      i {
        background: #487fff22;
        border-radius: 6px;
        font-size: 16px;
        color: #487fff;
        display: inline-block;

        &:hover {
          color: #3e73cd;
        }
      }
    }

    .details {
      display: flex;
      margin: 20px 0;

      span {
        width: 89px;
        line-height: 20px;
        text-align: center;
        margin-right: 20px;
        background-color: rgb(226, 226, 226);
        border-radius: 4.5px;
        transition: unset;
      }
    }

    .subscribe {
      color: rgb(153, 153, 153);
    }

    .button {
      margin-top: 20px;
      text-align: right;
    }
  }
}

.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 70px;
  display: flex;

  .user-content-left {
    width: 270px;
    margin-right: 16px;

    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;

      .header {
        padding: 10px 50px 10px 14px;
        line-height: 20px;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: bold;
        border-bottom: 1px solid $color-background-l;
        position: relative;

        i {
          position: absolute;
          top: 10px;
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
    background-color: $color-white;

    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
      margin: 0;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
    }
  }
}
</style>
