<template>
  <div class="home-user-app-segment">
    <div class="home-user-app-list">
      <div
        class="home-user-app-item"
        v-for="item in appList"
        :key="item.id"
        @click="openUserApp(item)"
      >
        <div class="app-icon">
          <img class="app-img" :src="item.iconImg" alt="" />
        </div>
        <div class="app-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        appList: [
          {
            id: 1,
            name: '我的题库',
            iconImg:
              '//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/9ce7dd91-5970-4da9-86d2-9ecd20832538.png',
            url: '/paper/resources/ques',
            isLogin: true,
          },
          {
            id: 2,
            name: '我的组卷',
            iconImg:
              '//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/0c647394-7fe1-471c-b2c4-90ec3682bcad.png',
            url: '/paper/resources/papers',
            isLogin: true,
          },
          {
            id: 3,
            name: '我的下载',
            iconImg:
              '//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/1e4a9730-63b7-4e9f-9c5d-0d9a3cb3d775.png',
            url: '/paper/resources/papers?tabActiveName=myDownloadPaper',
            isLogin: true,
          },
          {
            id: 4,
            name: '我的资产',
            iconImg:
              'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/09ea8fa8-8474-4c57-a635-70214ac2233b.png',
            url: '/paper/users/myProperty',
            isLogin: true,
          },
        ],
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },

    methods: {
      openUserApp(item) {
        // this.openWindowLink(item.url)
        this.$router.push(item.url)
      },
      // getDefaultConfigs() {
      //   if (!(this.currSubject && this.currSubject.periodCode)) {
      //     return
      //   }
      //   let params = {
      //     stage: this.currSubject.periodCode,
      //     subject: this.currSubject.subjectCode,
      //   }
      //   let url = API.MY_NOTOKEN_DEFAULTCONFIGS
      //   if (isLogin()) {
      //     url = API.MY_HOMEPAGECONFIG_USER_DEFAULTCONFIGS
      //   }
      //   this.apiGet(url, params).then((res) => {
      //     if (this.checkoutRes(res)) {
      //       this.appList = res.data
      //     }
      //   })
      // },
    },
  }
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .home-user-app-segment {
    .home-user-app-list {
      padding: 40px 15px 10px 15px;
      .home-user-app-item {
        width: 100px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        user-select: none;
        .app-icon {
          width: 50px;
          height: 50px;
          display: inline-block;

          .app-img {
            width: 50px;
            height: 50px;
          }
        }
        &:hover {
          .app-icon {
            .app-img {
              background: #ffffff;
              box-shadow: 0px 0px 18px 0px rgba(27, 50, 89, 0.13);
              border-radius: 10px;
            }
          }
        }
        .app-name {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
        }
      }
    }
  }
</style>

