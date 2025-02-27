<template>
  <div class="prePaper-display">
    <div
      v-if="outline && outline.length"
      class="prePaper"
    >
      <div
        v-for="item in outline"
        :key="item.id"
        :class="['item', `level-${level}`, `ordinal-${item.ordinal}`]"
      >
        <h3
          v-if="numeral == 1"
          v-show="item.isShow == 1"
          class="name"
        >
          <span class="chinese-numeral">{{ convertToChineseNumeral(item.ordinal) }}、
          </span>
          <span>{{ item.name }}</span>
        </h3>
        <h3
          v-else-if="level == 1"
          v-show="item.isShow == 1"
          class="name"
        >
          <img
            class="icon-title"
            src="@/assets/images/preview/icon-title.png"
            alt=""
          >
          <span>{{ item.name }}</span>
        </h3>
        <h3
          v-else
          v-show="item.isShow == 1"
          class="name"
        >
          <span class="icon icon-double-dot none" />
          <span class="icon iconfont icon-tag_2_fill none" />
          <span
            :class="{
              'knowledge-name': item.name.includes('知识点'),
              'test-name':
                item.name.includes('考点') || item.name.includes('考向'),
            }"
          >
            {{ item.showName || item.name }}
            <span
              v-if="
                !item.showName &&
                  !item.name.includes('考点') &&
                  !item.name.includes('考向') &&
                  (item.name.includes('知识点') ||
                    item.name.includes('例题') ||
                    item.name.includes('练习') ||
                    item.name.includes('作业'))
              "
            >{{ item.ordinal }}</span>
          </span>
          <span
            v-if="item.childRule.mustDo > 0"
            :class="[
              'need-do-tag',
              'none',
              { 'choose-do-tag': item.childRule.mustDo !== 1 })

    return {
            ]"
          >
            {{ item.childRule.mustDo === 1 ? '必做' : '选做' }}
          </span>
        </h3>

        <div
          v-if="item.isShow == 1"
          :class="[
            `ordinal-${item.ordinal}`,
            item.childRule.knowledgeOutlineType != 3
              ? 'content'
              : 'margin-b-20',
          ]"
          :data="JSON.stringify(item)"
        >
          <template v-if="parsedContent(item.content) && item.isShow == 1">
            <div
              v-for="(entry, qIndex) in parsedContent(item.content)"
              :key="entry.id"
            >
              <questionItem
                v-if="entry.generalQuestionVo"
                :index="qIndex + 1"
                :info="entry.generalQuestionVo"
              />
              <div v-else>
                <div v-html="entry.content" />
              </div>
            </div>
          </template>
          <div
            v-else
            v-show="item.isShow == 1"
          >
            <p
              v-for="(i, j) in item.content"
              :key="j"
            >
              <span v-html="i.content" />
            </p>
          </div>
        </div>

        <div v-if="item.child && item.child.length && item.isShow == 1">
          <PrePaper
            :outline="item.child"
            :level="level + 1"
            :numeral="level == 1 ? 1 : 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "PrePaper",
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
// ordinal 是顺序
// level是层级

.margin-b-20 {
  margin-bottom: 20px;
}
.prePaper-display {
  .none {
    display: none;
  }
  .level-1 {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 18px;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 16px;
    background-color: #ffffff;

    .icon-title {
      margin-right: 8px;
      vertical-align: bottom;
      display: inline-block;
    }
    & > .name {
      border-bottom: 2px solid #e2e2e2;
      padding: 9px 0;
    }
    &.ordinal-1 {
      .ordinal-1 {
        margin: 20px 0;

        &.level-2 {
          div {
            display: flex;
            justify-content: center;
            > div {
              flex-direction: column;
            }
          }
        }

        & * p {
          margin: 10px 0;
        }
        & * img {
          display: inline-block;
          margin: 0 auto;
          width: 382px;
          height: 271px;
        }
      }
    }
  }
  .level-2 {
    & > .name {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      font-size: 14px;
      padding: 20px 0;
      .chinese-numeral {
        margin-left: 4px;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 20px;
          background-color: #487fff;
          position: absolute;
          left: -14px;
          top: 0;
          border-radius: 2px 2px 2px 2px;
        }
      }
    }
  }
  .level-3 {
    & > .name {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #666666;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 20px;
    }
  }
  .level-4 {
  }
  .level-5 {
  }
  .level-6 {
  }
  .level-7 {
  }
  .item {
    &.level-1 {
      padding: 14px 20px;

      &.ordinal-1 {
        .name {
          .chinese-numeral {
            display: none;
          }
        }
      }
      &.ordinal-2 {
        .ordinal-3 {
          .content {
            background: #f8fbff;
            border-radius: 0px 0px 6px 6px;
            padding: 20px;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            * div {
              display: block;
            }
          }
        }
      }
    }
    &.level-2 {
      padding: 0 10px;
    }
    &.level-3 {
      &.ordinal-2 {
      }
    }

    //按顺序嵌套
    &.ordinal-1.level-1 {
      .level-3 {
        .name {
          display: flex;
          align-items: center;
          .icon-double-dot.none {
            width: 12px;
            height: 8px;
            display: inline-block;
            background-image: url('../../assets/images/preview/icon-double-dot.png');
            background-size: 12px 8px;
            margin-right: 8px;
          }
          .need-do-tag.none {
            display: inline-block;
            width: 45px;
            height: 20px;
            margin-left: 8px;
            background: #ff6e5d;
            border-radius: 6px 6px 6px 0px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
            line-height: 20px;
            text-align: center;
            font-style: normal;
            text-transform: none;
            &.choose-do-tag {
              background: #bababa;
            }
          }
          .difficulty-tag.none {
            display: inline-block;
            width: 80px;
            height: 20px;
            background: #fef2ee;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #fbe0c7;
          }
        }
      }
      .level-2.ordinal-1 {
        .content {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    &.ordinal-1 {
      .level-2 {
        .content {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 30px;
        }
      }
    }

    &.ordinal-2 {
      .level-3 {
        .content {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 30px;
        }
      }
      .level-5 {
        .content {
          margin-top: 20px;
        }
        //例练
        &.ordinal-2 {
          .name {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
          .name:has(.icon-tag_2_fill) {
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            //background: rgba(72, 127, 255, 0.1);
            border-radius: 6px;
          }
          .icon-tag_2_fill.none {
            display: inline-block;
            font-size: 20px;
            color: #487fff;
            margin-right: 8px;
            vertical-align: middle;
          }
        }
      }
      .level-6 {
        .name {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #333333;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
    .ordinal-1 {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;

      & > .name {
        //padding: 20px 0;
      }
    }
  }

  .name:has(.test-name) {
    .test-name {
      //@at-root考点1：正负数的判断和分类
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .icon-double-dot.none {
      display: inline-block;
      width: 12px;
      height: 8px;
      display: inline-block;
      background-image: url('../../assets/images/preview/icon-double-dot.png');
      background-size: 12px 8px;
      margin-right: 8px;
    }
  }
  .name:has(.knowledge-name) {
    padding: 0 10px;
    background: linear-gradient(
      270deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(72, 127, 255, 0.1) 100%
    );
    border-radius: 6px 6px 6px 6px;
    .knowledge-name {
      text-transform: none;
      line-height: 40px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #487fff;
      text-align: left;
      font-style: normal;
    }
  }
}
</style>
