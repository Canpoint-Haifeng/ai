<template>
  <el-dialog
    v-model:visible="messageDialog.visible"
    :title="messageDialog.title"
    :modal-append-to-body="false"
    :lock-scroll="true"
    :show-close="true"
    :width="messageDialog.width"
    @close="onClose"
  >
    <div class="set-user-theme-body">
      <div class="free-preview-theme">
        <div class="theme-content">
          <div class="theme-content-group-box">
            <div
              v-for="item in themeList"
              :key="item.id"
              class="theme-content-group"
            >
              <div
                class="t"
                :class="{ isvip: item.themeType === 2 }"
              >
                {{ item.groupName }}
              </div>
              <div
                v-if="item.children"
                class="vip-theme-list"
              >
                <div
                  v-for="sub in item.children"
                  :key="sub.groupChildId"
                  class="vip-theme-item"
                  :class="{
                    __default: sub.defaultTheme === 1,
                    __active: sub.groupChildId == userTheme.groupChildId,
                  }"
                  @click="onSelectItem(sub)"
                  @mouseover="onMouseOver(sub)"
                  @mouseout="onMouseOut(sub)"
                >
                  <img
                    class="vip-theme-image"
                    :src="sub.themeUrl"
                  >
                  <div
                    v-if="sub.groupChildId == userTheme.groupChildId"
                    class="select-theme-active"
                  >
                    <span class="iconfont iconxuanze" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="preview-theme">
          <div class="preivew-canvas">
            <img
              class="preview-canvas-image"
              :src="currentThemeUrl"
            >
            <div class="preivew-canvas-image" />
          </div>
          <div class="t">
            主题效果预览
          </div>
          <div class="set-page-block-footer">
            <div
              class="cp-btn blue"
              @click="resetDefaultTheme"
            >
              恢复默认主题
            </div>
          </div>
        </div>
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
        width: '940px',
        visible: false,
        title: '主题切换',
      },
      themeList: [],
      tempThemeUrl: '',
    }
  },
  computed: {
    ...mapState(['userTheme']),
    currentThemeUrl() {
      return this.tempThemeUrl || this.userTheme.themeUrl
    },
  },
  methods: {
    onMouseOver(item) {
      this.tempThemeUrl = item.themeUrl
    },
    onMouseOut() {
      this.tempThemeUrl = ''
    },
    onSelectItem(item) {
      this.czcTrackEvent(['_trackEvent', '学科主页', '换主题+选中背景图', '次数'])
      let params = {
        groupChildId: item.groupChildId,
      }
      this.apiPost(API.USERTHEME_SAVEUSERTHEME, params).then((res) => {
        if (this.checkoutRes(res, true)) {
          this.$store.commit('UPDATE_USERTHEME', item)
        } else {
          this.showMessage(res.msg)
        }
      })
    },
    resetDefaultTheme() {
      let defaultTheme = null
      for (let item of this.themeList) {
        if (item.children) {
          defaultTheme = item.children.find((item) => item.defaultTheme == 1)
          if (defaultTheme) {
            break
          }
        }
      }
      if (defaultTheme) {
        this.onSelectItem(defaultTheme)
      }
    },

    // 获取 主题列表
    getThemeConfigList() {
      if (this.themeList.length <= 0) {
        return this.apiGet(API.USERTHEME_GETTHEMECONFIGLIST).then((res) => {
          if (this.checkoutRes(res)) {
            this.themeList = res.data
          }
        })
      }
    },
    onClose() {
      if (this.flagUpdate) {
        this.$emit('changeSuccess')
      }
    },
    async show() {
      await this.getThemeConfigList()
      this.messageDialog.visible = true
    },
  },
}
</script>

<style scoped lang="scss">
.set-user-theme-body {
  height: 372px;
  overflow: hidden;
}

.set-page-block-footer {
  padding: 37px 10px 0px 0px;
  text-align: right;
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

.free-preview-theme {
  width: 940px;
  padding: 0 20px 0 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .theme-content {
    width: 510px;
    height: 372px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .preview-theme {
    width: 390px;
    padding: 65px 0 0 10px;
    box-sizing: border-box;

    .t {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      padding: 20px 0;
      text-align: center;
    }

    .preivew-canvas {
      position: relative;
      width: 382px;
      height: 158px;
      background: #e9e9e9;
      border-radius: 10px;
      border: 1px solid #eef0f0;
      overflow: hidden;
      box-sizing: border-box;

      .preview-canvas-image {
        width: 380px;
        height: 156px;
        display: inline-block;
      }
    }
  }
}

.theme-content {
  padding-left: 2px;

  .theme-content-group {
    .t {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      padding-bottom: 20px;

      &.isvip::after {
        content: '';
        display: inline-block;
        width: 16px;
        height: 20px;
        background-image: url('../../assets/images/index/vip-icon.png');
        background-size: 16px 16px;
        background-position-y: 2px;
        background-repeat: no-repeat;
        vertical-align: text-bottom;
      }
    }

    .vip-theme-list {
      width: 510px;

      .vip-theme-item {
        position: relative;
        display: inline-block;
        width: 150px;
        height: 62px;
        background: #e9e9e9;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        user-select: none;

        &:nth-child(3n) {
          margin-right: 0px;
        }

        &.__active {
          box-shadow: 0 0 0 2px #487FFF;
        }

        &.__default {

          // box-shadow: 0 0 0 2px #487FFF;
          &::before {
            content: '默认';
            display: inline-block;
            position: absolute;
            top: 10px;
            left: 10px;
            width: 40px;
            height: 20px;
            background: #00000022;
            border-radius: 5px;
            line-height: 20px;
            color: white;
            text-align: center;
          }
        }
      }

      .vip-theme-image {
        width: 200px;
        height: 82px;
      }
    }
  }
}

.select-theme-active {
  position: absolute;
  display: inline-block;
  bottom: 10px;
  right: 10px;

  .iconfont {
    font-size: 17px;
    color: $color-theme;
  }
}

.preivew-canvas-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 380px;
  height: 156px;
  background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/fc84d316-a9da-40a9-bfb6-c5cba6a49e80.png');
  background-size: 380px 156px;
  background-repeat: no-repeat;
}

.theme-content-group-box {
  padding: 30px 0;
}
</style>
