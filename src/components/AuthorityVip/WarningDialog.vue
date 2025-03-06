<template>
  <el-dialog
    :visible="visible"
    title="提示"
    width="600px"
    class="auth-dialog"
    top="11.5%"
    :append-to-body="true"
    :closed="hide"
    @update:visible="visible = $event"
  >
    <div class="auth-container">
      <div v-if="code === 'warningdialog'">
        {{ msg }}
      </div>
      <div v-if="code === '1000'">
        今日下载次数已用完，请明日再来
      </div>
      <div v-if="code === '1001'">
        今日下载次数已用完，请<span
          class="updata-vip"
          @click="updateVip"
        >升级用户</span>等级获取更多次数。
      </div>
      <div v-if="code === '1002'">
        很抱歉，您最多可收藏200道试题，<br>如需收藏更多试题请<span
          class="updata-vip"
          @click="updateVip"
        >开通会员服务</span>
        或<span
          class="updata-vip"
          @click="openSchoolVip"
        >开通校园服务</span>可收藏更多试题
      </div>
      <div v-if="code === '1003'">
        很抱歉，您最多可收藏50套试卷，<br>如需收藏更多试卷请<span
          class="updata-vip"
          @click="updateVip"
        >开通会员服务</span>
        或<span
          class="updata-vip"
          @click="openSchoolVip"
        >开通校园服务</span>可收藏更多试卷
      </div>

      <div v-if="code === '1010'">
        本月改编次数已用完,请下个月再使用
      </div>
      <div v-if="code === '1011'">
        本月改编次数已用完,继续使用请<span
          class="updata-vip"
          @click="updateVip"
        >开通会员服务</span>
        或<span
          class="updata-vip"
          @click="openSchoolVip"
        >开通校园服务</span>
      </div>
      <div v-if="code === '1015' && resData">
        很抱歉，您的试题篮最多可选{{ resData.count || 50 }}道试题
        <span v-if="resData.flag">
          ，<br><span
            class="updata-vip"
            @click="updateVip"
          >升级会员</span>
          或<span
            class="updata-vip"
            @click="openSchoolVip"
          >开通校园服务</span>可添加更多道试题
        </span>
      </div>
    </div>
    <template #footer>
      <div class="warning-dialog-footer">
        <el-button
          class="btn btn-shadow"
          @click="hide"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  // 1002 试题 收藏提示
  // 1003试卷 收藏提示
  export default {
    data() {
      return {
        initDate: { code: '1000', resData: {}, onBuyVip: null, msg: '' },
        msg: '',
        code: '',
        visible: false,
        onBuyVip: null,
        resData: null,
      }
    },
    methods: {
      // 1015
      updateVip() {
        if (this.onBuyVip) {
          this.hide()
          this.onBuyVip(1)
        }
      },
      openSchoolVip() {
        if (this.onBuyVip) {
          this.hide()
          this.onBuyVip(2)
        }
      },
      hide() {
        this.visible = false
      },
    },
  }
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .updata-vip {
    color: $color-theme;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: $color-button-d-hover;
    }
  }
  .auth-dialog :deep(.el-dialog) {
    .el-dialog {
      width: 600px;
      // height: 520px;
      // padding: 32px 64px 70px 32px;
      box-sizing: border-box;
      box-shadow: 0px 0px 30px 0px rgba(62, 115, 205, 0.4);
      border-radius: 6px;
      // .el-dialog__header {
      //   display: none;
      // }
    }
  }
  .auth-container {
    padding: 70px 50px 0 50px;
    line-height: 20px;
    text-align: center;
    .iconfont {
      padding-left: 10px;
      cursor: pointer;
      &:hover {
        color: $color-button-d;
      }
    }
  }
  .warning-dialog-footer {
    text-align: center;
    padding: 10px;
  }
</style>

