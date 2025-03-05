<template>
  <el-dialog
    v-model="messageDialog.visible"
    :title="messageDialog.title"
    :modal-append-to-body="false"
    :lock-scroll="false"
    :show-close="true"
    :width="messageDialog.width"
    @close="onClose"
  >
    <div
      v-loading="loading"
      class="select-home-block-segment"
    >
      <div class="select-home-title">
        我的订阅
      </div>
      <div
        v-for="item in boxList"
        :key="'selected' + item.id"
        class="select-home-block-item"
      >
        <div class="block-item">
          <img
            class="block-item-img"
            :src="item.iconImg"
            alt=""
          >
        </div>
        <div class="block-name">
          {{ item.name }}
        </div>
      </div>
      <div class="select-home-title">
        选题路径
      </div>
      <div
        v-for="item in userAllConfig"
        :key="item.id"
        class="select-home-block-item"
        @click="onSelectConfig(item)"
      >
        <div class="block-item">
          <img
            class="block-item-img"
            :src="item.iconImg"
            alt=""
          >
        </div>
        <div class="block-name">
          {{ item.name }}
        </div>
        <div class="block-check">
          <span
            v-if="checklist[item.id]"
            class="iconfont iconweishoucang"
          />
          <span
            v-else
            class="iconfont-no-select"
          />
        </div>
      </div>
    </div>
    <div class="set-page-block-footer">
      <div
        class="cp-btn gray"
        @click="resetBoxList"
      >
        恢复默认
      </div>
      <div
        class="cp-btn blue"
        @click="messageDialog.visible = false"
      >
        确认
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        messageDialog: {
          width: '850px',
          visible: false,
          title: '订阅选题路径',
        },
        checklist: {},
        userAllConfig: [],
        boxList: [],
        loading: false,
        flagUpdate: false,
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    methods: {
      resetBoxList() {
        let params = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        this.apiPost(API.MY_HOMEPAGECONFIG_USER_RESUMEDEFAULT, params, {
          showLoading: true,
        }).then((res) => {
          if (this.checkoutRes(res)) {
            this.flagUpdate = true
            this.getDefaultConfigs()
          }
        })
      },
      async getDefaultConfigs() {
        let params = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        await this.apiGet(API.MY_HOMEPAGECONFIG_USER_DEFAULTCONFIGS, params, {
          showLoading: true,
        }).then((res) => {
          if (this.checkoutRes(res)) {
            this.boxList = res.data
            let checklistlib = {}
            this.boxList.forEach((item) => {
              checklistlib[item.id] = true
            })
            this.checklist = checklistlib
          }
        })
      },
      onSelectConfig(item) {
        let len = this.getCheckList().length
        if (this.checklist[item.id]) {
          // 需求
          if (len <= 1) {
            this.showMessage('请至少添加一个快捷选题路径')
          } else {
            this.checklist[item.id] = false
            this.updateUserConfig(item.id, 1, item)
          }
        } else {
          if (len >= 6) {
            this.showMessage('添加快捷选题路径已达上限')
          } else {
            this.$set(this.checklist, item.id, true)
            this.updateUserConfig(item.id, 2, item)
          }
        }
      },
      getCheckList() {
        let list = []
        for (let key in this.checklist) {
          if (this.checklist[key]) {
            list.push(key)
          }
        }
        return list
      },
      updateUserConfig(id, type, item) {
        let params = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          configId: id,
        }
        let url = API.SYS_HOMEPAGECONFIG_USER_ADDCONFIG
        if (type == 1) {
          url = API.SYS_HOMEPAGECONFIG_USER_REDUCECONFIG
        }
        this.apiPost(url, params).then((res) => {
          if (this.checkoutRes(res)) {
            //   this.$nextTick('changeSuccess')
            this.flagUpdate = true
            this.changeBoxList(item, type)
          }
        })
      },
      changeBoxList(item, configId) {
        if (configId == 1) {
          // 移除 item
          let list = []
          for (let sub of this.boxList) {
            if (sub.id != item.id) {
              list.push(sub)
            }
          }
          this.boxList = list
        } else {
          // 添加 item
          this.boxList.push(item)
        }
      },
      onClose() {
        if (this.flagUpdate) {
          this.$emit('changeSuccess')
        }
      },
      async getUserAllConfigsHttp() {
        let params = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        this.loading = true
        await this.apiGet(API.MY_HOMEPAGECONFIG_USER_ALLCONFIGS, params).then(
          (res) => {
            if (this.checkoutRes(res)) {
              this.userAllConfig = res.data
            }
            return ''
          },
          () => {
            return ''
          },
        )
        this.loading = false
      },
      show(list, boxlist) {
        this.checklist = list
        this.boxList = boxlist
        this.flagUpdate = false
        this.getUserAllConfigsHttp()
        this.messageDialog.visible = true
      },
    },
  }
</script>

<style scoped lang="scss">
  .select-home-block-segment {
    padding: 10px 0;
    height: 500px;
    overflow-y: auto;
    .select-home-block-item {
      display: inline-block;
      width: 120px;
      height: 120px;
      margin: 10px;
      position: relative;
      text-align: center;
      cursor: pointer;
      user-select: none;
      .block-item {
        display: inline-block;
        width: 70px;
        height: 70px;
        .block-item-img {
          width: 70px;
          height: 70px;
          // background: #f9fbff;
          // border-radius: 10px;
        }
      }
      .block-name {
        text-align: center;
        line-height: 14px;
        padding-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
      .block-check {
        position: absolute;
        top: 45px;
        right: 35px;
        .iconweishoucang {
          color: $color-theme;
          font-size: 20px;
        }

        .iconfont-no-select {
          display: inline-block;
          width: 18px;
          height: 18px;
          background: #edeff0;
          border: 1px solid #dfe1e2;
          border-radius: 50%;
        }
      }
    }
  }

  .select-home-title {
    font-size: 16px;
    font-weight: bold;
    color: #666666;
    padding: 20px 27px 10px 27px;
  }
  .set-page-block-footer {
    padding: 20px 20px 30px 20px;
    text-align: center;
  }
  .cp-btn {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    font-size: 12px;
    &.gray {
      background: #f5f5f5;
      color: #666666;
      margin-right: 30px;
      &:hover {
        background: #f0f0f0;
      }
    }
    &.blue {
      color: #ffffff;
      background: $color-button-d;
      &:hover {
        background: $color-button-d-hover;
      }
    }
  }
</style>
