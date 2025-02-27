<template>
  <div class="plaza-nav-segment">
    <!-- showFixed ? 'show-fixed' : '' -->
    <div
      class="plaza-nav-background"
      :class="{ addClass: currPath == pageUrl, isFixed: showFixed }"
      @scroll="handleScroll"
    >
      <div class="content-container">
        <div class="plaza-nav-body">
          <div
            class="div_logo"
            :class="{ logoBg: currPath == pageUrl }"
          />

          <div
            class="header_home"
            :class="{ iconColor: currPath == pageUrl }"
            @click="goIndex"
          >
            <span class="iconfont iconhome_3_fill icon_home" />
          </div>
          <!-- <div class="plaza-nav-home"></div> -->
          <!-- <div class="logo fl" @click="goIndex">
            <a href="//ti.canpoint.cn">
              <img
                src="@/assets/images/logo-small.svg"
                alt="全品AI教研云"
                class="logo-img"
              />xxx
            </a>
          </div> -->
          <div
            class="plaza-nav-list"
            :class="{ activeIndex: currPath == pageUrl }"
          >
            <div
              v-for="item in tabsList"
              :key="item.id"
              class="plaza-nav-item"
              :class="{
                activeTab: activeMenu == item.path,
              }"
              @click="changeNav(item)"
            >
              {{ item.name }}

              <div
                v-if="currPath == pageUrl"
                class="div_line"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "QuestionCollectNav",
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
  position: fixed;
  width: 100%;
  height: 50px;
  line-height: 50px;
  z-index: 999;
  //   background: #4b8ff5;
  background: linear-gradient(270deg, #ffee82 0%, #ffbf77 100%);
  //   background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/jpg/1c794f40-4445-4175-b7a6-629203a44e8f.jpg)
  //     no-repeat;
  //   background-size: 1920px 140px;
  //   background-position-x: center;
  &.addClass {
    display: flex;
    align-items: flex-end;
    height: 62px;
    position: fixed;
    top: 40px;
    z-index: 10;
    background: none;
    // #FF7C40 100%—#FF9760 0%
    // background: linear-gradient(to bottom, #FF7C40 0%, #FF9760 100%) no-repeat;
    .icon_home {
      color: #ffffff;
    }
  }
})
  &.isFixed {
    // background: url('../../assets/images/collect_nav_fixed.png') no-repeat;
    background: linear-gradient(180deg, #ff7c40 0%, #ffd7c4 100%) no-repeat,
      linear-gradient(180deg, #ffd8c9 0%, #ffcb71 100%) no-repeat;
    background-size: 100% 134px, 100% 3446px;
  }
})
}
.plaza-nav-body {
  display: flex;
  align-items: center;

  .div_logo {
    width: 276px;
    height: 30px;
    background: url('../../assets/images/collect_logo1.png') no-repeat;
    background-size: cover;
    margin-right: 42px;
    cursor: pointer;
  }
})
  .logoBg {
    width: 300px;
    height: 32px;
    background: url('../../assets/images/collect_logo2.png') no-repeat;
    background-size: cover;
    margin-right: 32px;
    cursor: pointer;
  }
})
  .header_home {
    width: 30px;
    height: 30px;
    line-height: 30px;
    // background: #ffab3d;
    border: 2px solid #5b2e0b;
    border-radius: 50%;
    text-align: center;
    margin-right: 25px;
    cursor: pointer;
    .icon_home {
      font-size: 24px;
      color: #5b2e0b;
    }
  }
})
  .iconColor {
    width: 36px;
    height: 36px;
    line-height: 36px;
    border: 2px solid #ffffff;
    cursor: pointer;
    .icon_home {
      color: #ffffff;
    }
  }
})
  //   .plaza-nav-home {
  //     width: 230px;
  //     height: 106px;
  //     background: url("")
  //       no-repeat;
  //     background-size: 230px 106px;
  //   }
  .plaza-nav-list {
    // position: relative;
    // width: 534px;
    // width: 674px;
    // height: 76px;
    // background: linear-gradient(126deg, #ccffe7 0%, #b4fee1 100%);
    // border-radius: 50px;
    // border: 2px solid #333333;
    // box-sizing: border-box;
    // padding: 13px 20px;
    .plaza-nav-item {
      width: 135px;
      font-size: 20px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #7e3f20;
      margin-right: 10px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      user-select: none;
    }
    .activeTab {
      width: 135px;
      height: 50px;
      font-weight: bold;
      color: #ffffff;
      font-size: 20px;
      background: linear-gradient(180deg, #ffbb56 0%, #ff7029 100%);
    }
  }
})
  //当前页面是征集首页
  .activeIndex {
    .plaza-nav-item {
      background: none;
      font-size: 20px;
      font-weight: normal;
      color: #ffffff;
      position: relative;
      &.active {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
      }
    }
    .activeTab {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      .div_line {
        width: 40px;
        height: 6px;
        background: #ffffff;
        border-radius: 3px;
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
})
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
})
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
})
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
})
}
.plaza-nav-segment {
  width: 100%;
  padding-top: 40px;
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
})
}
.show-fixed {
  .skip-home-icon {
    line-height: 41px;
    text-align: center;
    border: 2px solid #333333;
    box-sizing: border-box;
  }
})
}
</style>
