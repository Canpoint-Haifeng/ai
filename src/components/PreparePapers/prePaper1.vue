<template>
  <div class="content-display">
    <div class="content-display-head">
      <div class="pulic">
        <div class="title">
          <span class="plan"> 教案</span>
          {{ lessonData.name }}
        </div>
        <div class="description">
          <div class="description-title">
            全品文教
          </div>
          <div class="description-time">
            {{ lessonData.createTime }}
          </div>
        </div>
      </div>
      <div class="operation">
        <i>下载</i>
        <i>投稿</i>
        <i>编辑</i>
      </div>
    </div>
    <div class="content-display-content">
      <div class="head-title">
        <div class="section-title text-center">
          {{ lessonData.title }}
        </div>
        <div class="section-sub-title text-center">
          {{ lessonData.subTitle }}
        </div>
      </div>
      <section
        v-for="outline in lessonData.outline"
        :key="outline.id"
      >
        <div class="section-title text-left first-level-heading border-b">
          {{ outline.name }}
        </div>
        <!-- 遍历每个子部分的内容 -->
        <div v-if="outline.child && outline.child.length > 0">
          <div
            v-for="item in outline.child"
            :key="item.id"
            class="second-level"
          >
            <div class="item-title second-level-heading">
              {{ item.name }}
            </div>
            <div class="section-title second-level-content">
              second-level{{ outline.content }}
            </div>
            <!-- 可以继续根据需要添加更多层级的遍历 -->
          </div>
        </div>
      </section>
    </div>
    <!-- 遍历每个主要的部分如预习学案、教学设计等 -->
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  props: {
    lessonData: Object // 接收从父组件传递的整个数据对象
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.content-display {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  margin-bottom: 30px;
  .content-display-head {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 20px;
    width: 100%;
    height: 110px;
    background: #FFFFFF;
    border-radius: 0px 0px 0px 0px;
    margin-bottom: 16px;
    .pulic {
      height: 100%;
      flex-direction: column;
      display: flex;
      justify-content: space-between;
    }
    .title {
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: normal;
      font-size: 16px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .plan {
        color: #487FFF;
        padding: 2px 8px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #487FFF;
        font-size: 12px;
      }
    }
    .description {
      display: flex;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: normal;
      font-size: 12px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .description-time {
        margin-left: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 12px;
        color: #8491A5;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }
  }
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .content-display-content {
    clear: both;
    background: #fff;
    overflow: hidden;
    .head-title {
      padding: 20px;
    }
    .section-title {
      text-align: center;
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      color: #333333;
      line-height: 36px;
      font-style: normal;
      text-transform: none;
     font-family: MicrosoftYaHei-Bold, MicrosoftYaHei-Bold;
    }
    .section-sub-title {
      margin-top: 20px;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      width: 100%;
      text-align: center;
      font-weight: normal;

      font-size: 18px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }
    section {
      .border-b {
        border-bottom: 1px solid #ccc;
      }
      padding: 20px;
      text-align: left;
      .section-title {
        text-align: left;
        //padding: 8px;
      }
      .first-level-heading {

      }

      .second-level-heading {
        padding-bottom: 20px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .second-level {
        padding: 20px 10px;
        //padding-bottom: 20px;
      }
      .second-level-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 18px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        &:first-of-type {
          justify-content: center;
        }
      }
    }
  }
}

</style>