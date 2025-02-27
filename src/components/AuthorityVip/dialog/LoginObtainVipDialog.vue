import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <el-dialog
    v-model:visible="visible"
    title="每日VIP"
    width="676px"
    class="login-vip-dialog"
    top="11.5%"
    :append-to-body="true"
    :lock-scroll="false"
    :closed="hide"
  >
    <div class="login-vip-container">
      <div class="login-vip-left">
        <img
          class="login-vip-title"
          src="@/assets/images/activity/viplogin4.png"
        >
        <ul class="login-vip-list">
          <li>
            <span class="l">按章节选题</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">按知识点选题</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">按试卷选题</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">智能选题</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">双向细目表组卷</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">平行组卷</span>
            <span class="r">
              <img
                class="mini-image"
                src="@/assets/images/activity/viplogin2.png"
              >
            </span>
          </li>
          <li>
            <span class="l">组卷题数</span>
            <span class="r"> 70题/卷 </span>
          </li>
          <li>
            <span class="l">免费下载</span>
            <span class="r"> 1000题/月 </span>
          </li>
          <li>
            <span class="l">组卷下载</span>
            <span class="r"> 10次/日 </span>
          </li>
          <li>
            <span class="l">试卷下载</span>
            <span class="r"> 10次/日 </span>
          </li>
          <li>
            <span class="l">试卷收藏</span>
            <span class="r"> <i class="iconfont iconwuxian" />无限 </span>
          </li>
          <li>
            <span class="l">试题收藏</span>
            <span class="r"> <i class="iconfont iconwuxian" />无限 </span>
          </li>
          <li>
            <span class="l">浏览解析</span>
            <span class="r"> <i class="iconfont iconwuxian" />无限 </span>
          </li>
        </ul>
      </div>
      <div class="login-vip-right">
        <!-- <img class="login-vip-r-bg" src="@/assets/images/activity/viplogin1.png" /> -->
        <img
          class="login-vip-r-title"
          src="@/assets/images/activity/viplogin6.png"
        >
        <div class="login-vip-r-content">
          为满足广大用户对于全品AI教研云的体验需要现<span>每日免费发放10个VIP体验名额</span>，每日发完即止，单个账号在VIP有效期内不可重复领取。
        </div>
        <div class="login-vip-condition">
          <span class="t">活动范围：</span>
          <span class="c">非VIP个人用户登录即可领取。</span>
        </div>
        <div v-if="isloading">
          <div class="login-vip-condition">
            <span class="t">活动时间：</span>
            <span class="c">{{ dateStrBig(stime, 'YYYY/MM/DD') }} -
              {{ dateStrBig(etime, 'YYYY/MM/DD') }}</span>
          </div>
          <div class="residue-degree">
            今日剩余：<span>{{ surplus }}</span>/{{ total }}
          </div>
          <div class="login-vip-btn">
            <el-button
              class="btn"
              :disabled="!surplus"
              @click="getVipHttp"
            >
              领取
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "LoginObtainVipDialog",
  setup() {
    const getVipHttp = () => {
      // Implementation
    }
    
    return {
      getVipHttp
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.login-vip-container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  .login-vip-left {
    width: 310px;
    height: 425px;
    background: #fbfbfb;
    border-radius: 6px;

    .login-vip-title {
      width: 310px;
      height: 64px;
      border-radius: 6px 6px 0px 0px;
    }
    .login-vip-list {
      box-sizing: border-box;
      padding: 20px 40px;
      border: 1px solid #e5e5e5;
      border-top-width: 0px;
      height: 362px;
      border-radius: 0px 0px 6px 6px;
      .mini-image {
        width: 15px;
        height: 12px;
        padding-bottom: 5px;
      }
    }
  }
})
  .login-vip-right {
    box-sizing: border-box;
    position: relative;
    width: 310px;
    height: 425px;
    background: #fbfbfb;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 40px 20px;
    background-image: url('../../../assets/images/activity/viplogin1.png');
    background-size: 126px 156px;
    background-repeat: no-repeat;
    background-position: 184px 249px;
    .login-vip-r-title {
      width: 89px;
      height: 24px;
      padding-bottom: 20px;
    }
    .login-vip-r-content {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
      padding-bottom: 35px;
      span {
        color: #ff7e3d;
        font-weight: bold;
      }
    }
    .login-vip-condition {
      font-size: 12px;
      padding-bottom: 20px;
      &::before {
        content: counter(sub-item, disc);
        display: block;
        position: absolute;
      }
      .t {
        padding-left: 10px;
        color: #333333;
        font-weight: bold;
      }
      .c {
        color: #666666;
      }
    }
    .residue-degree {
      padding-top: 28px;
      padding-bottom: 20px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #666666;
      span {
        color: #487fff;
        font-size: 30px;
      }
    }
    .login-vip-btn {
      text-align: center;
      .btn {
        padding: 10px 30px;
      }
      .is-disabled.btn {
        background-color: #ebeef5;
        color: #c0c4cc;
      }
    }

    .login-vip-r-bg {
      position: absolute;
      bottom: 20px;
      right: 0;
      width: 126px;
      height: 156px;
    }
  }
})
}

.login-vip-list {
  li {
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 12px;
    color: #666666;
    .r {
      font-family: Microsoft YaHei;
      color: #b9884e;
    }
  }
})
  .iconfont {
    font-size: 12px;
    padding-right: 5px;
  }
})
}
</style>
