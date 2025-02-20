<template>
  <div class="page-main" :class="{ 'page-main-left': !navChildStatus }">
    <!-- 保持模板部分不变，因为问题在data部分 -->
    <!-- 原有的template内容保持不变 -->
    {{前面您提供的整个template部分保持不变}}
  </div>
</template>

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
    // 保持原有的methods不变
    {{前面您提供的整个methods部分保持不变}}
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
{{前面您提供的整个style部分保持不变}}
</style>
