{{The original template content from the user's message}}

<script type="text/ecmascript-6">
import CTS from "@/common/js/constant";
import NoresultCommon from "@/components/noresult/noresult-common";
export default {
  name: "accountManage",
  props: {
    navChildStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    let validateAccount = (rule, value, callback) => {
      if (value === "" || !value) {
        callback(new Error("请输入账号"));
      } else {
        if (
          CTS.constant.phoneReg.test(value.trim()) ||
          CTS.constant.emilReg.test(value.trim())
        ) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号或者邮箱"));
        }
      }
    };
    let validateRoleId = (rule, value, callback) => {
      if (value === "" || !value) {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      // 添加ruleForm对象
      ruleForm: {
        prompt: ''
      },
      // 添加rules对象
      rules: {
        prompt: [
          { required: true, message: "请输入提示语内容", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ]
      },
      searchForm: {
        prompt: "",
      },
      searchRules: {
        idValue: []
      },
      roleSelect: [],
      rowData: {},
      tableData: {
        currPage: 1,
        pageSize: 15,
        list: [],
        totalCount: 0
      },
      handleType: 0, // 0 新增 1编辑

      selectRoleDialog: {
        visible: false,
        title: "添加提示语",
        showClose: true,
        width: "600px",
        rowData: {},
        id: "",
        ruleForm: {
          prompt: "",
        },
        rules: {
          prompt: [
            { required: true, message: "请输入提示语内容", trigger: "blur" },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur",
            },
          ],
        },
      },
      onlineDialog: {
        visible: false,
        title: "提示",
        showClose: true,
        width: "500px",
        content: "",
        id: null,
      },
    };
  },
  components: {
    NoresultCommon,
  },
  created() {
    this.getData(); // 获取用户信息列表
  },
  methods: {
    // 强制更新测试文本信息框的值
    changeMessage() {
      this.$forceUpdate();
    },
    // 获取数据
    getData() {
      let parms = {
        ...this.searchForm,
        currPage: this.tableData.currPage,
        pageSize: this.tableData.pageSize,
      };
      this.apiGet("teacher-ai/prompt/page", parms).then((res) => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          this.tableData = res.data;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },

    // 添加提示语
    addQuestion() {
      this.handleType = 0;
      this.selectRoleDialog.title = "添加提示语";
      this.selectRoleDialog.rowData = {};
      this.selectRoleDialog.ruleForm.prompt = "";
      this.selectRoleDialog.visible = true;
    },
    // 跟新状态
    updateStatus() {
      let parms = {
        id: this.onlineDialog.id,
      };
      this.apiPost("/teacher-ai/prompt/delete", parms).then((res) => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          this.onlineDialog.visible = false;
          this.getData();
        }
      });
    },
    // 搜索
    search(e) {
      if (e === "reset") {
        this.searchForm = {
          prompt: "",
        };
      }

      this.getData();
    },
    // 分页
    handleCurrentChange(val) {
      this.tableData.currPage = val;
      this.getData();
    },
    // 编辑
    changeRole(row) {
      this.handleType = 1;
      console.log(row, this.handleType);

      this.selectRoleDialog.title = "编辑提示语";
      this.selectRoleDialog.rowData = row;
      this.selectRoleDialog.ruleForm.prompt = row.prompt;
      this.selectRoleDialog.id = row.id;
      this.selectRoleDialog.visible = true;
    },

    // 提交
    changeRoleAction() {
      console.log(this.handleType);
      let parms = {
        id: this.selectRoleDialog.id,
        prompt: this.selectRoleDialog.ruleForm.prompt,
      };

      const path =
        this.handleType === 0
          ? "/teacher-ai/prompt/add"
          : "/teacher-ai/prompt/update";

      this.apiPost(path, parms).then((res) => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          this.selectRoleDialog.visible = false;
          this.getData();
        }
      });
    },
    // 去详情
    checkApp(row) {
      this.$router.push({
        name: "accountInfo",
        query: { userGuid: row.userGuid },
      });
    },
    // 删除提示语
    onlineItemShow(row) {
      this.onlineDialog.id = row.id;
      this.onlineDialog.visible = true;
      this.rowData = row;
      if (row.status) {
        this.onlineDialog.content = `是否删除:${row.prompt}?`;
      } else {
        this.onlineDialog.content = `是否删除:${row.prompt}?`;
      }
    },

    // 修改状态
    handleSwitch(row) {
      console.log(row);
      let title = "打开";
      if (row.status === 0) {
        title = "关闭";
      } else {
        title = "打开";
      }
      const params = {
        id: row.id,
        status: row.status,
      };
      this.apiPost("/teacher-ai/prompt/updateStatus", params)
        .then((res) => {
          if (res.code === 200) {
            this.$forceUpdate();
            this.$message({
              type: "success",
              message: row.status === 1 ? "上线成功" : "下线成功！",
            });
            this.getData();
          }
        })
        .catch((err) => {
          // console.log(err);
        });
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
/*设置管理员账号*/
.set-user-account {
  padding-top: 30px;
  padding-bottom: 30px;
}
.bigTips {
  color: $color-theme-l;
  font-size: $font-size-medium;
  line-height: 30px;
}
.head-tips {
  color: $color-text-d;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: $font-size-medium;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  span {
    color: #3dad40;
    padding: 0 3px;
  }
}
.fotm-item-vfcode {
  width: 120px;
  text-align: center;
  position: absolute;
  left: 220px;
  top: 0;
  cursor: pointer;
  border: 1px solid $color-theme;
  height: 32px;
  line-height: 32px;
  span {
    color: $color-theme;
    font-size: 14px;
    padding: 0 10px;
  }
}
// 设置账号搜索
.api-table-box {
  @include flex();
  .api-table-left {
    //width: 440px;
    .api-table-left-list {
      //height: 154px;
      border: 1px solid #e4ecfd;
      .item-head {
        height: 30px;
        @include flex();
        justify-content: space-between;
        background-color: $color-list-title;
        font-size: $font-size-small;
        span {
          width: 110px;
          display: block;
          text-align: center;
          i {
            cursor: pointer;
          }
        }
      }
      .item-self {
        height: 40px;
        @include flex();
        justify-content: space-between;
        font-size: $font-size-small;
        /*border-bottom: 1px solid #E4ECFD;*/
        span {
          width: 110px;
          display: block;
          text-align: center;
          overflow-wrap: break-word;
          i {
            cursor: pointer;
          }
        }
        .add-after {
          color: $color-theme;
          padding: 4px 12px;
          font-size: $font-size-small;
          border: 1px solid $color-theme;
          border-radius: 10px;
          background-color: #fff;
        }
        .add-before {
          color: #fff;
          padding: 4px 19px;
          font-size: $font-size-small;
          border: 1px solid $color-theme;
          border-radius: 10px;
          background-color: $color-theme;
        }
      }
      .is-afert {
        opacity: 0.5;
      }
    }
  }
}
</style>
