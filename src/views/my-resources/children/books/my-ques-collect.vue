<template>
  <div
    v-if="questionsData.list.length"
    class="category-contain"
  >
    <ul class="paper-list">
      <li
        v-for="(item, index) in questionsData.list"
        :key="index"
        :title="item.bookName"
      >
        <img
          v-if="item.cover"
          :src="item.cover"
          :alt="item.bookName"
        >
        <img
          v-else
          src="@/assets/images/resource/books.jpg"
          :alt="item.bookName"
        >
        <i
          title="取消收藏"
          class="icon iconfont icon-guanbi"
          @click="cancelCollect(item)"
        />
      </li>
    </ul>
  </div>
  <noresult-common
    v-else
    v-slot:empty
    text="很遗憾，没有找到您要的图书"
  />
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
export default {
  props: {
    categoryLabel: {
      type: String,
      default: '等级',
    },
    // 是否显示全部
    isShowAll: {
      type: Boolean,
      default: true,
    },
    defaultTypeCode: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      currClassCode: 'currClassCode',
      currVersionCode: 'currVersionCode',
      currVolumnCode: 'currVolumnCode',
      currTypeCode: 'currTypeCode',
      currSubTypeCode: 0,
      questionsData: {
        list: [],
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    this.getQusListHttp()
  },
  methods: {
    getQusListHttp() {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        pageNum: this.questionsData.currPage,
        pageSize: this.questionsData.pageSize,
      }
      this.apiGet(
        { urlPath: '/paper-builder/self/book/collect/bookList' },
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data.data.length) {
            let list = []
            res.data.data.map(v => {
              if (v) {
                list.push({
                  ...v,
                  cover: Object.entries(JSON.parse(v.coverImage))[0][1],
                })
              }
            })
            console.log(list)
            this.questionsData = {
              list: list,
              currPage: 1,
              pageSize: 10,
              totalCount: res.data.total,
            }
          }
        } else {
          this.questionsData = {
            list: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
          }
          this.$message.error(res.msg)
        }
      })
    },
    cancelCollect(item) {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        bookId: item.bookUid,
        isCollect: 2,
        source: 1,
      }
      this.newPost(
        { urlPath: '/paper-builder/personal/book/collect' },
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.getQusListHttp()
          this.$message({ type: 'success', message: '取消收藏成功' })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    returnSelectCode(code) {
      return this[code]
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.category-contain {
  padding: 20px;
}

.paper-list {
  display: flex;
  flex-wrap: wrap;

  li {
    display: flex;
    margin: 10px;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    img {
      width: 94px;
      height: 130px;
      margin: auto;
    }

    .title {
      font-size: 14px;
      font-family: 'Microsoft YaHei', 微软雅黑;
      text-align: left;
      color: rgb(51, 51, 51);
      letter-spacing: 0px;
      line-height: 20px;
    }

    .icon-guanbi {
      color: #ff6e5d;
      font-size: 18px;
      position: absolute;
      right: 0;
      top: 0;
      display: none;
    }
  }

  li:hover {
    .icon-guanbi {
      display: block;
    }

    box-shadow: 0px 0px 10px 0px rgba(42, 77, 138, 0.18);
  }
}
</style>
