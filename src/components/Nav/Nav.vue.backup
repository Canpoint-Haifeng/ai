<template>
  <div
    class="top-nav-position"
    :class="{ 'show-fixed': showFixed }"
  >
    <div
      class="top-nav-body"
      :class="{ 'show-fixed': showFixed }"
    >
      <div class="top-nav">
        <div class="content-container">
          <el-menu
            class="top-nav-content"
            mode="horizontal"
            default-active="/"
            :router="false"
            @select="handleSelect"
          >
            <!-- Subject selection -->
            <el-menu-item class="subject-nav-item">
              <span class="text">
                <span class="iconfont icon-location_fill" />
                <span>{{ currSubject.periodName }}{{ currSubject.subjectName }}</span>
              </span>
            </el-menu-item>

            <!-- Smart lesson preparation -->
            <el-menu-item
              class="top-nav-item"
              index="/smartpaper/chapter"
              @click="handleSelect('/smartpaper/chapter')"
            >
              <span class="text">智能备课</span>
            </el-menu-item>

            <!-- Manual lesson preparation -->
            <el-menu-item
              class="top-nav-item"
              index="/manualPrepare"
              @click="handleSelect('/manualPrepare')"
            >
              <span class="text">手动备课</span>
            </el-menu-item>

            <!-- My lesson preparations -->
            <el-menu-item
              class="top-nav-item"
              index="/preparation/myTeaching"
              @click="handleSelect('/preparation/myTeaching')"
            >
              <span class="text">我的备课</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showFixed = ref(false)
const isSubjectDropdownShow = ref(false)
const currSubject = ref({
  periodName: '高中',
  subjectName: '数学'
})
const currDisabledNav = ref(false)
const subjectList = ref([
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
])

const handleSelect = (key) => {
  console.log('Selected menu item:', key)
}

const changeSubject = (subject) => {
  currSubject.value = subject
}

const entryFirstMenu = (path) => {
  console.log('Entering first menu:', path)
}

const isDisabledNav = (navType) => {
  return false
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
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
  background: #fff;
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
    background-color: #fff;

    .top-nav-item {
      height: 50px;
      line-height: 50px;
      float: left;
      position: relative;
      margin: 0 32px 0 0;
      font-size: 14px;

      &:hover {
        .text {
          color: #487FFF;
        }
      }

      .text {
        color: #333;
        font-size: 14px;
      }

      &.is-active {
        border-bottom: 2px solid #487FFF;

        .text {
          color: #487FFF;
        }
      }
    }

    .subject-nav-item {
      margin-right: 32px;

      .text {
        color: #333;
        font-size: 14px;

        .iconfont {
          font-size: 14px;
          margin-right: 4px;
        }

        .dropdown-text {
          font-style: normal;
        }
      }

      .icon-triangle {
        position: absolute;
        top: 22px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #333;
        transition: 0.2s ease-in;
        margin-left: 14px;

        &.up-triangle {
          transform: rotate(180deg);
        }
      }

      &:hover {
        .text {
          color: #487FFF;
        }

        .icon-triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #487FFF;
        }
      }

      &.is-active {
        border-bottom: 2px solid #487FFF;

        .text {
          color: #487FFF;
        }

        .icon-triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #487FFF;
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
    color: #333;
    font-size: 14px;

    &:hover {
      background: #f5f7fa;
      color: #487FFF;
    }

    &.active-subject {
      color: #487FFF;
    }
  }

  .dropdown-menu-item2 {
    &:hover {
      background: #f5f7fa;
      color: #487FFF;
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
