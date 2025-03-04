<template>
  <div class="popover-content-my">
    <div class="popover-user-info">
      <section>
        <div class="img">
          <img
            class="border50"
            v-if="userInfo.profilePhoto"
            :src="userInfo.profilePhoto"
            alt=""
          />
          <img
            class="border50"
            v-else
            src="../../assets/images/avatar.png"
            alt=""
          />
        </div>
        <div class="name_id">
          <div class="name">
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="vip" v-if="userInfo.isVip">
            <img
              v-if="vipInfo.vipLevel === 0"
              src="../../assets/images/users/vip1.webp"
              alt=""
            />
            <span
              @click="skip('/vip')"
              v-if="vipInfo.vipLevel === 0"
              class="to-vip-text"
              >开通会员</span
            >
            <img
              v-if="vipInfo.vipLevel === 1"
              src="../../assets/images/users/vip2.webp"
              alt=""
            />
            <img
              v-if="vipInfo.vipLevel === 2"
              src="../../assets/images/users/vip3.webp"
              alt=""
            />
            <img
              v-if="vipInfo.vipLevel === 3"
              src="../../assets/images/users/vip4.webp"
              alt=""
            />
            <span class="endtime" v-if="vipInfo.vipEndTime > 0"
              >有效期至 endTime
            </span>
          </div>
          <div v-else class="no-vip vip">
            <img src="../../assets/images/users/vip1.webp" alt="" />
            <span class="to-vip-text">开通会员</span>
          </div>
        </div>
      </section>
      <div class="popper-nav-box">
        <div
          class="popper-nav-item-box"
          v-for="(item, index) in naveList"
          :key="index"
          @click="skip(item.path)"
        >
          <img class="popper-nav-img" :src="item.icon" />
          <div class="popper-nav-item-text">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <el-button class="popover-content-my-button" @click="logout()"
      >退出登录</el-button
    >
  </div>
  <!-- <div slot="reference">
    <div>
      <span class="el-dropdown-link top">
        <img
          v-if="userInfo.avatar"
          :src="userInfo.avatar"
          :alt="userInfo.username"
          class="new-avatar-img"
          style="width: 24px;height:24px;object-fit:cover;border-radius: 50%;"
        />
        <img
          class="new-avatar-img"
          v-else
          style="width: 24px;height:24px;object-fit:cover;border-radius: 50%;"
          :alt="userInfo.username"
          src="./img/IP.webp"
        />
        我的
        <img
          src="./img/down_small_line.png"
          style="width: 24px;height:24px"
          alt="展开"
        />
      </span>
    </div>
  </div> -->
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'userCenterPopover',
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {},
  data() {
    return {
      vipInfo: {},
      naveList: [
        {
          path: '',
          title: '个人中心',
          icon: require('../../assets/images/users/user_center.png'),
        },
        {
          path: '/preparation/myTeaching',
          title: '我的备课',
          icon: require('../../assets/images/users/user_paper.png'),
        },
        {
          path: '/preparation/myTeaching?type=1',
          title: '我的收藏',
          icon: require('../../assets/images/users/user_collection.png'),
        },
      ],
    }
  },
  mounted() {
    console.log('userInfo', this.userInfo)
  },
  methods: {
    skip(path) {
      this.$router.push(path)
    },
    logout() {
      this.$emit('logout')
    },
  },
}
</script>
<style lang="scss" scoped>
.popover-content-my {
  background: rgb(246, 249, 255);
  width: 320px;
  height: 183px;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .popover-user-info {
    flex: 1;
    padding: 20px;
    .popper-nav-box {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .popper-nav-item-box {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        .popper-nav-item-text {
          margin-top: 6px;
        }
        &:hover {
          color: #487fff;
        }
        .popper-nav-img {
          box-sizing: content-box;
          padding: 8px;
          width: 24px;
          height: 24px;
          background: #fff;
          border-radius: 50%;
        }
      }
    }
    section {
      display: flex;
      color: #333333;
      .name_id {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .border50 {
        border-radius: 50%;
      }
      .endtime {
        font-size: 12px;
        line-height: 26px;
      }
      .to-vip-text {
        display: inline-block;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 14px;
        color: #487fff;
        line-height: 24px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        cursor: pointer;
      }
      .vip {
        img {
          height: 28px;
          width: 86px;
          line-height: 28px;
          vertical-align: bottom;
          margin-right: 8px;
        }
      }
      img {
        object-fit: cover;
        width: 56px;
        height: 56px;
        margin-right: 16px;
      }
    }
  }
  .popper-down-img {
    width: 20px;
    height: 20px;
  }
  .popover-user-info {
    width: 100%;
    .vip {
    }
  }
  .el-button {
    height: 40px;
    width: 100%;
    font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: normal;
    font-size: 14px;
    color: #ff4b36;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    border: none;
  }
}
</style>
