<template>
  <div class="plaza-nav-segment">
    <div
      class="plaza-nav-background"
      :class="showFixed ? 'show-fixed' : ''"
    >
      <div class="content-container">
        <div class="plaza-nav-body">
          <div class="plaza-nav-home" />
          <div class="plaza-nav-list">
            <div
              class="skip-home-icon"
              @click="onSkipHome"
            >
              <span class="iconfont iconhome_3_line" />
            </div>
            <div
              v-for="item in tabsList"
              :key="item.id"
              class="plaza-nav-item"
              :class="activeMenu == item.path ? 'active' : ''"
              @click="changeNav(item)"
            >
              {{ item.name }}
            </div>
          </div>
          <el-popover
            placement="bottom-end"
            width="650"
            popper-class="home-page-select-subject"
            trigger="hover"
          >
            <template #reference>
              <div class="subject-select-btn">
                <span class="iconfont icondingwei" />
                <span class="curr-subject">{{ currSubject.periodName }}{{ currSubject.subjectName }}</span>
              </div>
            </template>
            <div class="subject-body-list">
              <div
                v-for="item in listData"
                v-show="item.children && item.children.length"
                :key="item.dictId"
                class="subject-menu-item"
              >
                <div class="title">
                  <span class="line" />
                  {{ item.name }}
                </div>
                <div class="content">
                  <span
                    v-for="subItem in item.children"
                    :key="subItem.dictId"
                    class="text"
                    :class="{
                      active:
                        item.code === currSubject.periodCode &&
                        subItem.code === currSubject.subjectCode,
                      vip: allVipDict[subItem.code],
                    }"
                    @click="selectSubject(item, subItem)"
                  >
                    {{ subItem.name }}
                  </span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>
<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "PlazaNav",
  setup() {
    const activeIndex = ref("1")
    
    const handleSelect = (key) => {
      activeIndex.value = key
    }
    
    return {
      activeIndex,
      handleSelect
    }
  }
})
</script>
  <style scoped lang="scss">
  @use "@/assets/css/variables" as *;
    .plaza-nav-background {
      position: relative;
      width: 100%;
      height: 140px;
      background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/jpg/1c794f40-4445-4175-b7a6-629203a44e8f.jpg)
        no-repeat;
      background-size: 1920px 140px;
      background-position-x: center;
  
      &.show-fixed {
        position: fixed;
        top: 40px;
        z-index: 99;
        height: 80px;
  
        background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/9ae9f257-a1ee-495d-a1c0-39ab28601218.png)
          no-repeat;
        background-size: 1920px 80px;
      }
    }
    .plaza-nav-body {
      display: flex;
      padding-top: 17px;
      justify-content: space-between;
      align-items: center;
      .plaza-nav-home {
        width: 230px;
        height: 106px;
        background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/9e66e033-18e9-4a51-a3ad-df4bed0a95e2.png)
          no-repeat;
        background-size: 230px 106px;
      }
      .plaza-nav-list {
        position: relative;
        // 600px
        width: 534px;
        // width: 674px;
        height: 76px;
        background: linear-gradient(126deg, #ccffe7 0%, #b4fee1 100%);
        border-radius: 50px;
        border: 2px solid #333333;
        box-sizing: border-box;
        padding: 13px 20px;
        .plaza-nav-item {
          margin-right: 20px;
          width: 120px;
          line-height: 44px;
          text-align: center;
          background: #8aefbf;
          border-radius: 24px;
          display: inline-block;
          font-size: 20px;
          font-weight: 400;
          color: #333333;
          cursor: pointer;
          user-select: none;
          &.active {
            background: #333333;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
          }
        }
        &::after {
          display: inline-block;
          position: absolute;
          content: '';
          width: 51px;
          height: 48px;
          right: -16px;
          top: 30px;
          background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/744d379e-9cb6-4572-982e-a07c50b15307.png)
            no-repeat;
          background-size: 51px 48px;
        }
      }
      .subject-select-btn {
        width: 182px;
        height: 46px;
        background: linear-gradient(128deg, #61f5c2 0%, #40e2ff 100%);
        border-radius: 25px;
        line-height: 46px;
        text-align: center;
  
        font-size: 20px;
        font-weight: bold;
        color: #194d55;
  
        cursor: pointer;
        user-select: none;
  
        .iconfont {
          padding-right: 7px;
        }
      }
    }
  
    .show-fixed {
      .plaza-nav-body {
        .plaza-nav-home {
          width: 230px;
          height: 45px;
          background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/6dda1310-8d2b-454b-a7c4-09378e6a0e47.png)
            no-repeat;
          background-size: 186px 45px;
        }
        .plaza-nav-list {
          position: relative;
          // 600px
        //   width: 534px;
          height: 45px;
          background: none;
          border-radius: 0;
          border-width: 0;
          box-sizing: border-box;
          padding: 0 20px;
          .plaza-nav-item {
            margin-right: 20px;
            width: 120px;
            line-height: 41px;
            text-align: center;
            background: #8aefbf;
            border-radius: 24px;
            display: inline-block;
            font-size: 20px;
            font-weight: 400;
            color: #333333;
            cursor: pointer;
            user-select: none;
            border: 2px solid #333333;
            &.active {
              background: #333333;
              font-size: 20px;
              font-weight: bold;
              color: #ffffff;
            }
            &:last-child {
              margin-right: 0;
            }
          }
          &::after {
            display: none;
          }
        }
        .subject-select-btn {
          width: 182px;
          height: 46px;
          background: linear-gradient(128deg, #61f5c2 0%, #40e2ff 100%);
          border-radius: 25px;
          line-height: 46px;
          text-align: center;
  
          font-size: 20px;
          font-weight: bold;
          color: #194d55;
  
          cursor: pointer;
          user-select: none;
  
          .iconfont {
            padding-right: 7px;
          }
        }
      }
    }
  
    .subject-body-list {
      padding: 15px 15px 5px 15px;
      .subject-menu-item {
        background: none;
        margin-bottom: 20px;
        height: auto;
        line-height: 16px;
        padding: 0;
        cursor: pointer;
        user-select: none;
        .title {
          margin-bottom: 12px;
          color: $color-text-d;
          font-size: $font-size-medium-x;
          display: flex;
          align-items: center;
          font-weight: bold;
          .line {
            display: inline-block;
            vertical-align: -1px;
            width: 4px;
            height: 18px;
            background: $color-theme;
            margin-right: 8px;
          }
        }
        .content {
          overflow: hidden;
          padding: 8px 0;
          .text {
            float: left;
            line-height: 14px;
            margin: 0px 1px;
            color: $color-text;
            padding: 4px 15px;
            border: 1px solid transparent;
            position: relative;
            margin-right: 10px;
            &:hover,
            &.active {
              color: $color-white;
              border-radius: 12px;
              background: $color-theme;
            }
            &.vip::after {
              content: '';
              position: absolute;
              display: inline-block;
              width: 16px;
              height: 16px;
              top: -8px;
              right: 0px;
              background-image: url('../../assets/images/index/vip-icon.png');
              background-size: 16px 16px;
            }
            &.vip:hover,
            &.vip.active {
              background: #fef8e7;
              border: 1px solid #ffdb94;
              border-radius: 12px;
              color: #9b610b;
            }
          }
        }
      }
    }
    .plaza-nav-segment {
      width: 100%;
      padding-top: 40px;
      height: 156px;
    }
  
    .skip-home-icon {
      display: inline-block;
      width: 44px;
      height: 44px;
      background: #8aefbf;
      border-radius: 22px;
      line-height: 44px;
      text-align: center;
      cursor: pointer;
      user-select: none;
  
      margin-right: 20px;
      vertical-align: bottom;
      .iconfont {
        font-size: 26px;
        color: #333333;
      }
    }
    .show-fixed {
      .skip-home-icon {
        line-height: 41px;
        text-align: center;
        border: 2px solid #333333;
        box-sizing: border-box;
      }
    }
  </style>
  