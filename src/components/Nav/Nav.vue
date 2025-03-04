<template>
  <div class="top-nav-position" :class="{ 'show-fixed': showFixed }">
    <div class="top-nav-body" :class="{ 'show-fixed': showFixed }">
      <div class="top-nav">
        <div class="content-container">
          <el-menu class="top-nav-content" mode="horizontal" default-active="/" :router="false" @select="handleSelect">
            <el-submenu v-if="!currDisabledNav" index="-1" popper-class="custom-dropdown-menu-nav subject-dropdown-menu"
              :popper-append-to-body="true" :show-timeout="10" class="subject-nav-item">
              <template #title>
                <span class="text">
                  <span class="iconfont icon-location_fill"></span>
                  <em class="dropdown-text">{{ currSubject.periodName
                  }}{{ currSubject.subjectName }}</em>
                </span>
                <span class="icon-triangle" :class="{ 'up-triangle': isSubjectDropdownShow }"></span>
              </template>
              <el-menu-item v-for="(item, index) in subjectList" :key="index" class="dropdown-menu-item"
                :class="{ 'active-subject': item.id === currSubject.id }" @click="changeSubject(item)">
                <span class="text">{{ item.periodName }}{{ item.subjectName }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else class="subject-nav-item">
              <template #title>
                <span class="iconfont icon-location_fill"></span>
                <span class="text">
                  {{ currSubject.periodName }}{{ currSubject.subjectName }}
                </span>
              </template>
            </el-menu-item>

            <!-- 智能备课 -->
            <el-submenu v-if="!isDisabledNav('smartpaper')" index="smartpaper"
              popper-class="custom-dropdown-menu-nav nav-dropdown-resource-menu" :popper-append-to-body="true"
              :show-timeout="10" class="top-nav-item custom-dropdown-chapter"
              @click="entryFirstMenu('/smartpaper/chapter')">
              <template #title>
                <span class="text">智能备课</span>
              </template>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/smartpaper/chapter"
                @click="handleSelect('/smartpaper/chapter')">
                <span class="text">章节备课</span>
              </el-menu-item>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/smartpaper/knowledge"
                @click="handleSelect('/smartpaper/knowledge')">
                <span class="text">知识点备课</span>
              </el-menu-item>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/smartpaper/question"
                @click="handleSelect('/smartpaper/question')">
                <span class="text">题目备课</span>
              </el-menu-item>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/smartpaper/paper"
                @click="handleSelect('/smartpaper/paper')">
                <span class="text">试卷备课</span>
              </el-menu-item>
            </el-submenu>

            <!-- 手动备课 -->
            <el-submenu v-if="!isDisabledNav('manualPrepare')" index="manualPrepare"
              popper-class="custom-dropdown-menu-nav nav-dropdown-resource-menu" :popper-append-to-body="true"
              :show-timeout="10" class="top-nav-item custom-dropdown-chapter"
              @click="entryFirstMenu('/manualPrepare')">
              <template #title>
                <span class="text">手动备课</span>
              </template>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/manualPrepare"
                @click="handleSelect('/manualPrepare')">
                <span class="text">手动备课</span>
              </el-menu-item>
            </el-submenu>

            <!-- 我的备课 -->
            <el-submenu v-if="!isDisabledNav('preparation')" index="preparation"
              popper-class="custom-dropdown-menu-nav nav-dropdown-resource-menu" :popper-append-to-body="true"
              :show-timeout="10" class="top-nav-item custom-dropdown-chapter"
              @click="entryFirstMenu('/preparation/myTeaching')">
              <template #title>
                <span class="text">我的备课</span>
              </template>
              <el-menu-item class="dropdown-menu-item dropdown-menu-item2" index="/preparation/myTeaching"
                @click="handleSelect('/preparation/myTeaching')">
                <span class="text">我的备课</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Nav',
  data() {
    return {
      showFixed: false,
      isSubjectDropdownShow: false,
      currSubject: {
        periodName: '高中',
        subjectName: '数学'
      },
      currDisabledNav: false,
      subjectList: [
        {
          id: 1,
          periodName: '高中',
          subjectName: '数学'
        },
        {
          id: 2,
          periodName: '高中',
          subjectName: '语文'
        }
      ]
    }
  },
  methods: {
    handleSelect(key) {
      console.log('Selected menu item:', key)
    },
    changeSubject(subject) {
      this.currSubject = subject
    },
    entryFirstMenu(path) {
      console.log('Entering first menu:', path)
    },
    isDisabledNav(navType) {
      return false
    }
  }
})
</script>

<style lang="scss" scoped>
.top-nav-position {
  height: 50px;
  position: relative;
}

.top-nav-body {
  width: 100%;

  &.show-fixed {
    position: fixed;
    z-index: 1002;
    top: 0;
  }
}

.top-nav {
  height: 50px;
  background: $color-white;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  z-index: 1002;

  .content-container {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
  }

  .top-nav-content {
    height: 50px;
    border-bottom: none;
    background-color: $color-white;

    .top-nav-item {
      height: 50px;
      line-height: 50px;
      float: left;
      position: relative;
      margin: 0 32px 0 0;
      font-size: $font-size-medium;

      &:hover {
        .text {
          color: $color-theme;
        }
      }

      .text {
        color: $color-text;
        font-size: $font-size-medium;
      }

      &.is-active {
        border-bottom: 2px solid $color-theme;

        .text {
          color: $color-theme;
        }
      }
    }

    .subject-nav-item {
      margin-right: 32px;

      .text {
        color: $color-text;
        font-size: $font-size-medium;

        .iconfont {
          font-size: $font-size-medium;
          margin-right: 4px;
        }

        .dropdown-text {
          font-style: normal;
        }
      }

      .icon-triangle {
        position: absolute;
        top: 22px;
        @include triangle(down, 6px, $color-text);
        transition: 0.2s ease-in;
        margin-left: 14px;

        &.up-triangle {
          transform: rotate(180deg);
        }
      }

      &:hover {
        .text {
          color: $color-theme;
        }

        .icon-triangle {
          @include triangle(down, 6px, $color-theme);
        }
      }

      &.is-active {
        border-bottom: 2px solid $color-theme;

        .text {
          color: $color-theme;
        }

        .icon-triangle {
          @include triangle(down, 6px, $color-theme);
        }
      }
    }
  }
}

.custom-dropdown-menu-nav {
  min-width: 120px;
  border: none;
  padding: 0;
  margin-top: 0 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .dropdown-menu-item {
    height: 42px;
    line-height: 42px;
    padding: 0 20px;
    min-width: 120px;
    color: $color-text;
    font-size: $font-size-medium;

    &:hover {
      background: $color-background;
      color: $color-theme;
    }

    &.active-subject {
      color: $color-theme;
    }
  }

  .dropdown-menu-item2 {
    &:hover {
      background: $color-background;
      color: $color-theme;
    }
  }
}

.subject-dropdown-menu {
  min-width: 120px;
}

.nav-dropdown-resource-menu {
  min-width: 120px;
}
</style>
