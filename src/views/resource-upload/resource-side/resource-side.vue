<template>
  <div>
    <!-- <div class="help-link">
      <el-button class="btn btn-border">上传帮助<i class="el-icon-arrow-right"></i></el-button>
    </div> -->
    <div class="upload-tips">
      <!-- <h3 class="title font-16 color-3 font-b">上传奖励说明</h3> -->
      <h3 class="title font-16 color-3 font-b">
        上传帮助
      </h3>
      <p class="text">
        1、“试卷上传-平台”和“试卷征集-平台 ”为试卷共享模式，平台将老师上传试卷电子化并上线平台供全部老师使用。上传试卷的老师可免费使用。
      </p>
      <p class="text">
        2、“试卷上传-自用”为教师和学校自用试卷上传，仅在个人账户使用或可分享至学校使用。
      </p>
      <span
        class="check-btn color-9 font-11"
        @click="help"
      >详情查看></span>
      <span
        class="check-btn color-9 font-12"
        style="opacity: 0;"
      >上传帮助<i class="icon iconfont iconshangchuanbangzhu" /></span>
    </div>
    <div class="small-banner">
      <img
        src="@/assets/images/resource/small-banner.jpg"
        alt="招募图"
        width="270"
        height="130"
      >
    </div>
    <div
      v-if="false"
      class="upload-ranking"
    >
      <h3 class="title font-16 color-3 font-b">
        上传收益排行榜
      </h3>
      <ul>
        <li
          v-for="(item, index) in rankingData"
          :key="index"
          class="ranking-item"
        >
          <span class="num fl">{{ index + 1 }}</span>
          <span class="username fl">{{ item.username }}</span>
          <span class="value fr">
            <em class="text">{{ item.income }}</em>元
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import commonUrl from '@/common/js/project-url'
export default {
  data() {
    return {
      rankingData: [{
        username: '用户138****4567',
        income: '10358.7'
      }, {
        username: '黎明晓晓',
        income: '9975.0'
      }, {
        username: '弯弯月',
        income: '9655.5'
      }, {
        username: '胖胖猪',
        income: '7685.1'
      }, {
        username: '用户138****4567',
        income: '10358.7'
      }]
    }
  },
  methods: {
    help() {
      this.openWindowLink(commonUrl.sjscUrl)
    }
  }
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
    background: $color-white;
    padding: 24px 14px 30px 14px;
    margin-bottom: 16px;
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
    .font-11{
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    .font-12{
      font-size: 14px;
      color: #487FFF;
      float: right;
      i{
        padding-left: 5px;
        font-size: 14px;
      }
    }
  }
  .small-banner {
    width: 270px;
    height: 130px;
    margin-bottom: 16px;
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
        background: #D1D1D1;
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
          background: #FCB510;
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
