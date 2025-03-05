<template>
  <div class="doc-container">
    <div class="doc-list">
      <div class="sub-title">
        <span class="title-text color-3 font-b">已添加文档</span>
        <span class="num">（{{ docList.length }}份）</span>
      </div>
      <ul class="doc-content">
        <li
          v-for="(item, index) in docList"
          v-show="!isCollapse || index < 2"
          :key="index"
          class="doc-item"
        >
          <span class="item-num">{{ index + 1 }}.</span>
          <span class="item-label">标题：</span>
          <el-input
            v-if="item.ext === '.doc' || item.ext === '.docx'"
            v-model="item.title"
            prefix-icon="iconfont iconword"
            class="item-input"
            placeholder="请输入文档标题"
          />
          <el-input
            v-else
            v-model="item.title"
            prefix-icon="iconfont iconpdf"
            class="item-input"
            placeholder="请输入文档标题"
          />
          <span
            v-if="item.ext === '.doc' || item.ext === '.docx'"
            class="item-type"
          >{{ item.ext }}</span>
          <span
            v-else
            class="item-type"
          >{{ item.ext }}</span>
          <em class="line">|</em>
          <span class="item-label">类别：</span>
          <select-tree
            ref="selectTree"
            class="item-select"
            :props="props"
            placeholder="请选择类别"
            :options="categoryList"
            @get-value="onSelectCategory($event, index)"
          />
          <span
            class="item-del"
            @click="deleteDoc(index)"
          >
            <i class="iconfont iconclose" />
          </span>
        </li>
      </ul>
      <div
        v-if="docList.length > 2"
        class="collapse"
      >
        <span
          v-if="isCollapse"
          class="collapse-btn"
          @click="toggle"
        >
          展开 <i class="el-icon-arrow-down" />
        </span>
        <span
          v-else
          class="collapse-btn"
          @click="toggle"
        >
          收起 <i class="el-icon-arrow-up" />
        </span>
      </div>
      <el-upload
        v-if="docList.length >= 0"
        class="upload"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        accept=".doc,.docx,.pdf"
        :action="action"
        :limit="maxDocList - docList.length"
        multiple
      >
        <el-button class="btn btn-border upload-btn">
          <i class="el-icon-plus iconadd" />继续添加
        </el-button>
      </el-upload>
      <el-button
        v-else
        class="btn btn-disabled upload-btn"
      >
        <i class="el-icon-plus iconadd" />继续添加
      </el-button>
    </div>
    <div class="doc-info">
      <div class="sub-title">
        <span class="title-text color-3 font-b">文档信息</span>
      </div>
      <el-form
        ref="form"
        class="doc-form"
        :model="formData"
        label-width="66px"
      >
        <el-form-item
          label="学段："
          prop="periodCode"
        >
          <div class="form-item-info">
            <span
              v-for="item in periodList"
              :key="item.code"
              class="period-item"
              :class="item.code === formData.periodCode ? 'active' : ''"
              @click="selectChange(item.code, 'periodCode')"
            >
              {{ item.name }}
            </span>
          </div>
        </el-form-item>
        <div class="form-panel">
          <el-form-item
            prop="subjectCode"
            class="form-item"
          >
            <template #label>
              <span><em class="must">*</em>学科：</span>
            </template>
            <el-select
              v-model="formData.subjectCode"
              class="form-select"
              placeholder="请选择学科"
              @change="
                (code) => {
                  selectChange(code, 'subjectCode')
                }
              "
            >
              <el-option
                v-for="item in subjectList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="年级："
            class="form-item"
          >
            <el-select
              v-model="formData.gradeCode"
              class="form-select"
              placeholder="请选择年级"
              @change="
                (code) => {
                  selectChange(code, 'gradeCode')
                }
              "
            >
              <el-option
                v-for="item in gradeList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-panel">
          <el-form-item
            label="教材："
            class="form-item"
          >
            <el-select
              v-model="formData.textbookCode"
              class="form-select"
              placeholder="请选择版本"
              :disabled="!formData.subjectCode"
              @change="
                (code) => {
                  selectChange(code, 'textbookCode')
                }
              "
            >
              <el-option
                v-for="item in versionList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="年份："
            class="form-item"
          >
            <el-select
              v-model="formData.yearCode"
              class="form-select"
              placeholder="请选择年份"
              @change="
                (code) => {
                  selectChange(code, 'yearCode')
                }
              "
            >
              <el-option
                v-for="item in yearsList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-panel">
          <el-form-item
            label="学校："
            class="form-item"
          >
            <el-input
              v-model="formData.schoolName"
              class="form-input"
              placeholder="请输入学校名称"
            />
          </el-form-item>
        </div>
        <div class="form-panel">
          <el-form-item
            label="地区："
            class="form-item"
          >
            <localtion
              ref="localtion"
              :width="690"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="简介："
          prop="fileBrief"
          class="form-item"
        >
          <el-input
            v-model="formData.fileBrief"
            class="form-textarea"
            placeholder="对文档的介绍有助于快速通过审核。"
            type="textarea"
          />
        </el-form-item>
        <el-form-item class="form-item">
          <el-button
            class="btn btn-shadow submit-btn"
            @click="uploadBatch"
          >
            确认上传
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import SelectTree from '@/components/SelectTree/SelectTree'
  import Localtion from '@/components/Localtion/Localtion'
  export default {
    props: {
      docList: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        action: 'upload',
        maxDocList: 10,
        categoryList: [],
        props: {
          treeid: 'dictId',
          name: 'name',
          children: 'children',
        },
        isCollapse: true,
        periodList: [],
        subjectList: [],
        gradeList: [],
        versionList: [],
        yearsList: [],
        formData: {
          periodCode: '12',
          subjectCode: '',
          gradeCode: '',
          textbookCode: '',
          yearCode: '',
          schoolName: '',
          province: '',
          city: '',
          county: '',
          fileBrief: '',
        },
      }
    },
    created() {
      // 获取当前学段试卷类型关联id
      this.getRelationCategoryId()
      // 获取学段列表
      this.getPeriodList()
    },
    computed: {
      ...mapState(['currSubject']),
    },
    methods: {
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        let parms = {
          categoryId: CTS.cfgDict.CID_PAPER_PERIOD_TYPE,
          code: this.currSubject.periodCode,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.getCategoryList(res.data[1].relationCategoryId)
          }
        })
      },
      // 获取当前学段试卷类型
      getCategoryList(relationCategoryId) {
        if (!relationCategoryId) {
          return
        }
        let parms = {
          categoryId: relationCategoryId,
          level: '1,2',
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.categoryList = res.data
          }
        })
      },
      // 监听文档类别选择
      onSelectCategory(docCategoryCode, index) {
        this.docList[index].docCategoryCode = docCategoryCode.code
      },
      // 删除上传文档
      deleteDoc(index) {
        this.docList.splice(index, 1)
      },
      // 上传文档之前对文档类型校验
      beforeUpload(doc) {
        // console.log(doc.type)
        // const isDocType = (doc.type === 'application/pdf') || (doc.type === 'application/msword')
        const isDocMaxSize = doc.size / 1024 / 1024 < 10
        // if (!isDocType) {
        //   this.$message.error('上传文档格式只能是doc或者pdf!')
        //   return false
        // }
        if (!isDocMaxSize) {
          this.$message.error('上传文档大小不能超过 10MB!')
          return false
        }
        const lastIndex = doc.name.lastIndexOf('.')
        this.docList.push({
          title: doc.name.substr(0, lastIndex),
          doc: doc,
          ext: doc.name.substr(lastIndex),
        })
        console.log(this.docList)
        // 屏蔽了action的默认上传
        return false
      },
      // 上传文档超出限制条件时提示
      handleExceed(doc, docList) {
        this.$message.warning(
          `每次最多上传 ${this.maxDocList} 个文档，本次选择了 ${
            doc.length
          } 个文档，共选择了 ${doc.length + this.docList.length} 个文档`,
        )
      },
      // 切换显示隐藏
      toggle() {
        this.isCollapse = !this.isCollapse
      },
      // 切换select统一处理
      selectChange(code, params) {
        this.formData[params] = code
        if (params === 'periodCode') {
          this.formData.subjectCode = ''
          this.formData.gradeCode = ''
          this.formData.textbookCode = ''
          this.getSubjectList()
          this.getGradeList()
        } else if (params === 'subjectCode') {
          this.formData.textbookCode = ''
          this.getVersionList()
        }
      },
      // 获取学段
      getPeriodList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
          level: '1',
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.periodList = res.data
            this.getSubjectList()
            this.getGradeList()
            this.getYearsList()
          }
        })
      },
      // 获取年级
      getGradeList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_USER_PERIOD_GRADE,
          code: this.formData.periodCode,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.gradeList = res.data.filter((item) => item.level === 2)
          }
        })
      },
      // 获取学科
      getSubjectList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
          code: this.formData.periodCode,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.subjectList = res.data.filter((item) => item.level === 2)
          }
        })
      },
      // 获取年份
      getYearsList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_BOOK_YEARS,
        }
        this.wayGet(API.GET_DICT_BY_DICTID, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.yearsList = res.data
          }
        })
      },
      // 获取教程版本
      getVersionList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_COURSEBOOKS_VERSION,
          code: this.formData.subjectCode,
          level: 2,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.versionList = res.data.filter((item) => item.level === 3)
          }
        })
      },
      // 批量上传
      uploadBatch() {
        const localtionValue = this.$refs.localtion.selectValue
        let formData = this.formData
        let fileName = []
        let files = []
        let fileCategory = []
        let checkFile = 0
        /* eslint-disable-next-line */
        const FileReg = /[\\\/\:\*\？\?<>\|\",，#%&\+\//=]/gi
        if (!formData.subjectCode) {
          this.$message.error('请选择学科!')
          return
        }
        this.docList.forEach((item) => {
          if (item.title.length > 50 || item.title.length < 2) {
            checkFile = 1
          }
          if (FileReg.test(item.title)) {
            checkFile = 2
          }
          fileName.push(item.title + item.ext)
          files.push(item.doc)
          fileCategory.push(item.docCategoryCode ? item.docCategoryCode : 0)
        })
        if (checkFile === 1) {
          this.$message.error('标题名称长度在2-50个字符之间！')
          return
        }
        if (checkFile === 2) {
          this.$message.error('标题名称中不能含有特殊字符')
          return
        }
        let parms = {
          fileName: fileName,
          fileCategory: fileCategory,
          files,
          periodCode: formData.periodCode,
          subjectCode: formData.subjectCode,
          gradeCode: formData.gradeCode,
          textbookCode: formData.textbookCode,
          yearCode: formData.yearCode,
          schoolName: formData.schoolName,
          province: localtionValue.proValue.code
            ? localtionValue.proValue.code
            : '',
          city: localtionValue.cityValue.code
            ? localtionValue.cityValue.code
            : '',
          area: localtionValue.countyValue.code
            ? localtionValue.countyValue.code
            : '',
          fileBrief: formData.fileBrief,
        }
        let set = {
          file: true,
          showLoading: true,
          message: '拼命上传中...',
        }
        this.apiPost(API.UPLOAD_BATCH, parms, set).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$emit('successUpload')
          }
        })
      },
    },
    components: {
      SelectTree,
      Localtion,
    },
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .sub-title {
    border-left: 2px solid $color-text-d;
    padding-left: 12px;
    margin: 50px 0 24px 0;
    .num {
      margin-left: 12px;
      color: $color-theme-ll;
    }
  }
  .doc-list {
    .doc-item {
      padding: 15px 16px 13px 20px;
      background: $color-table-bg;
      margin-bottom: 16px;
      .item-num {
        display: inline-block;
        width: 24px;
        margin-right: 4px;
      }
      .item-label {
        margin-right: 10px;
      }
      :deep(.item-input)) {
        width: 324px;
        height: 34px;
        margin-right: 10px;
        .el-input__prefix {
          left: 10px;
          top: -4px;
          .iconword {
            color: $color-button-l;
          }
          .iconpdf {
            color: $color-theme-l;
          }
        }
        .el-input__inner {
          border: 1px solid $color-border;
          padding: 0 10px 0 30px;
          color: $color-text-d;
        }
      }
      .line {
        margin: 0 18px;
        color: $color-text-ll;
        font-size: $font-size-medium-x;
      }
      :deep(.item-select)) {
        display: inline-block;
        width: 180px;
        height: 32px;
        margin-right: 22px;
        .el-input {
          height: 32px;
        }
        .el-input__inner {
          border: 1px solid $color-border;
          color: $color-text-d;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
      .item-del {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 50%;
        background: $color-border;
        text-align: center;
        cursor: pointer;
        transition: 0.2s;
        .iconclose {
          color: $color-text;
          font-size: $font-size-small;
          transform: scale(0.8);
        }
        &:hover {
          background: $color-theme-l;
          .iconclose {
            color: $color-white;
          }
        }
      }
    }
  }
  .collapse {
    text-align: center;
    .collapse-btn {
      cursor: pointer;
      &:hover {
        color: $color-theme;
      }
    }
  }
  .upload-btn {
    width: 120px;
    height: 34px;
    padding: 0;
    border-radius: 17px;
    font-size: $font-size-medium;
    .iconadd {
      margin-right: 6px;
    }
    &:hover {
      background: $color-theme;
      color: $color-white;
    }
    &.btn-disabled {
      background: none;
      color: $color-disabled;
    }
  }

  .doc-info {
    margin-top: 20px;
  }
  .doc-form {
    margin: 0 25px 0 20px;
    .period-item {
      border: 1px solid $color-theme;
      border-radius: 13px;
      padding: 4px 15px;
      box-sizing: border-box;
      margin-right: 16px;
      color: $color-theme;
      cursor: pointer;
      transition: 0.2s;
      &:hover,
      &.active {
        background: $color-theme;
        color: $color-white;
      }
    }
    .form-panel {
      @include flex();
      justify-content: space-between;
      .form-item {
        display: inline-block;
        .must {
          margin-right: 2px;
          color: #f56c6c;
        }
      }
      :deep(.localtion-select)) {
        padding-right: 0;
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
    .form-item {
      margin-bottom: 18px;
    }
    :deep(.form-select),
    :deep(.form-input)) {
      width: 298px;
      height: 34px;
      .el-input__icon {
        line-height: 32px;
      }
      .el-input__inner {
        height: 34px;
        line-height: 34px;
        padding: 0 10px;
        border: 1px solid $color-border;
        &:focus {
          border: 1px solid $color-theme;
        }
      }
    }
    :deep(.form-textarea)) {
      .el-textarea__inner {
        border: 1px solid $color-border;
        color: $color-text-d;
        padding: 13px 10px;
        border-radius: 0;
        height: 120px;
        resize: none;
      }
    }
    .submit-btn {
      width: 130px;
      height: 40px;
      border-radius: 20px;
      margin-top: 50px;
      font-size: $font-size-medium;
    }
  }
</style>
