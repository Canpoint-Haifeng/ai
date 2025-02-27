<template>
  <div>
    <!-- <div class="help-link">
      <el-button class="btn btn-border">上传帮助<i class="el-icon-arrow-right"></i></el-button>
    </div> -->
    <!-- <div class="upload-tips" @click="redirectPasge"></div> -->
    <div
      class="small-banner"
      @click="redirectOtherPage"
    >
      <img
        src="@/assets/images/small-banner.png"
        alt="招募图"
        width="260"
        height="100"
      >
    </div>
  </div>
</template>

<script>
import commonUrl from '@/common/js/project-url'
export default {
  data() {
    return {
      rankingData: [
        {
          username: '用户138****4567',
          income: '10358.7',
        },
        {
          username: '黎明晓晓',
          income: '9975.0',
        },
        {
          username: '弯弯月',
          income: '9655.5',
        },
        {
          username: '胖胖猪',
          income: '7685.1',
        },
        {
          username: '用户138****4567',
          income: '10358.7',
        },
      ],
    }
  },
  methods: {
    help() {
      this.openWindowLink(commonUrl.sjscUrl)
    },
    redirectPage() {
      this.$router.push({ path: '/paper/plaza/goodPaperCollect/collectPage' })
    },
    redirectOtherPage() {

        
    }
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.help-link {
  background: $color-white;
  padding: 20px 14px;
  margin-bottom: 16px;
  .btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0;
    color: $color-text-d;
    font-weight: 700;
    font-size: 16px;
    transition: 0.2s;
    &:hover {
      color: $color-white;
      background: $color-theme;
    }
  }
}
.upload-tips {
  width: 260px;
  height: 100px;
  background: url('../../../assets/images/collect_bg.png') no-repeat;
  background-size: cover;
  // background: $color-white;
  // padding: 24px 14px 30px 14px;
  margin-bottom: 16px;
  cursor: pointer;
  .title {
    margin-bottom: 17px;
  }
  .text {
    margin-bottom: 10px;
    line-height: 20px;
  }
  .check-btn {
    display: inline-block;
    margin-top: 20px;
    cursor: pointer;
    &:hover {
      color: $color-theme;
    }
  }
  .font-11 {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }
  .font-12 {
    font-size: 14px;
    color: #487FFF;
    float: right;
    i {
      padding-left: 5px;
      font-size: 14px;
    }
  }
}
.small-banner {
  width: 260px;
  height: 100px;
  margin-bottom: 16px;
  cursor: pointer; 
}
.upload-ranking {
  background: $color-white;
  padding: 24px 14px;
  .title {
    margin-bottom: 22px;
  }
  .ranking-item {
    margin-bottom: 16px;
    height: 18px;
    line-height: 18px;
    font-size: $font-size-small;
    .num {
      width: 18px;
      height: 18px;
      line-height: 18px;
      margin-right: 7px;
      background: #d1d1d1;
      border-radius: 4px;
      text-align: center;
      color: $color-white;
    }
    .username {
      width: 120px;
      overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        color: $color-theme;
      }
    }
    .text {
      color: $color-theme-l;
    }
    &:nth-child(1) {
      .num {
        background: $color-theme-l;
      }
    }
    &:nth-child(2) {
      .num {
        background: #fcb510;
      }
    }
    &:nth-child(3) {
      .num {
        background: $color-button-l;
      }
    }
  }
}
</style>
