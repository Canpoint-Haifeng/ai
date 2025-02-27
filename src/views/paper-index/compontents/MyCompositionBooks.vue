<template>
  <div class="my-book-list-list">
    <div
      v-for="bookInfo in books"
      :key="bookInfo.id"
      class="my-book-list-item"
    >
      <div
        v-if="bookInfo.id != -1"
        class="my-book-block"
      >
        <div
          class="my-book-item"
          @click="openBookDetail(bookInfo)"
        >
          <!-- <img class="book-cover" :src="bookInfo.bookCover" /> -->
          <book-image :book-info="bookInfo" />
          <div
            class="book-name"
            :title="bookInfo.bookName"
          >
            {{ bookInfo.bookName }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="my-book-item add-book-item"
        @click="onAddBook"
      >
        <div class="add-book-content">
          <div class="inner-block">
            <div class="add-book-box">
              <span class="add-book el-icon-plus" />
            </div>
            <div class="add-label">
              创建图书
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BookImage from '@/components/CpFan/Books/book-image-mini'
  export default {
    components: { BookImage },
    props: {
      books: Array,
    },
    data() {
      return {}
    },
    methods: {
      onAddBook() {
        this.openSystemPathLink('paper/resources/books')
      },
      openBookDetail(item) {
        let queryStr = `id=${item.id}&source=${item.source}&bookName=${item.bookName}`
        this.openSystemPathLink('paper/resources/bookdetail?' + queryStr)
      },
    },
  }
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
  .my-book-list-list {
    padding: 0 20px;
    .my-book-list-item {
      display: inline-block;
      cursor: pointer;
      box-sizing: border-box;
      width: 151px;
      min-height: 200px;
      background: #ffffff;
      vertical-align: top;
      margin-right: 80px;

      &:nth-child(5n) {
        margin-right: 0px;
      }
    }
  }
  .my-book-item {
    .book-name {
      margin: 10px 0;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      line-height: 20px;
      height: 40px;
    }
    &:hover {
      .book-name {
        color: $color-theme;
      }
    }
  }
  .add-book-item {
    .add-book-content {
      cursor: pointer;
      width: 151px;
      height: 178px;
      background: #ffffff;
      border: 1px solid #e2e2e2;
      box-shadow: 0px 0px 10px 0px rgba(42, 77, 138, 0.2);
      border-radius: 4px;
      padding: 16px;
      box-sizing: border-box;
    }
    .inner-block {
      width: 116px;
      height: 146px;
      border: 1px dashed #d1d1d1;
      border-radius: 4px;
    }

    .add-book-box {
      text-align: center;
      padding: 40px 0 10px 0;
      .add-book {
        font-size: 55px;
        color: $color-theme;
      }
    }
    .add-label {
      text-align: center;
      font-size: 14px;
      color: #333333;
    }
    &:hover {
      .add-label {
        color: $color-theme;
      }
      .add-book-box {
        color: $color-theme;
      }
    }
  }
</style>
