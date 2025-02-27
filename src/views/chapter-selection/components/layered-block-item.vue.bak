<script>
  export default {
    props: {
      node: Object,
      currentCode: String,
    },
    data() {
      return {}
    },
    methods: {
      selectItem() {
        this.$emit('selectItem', this.node)
      },
    },
    render(h) {
      let activate = this.node.code == this.currentCode
      if (this.node.codeType) {
        let className = 'block-item-' + this.node.codeType
        if (activate) {
          className += ' activate'
        }

        return h(
          'div',
          {
            class: ['block-item', className].join(' '),
            on: {
              click: this.selectItem,
            },
          },
          [
            h(
              'div',
              {
                class: 'layered-name',
              },
              this.node.name,
            ),
            h('div', { class: 'layered-tips' }, this.node.tips),
          ],
        )
      } else {
        let className = 'block-item-more'
        if (activate) {
          className += ' activate'
        }
        return h(
          'div',
          {
            class: className,
            on: {
              click: this.selectItem,
            },
          },
          [h('div', { class: 'block-item-name' }, '更多')],
        )
      }
    },
  }
</script>

<style scoped lang="scss">
  .block-item-more {
    width: 87px;
    height: 96px;
    background: #ffffff;
    box-sizing: border-box;
    padding: 15px 33px;
    cursor: pointer;
    user-select: none;
    .block-item-name {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/1701041d-8baa-43b0-8ac3-31266ea8a98f.png);
        background-size: 20px 20px;
      }
    }
    &.activate {
      box-shadow: 0 0 2px 5px #acc9f5;
    }
  }

  .block-item-11 {
    background: linear-gradient(90deg, #fffefe, #f1f9ff);
    border: 1px solid #c2e7f3;
    .layered-name::before {
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/e14044a9-6f47-4733-89d5-9d510af4f393.png);
    }
    &.activate {
      box-shadow: 0 0 2px 5px #c2e7f3;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 82px;
      height: 70px;
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/6b3cb1c1-3a01-4035-ada2-621f2fb33e58.png);
      background-size: 82px 70px;
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0px;
      right: 10px;
    }
  }
  .block-item-12 {
    background: linear-gradient(90deg, #fffefe, #fff6fa);
    border: 1px solid #ffe4ca;
    .layered-name::before {
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/9ad08cc7-0a67-4b70-87cb-0f850dfb8d0f.png);
    }
    &.activate {
      box-shadow: 0 0 2px 5px #ffe4ca;
    }

    &::after {
      content: '';
      display: inline-block;
      width: 100px;
      height: 71px;
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/22918500-eb6f-4be0-a87d-8c19bf87fca4.png);
      background-size: 100px 71px;
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0px;
      right: 10px;
    }
  }
  .block-item-13 {
    background: linear-gradient(90deg, #fffefe, #fffcea);
    border: 1px solid #fbedd6;
    .layered-name::before {
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/8de38202-b8c6-4c9d-a2c3-176f298e2326.png);
    }
    &.activate {
      box-shadow: 0 0 2px 5px #fbedd6;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 91px;
      height: 74px;
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/d0b95dec-d6cf-462c-b91d-28f713f03c93.png);
      background-size: 91px 74px;
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0px;
      right: 10px;
    }
  }

  .block-item {
    position: relative;
    width: 260px;
    height: 96px;
    box-sizing: border-box;
    padding: 25px;
    cursor: pointer;
    user-select: none;
    .layered-name {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      padding-bottom: 14px;
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: 20px 20px;
        vertical-align: text-bottom;
        padding-right: 7px;
      }
    }
    .layered-tips {
      font-size: 14px;
      color: #224755;
    }
  }
</style>
