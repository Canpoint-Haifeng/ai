<template>
  <el-dialog
    :visible="visible"
    @update:visible="visible = $event"
    title="提示"
    width="600px"
    class="auth-dialog"
    top="11.5%"
    :append-to-body="true"
    :lock-scroll="false"
    :closed="hide"
  >
    <div class="auth-container">
      {{ msg || '抱歉，该功能仅限VIP用户/专业和高级学校用户使用'
      }}<i
        class="iconfont iconshangchuanbangzhu"
        @click="skinToHelper"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
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
  export default {
    data() {
      return {
        initDate: { msg: '抱歉，该功能仅限VIP用户/专业和高级学校用户使用。' },
        msg: '',
        visible: false,
      }
    },
    methods: {
      skinToHelper() {
        window.open(
          'http://help.canpoint.cn/#/help-doc/detail?lid=26807f49cc77ab14&fid=ca9573d7697a3eb0',
        )
      },
      hide() {
        this.visible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.auth-dialog) {
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
    padding: 30px 50px 0 50px;
    line-height: 30px;
    .iconfont {
      padding-left: 10px;
      cursor: pointer;
      &:hover {
        color: $color-button-d;
      }
    }
  }
</style>
