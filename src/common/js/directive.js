/* eslint-disable */
function setChildrenStyle(el, cwidth) {
  if (el && el.children && el.children.length) {
    let list = el.children
    let len = list.length
    for (let i = 0; i < len; i++) {
      let item = list[i]
      item.style.paddingRight = '0px'
      item.style.width = cwidth + 'px'
    }
  }
}

export default {
  install: function (Vue) {
    Vue.directive('dialogDrag', {
      bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cursor = 'move'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty =
          dragDom.currentStyle || window.getComputedStyle(dragDom, null)

        dialogHeaderEl.onmousedown = (e) => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop

          // 获取到的值带px 正则匹配替换
          let styL, styT

          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if (sty.left.includes('%')) {
            styL =
              +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
            styT =
              +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
          } else {
            styL = +sty.left.replace(/\px/g, '')
            styT = +sty.top.replace(/\px/g, '')
          }

          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY

            // 移动当前元素
            dragDom.style.left = `${l + styL}px`
            dragDom.style.top = `${t + styT}px`

            // 将此时的位置传出去
            // binding.value({x:e.pageX,y:e.pageY})
          }

          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      },
    })

    // 选项适应指令
    Vue.directive('autos', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: function (el, binding, vnodes) {
        function children(nodeList) {
          for (let i = 0; i < nodeList.length; i++) {
            let item = nodeList[i]
            if (item.nodeName === 'IMG') {
              imgArr.push(item)
            }
            if (item.childNodes.length) {
              children(item.childNodes)
            }
          }
        }

        function imgLoad(img, callback) {
          if (img) {
            var timer = setInterval(function () {
              if (img.complete) {
                clearInterval(timer)
                callback(img)
              }
            }, 400)
            img.onerror = function (i) {
              clearInterval(timer)
              timer = null
              img.onerror = null
            }
          }
        }

        function calculation() {
          for (let i = 0; i < chirdnodes.length; i++) {
            let widths = chirdnodes[i].offsetWidth
            if (chirdnodes[i].nodeName === 'SPAN') {
              elWidth += widths
              chirdWidth.push(widths + 'px')
              maxWidth.push(widths)
            }
          }
          if (elWidth < 820 || elWidth > el.offsetWidth) {
            elWidth = el.offsetWidth
          }
          let maxNum = Math.max(...maxWidth)
          let chirdNodesLehgth = chirdWidth.length
          let averageWidth = elWidth / chirdNodesLehgth
          if (maxWidth.length === 4) {
            if (maxNum > averageWidth * 2) {
              column = 1
            } else if (
              maxNum > averageWidth &&
              maxNum < averageWidth * 2 - 30
            ) {
              column = 2
            } else if (maxNum < averageWidth) {
              column = 4
            }
          } else if (maxWidth.length === 3) {
            if (maxNum > averageWidth) {
              column = 1
            } else if (maxNum < averageWidth) {
              column = 3
            }
          } else if (maxWidth.length === 2) {
            if (maxNum > averageWidth) {
              column = 1
            } else if (maxNum < averageWidth) {
              column = 2
            }
          } else if (maxWidth.length > 4 && maxNum < averageWidth + 20) {
            column = 4
          } else if (maxWidth.length > 4 && maxNum > averageWidth + 20) {
            column = 1
          }

          // console.log(chirdWidth, column, elWidth)
          if (column === 1) {
            el.style.display = 'grid'
            el.style.gridTemplateColumns = 'auto'
            // 设置 子集 宽度
            setChildrenStyle(el, elWidth / column)
          } else if (column === 2) {
            el.style.display = 'grid'
            el.style.gridTemplateColumns = 'auto auto'
            setChildrenStyle(el, elWidth / column)
            // el.style.paddingRight = '50px'
          } else if (column === 3) {
            el.style.display = 'flex'
            setChildrenStyle(el, elWidth / column)
            // el.style.gridTemplateColumns = 'auto auto auto'
          } else if (column === 4) {
            el.style.display = 'flex'
            el.style.flexWrap = 'wrap'
            setChildrenStyle(el, (elWidth / column) - 1)
            // 设置 子集 宽度
            // el.style.gridTemplateColumns = 'auto auto auto auto'
          } else {
            // el.style.display = 'flex'
            // el.style.flexDirection = 'column'
          }
        }
        // 聚焦元素
        // setTimeout(() => {
        let elWidth = 0
        let chirdnodes = el.childNodes
        let column = 1
        let chirdWidth = []
        let maxWidth = []
        let imgArr = []
        children(el.childNodes)
        if (imgArr.length) {
          for (let i = 0; i < imgArr.length; i++) {
            imgLoad(imgArr[i], function () {
              if (i === imgArr.length - 1) {
                calculation()
              }
            })
          }
        } else {
          calculation()
        }

        // },10)
      },
    })

    Vue.directive('renderjax', {
      bind: (el) => {
        if (window.MathJax && window.MathJax.Hub) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el])
        }

        /* window.MathJax.Hub.Queue(function () {
          try {
            let b = window.MathJax.Hub.inputJax['math/tex']
            b.Process({
              text: '{ρ}',
              type: 'math/tex',
              MathJax: {
                state: 1
              },
              inputID: 'MathJax-Element-2',
              inputJax: 'TeX',
              newID: 1,
              outputJax: 'CommonHTML'
            })
          } catch (e) {
            console.log('渲染特殊字符')
          }
        }) */
      },
    })
    /* const setOptionWidth = (el, binding) => {
      const boxWidth = binding.value // 容器宽度
      const li = el.querySelectorAll('li')
      Array.from(li).forEach((item) => {
        item.style.display = 'inline-block'
      })
      const oneRowWidth = boxWidth
      const twoRowWidth = boxWidth / 2
      const fourRowWidth = boxWidth / 4
      let lisWidth = []
      let liWidth = 0
      Array.from(li).forEach((item) => {
        // const imgs = Array.from(item.querySelectorAll('img'))
        // for (let imgItem of imgs) {
        //   if (imgItem.complete) {
        //     status.push(imgItem.complete)
        //   }
        // }
        lisWidth.push(item.offsetWidth)
      })
      const liMaxWidth = Math.max.apply(null, lisWidth)
      if (liMaxWidth <= fourRowWidth) {
        liWidth = fourRowWidth
      } else if (liMaxWidth > fourRowWidth && liMaxWidth <= twoRowWidth) {
        liWidth = twoRowWidth
      } else {
        liWidth = oneRowWidth
      }
      Array.from(li).forEach((item) => {
        item.style.width = liWidth + 'px'
      })
    } */
    /* Vue.directive('renderOption', {
      // inserted: setOptionWidth
      update: setOptionWidth
    }) */
    // 选项适应指令
    Vue.directive('renderOption', {
      inserted: function (el, binding, vnodes) {
        function children(nodeList) {
          for (let i = 0; i < nodeList.length; i++) {
            let item = nodeList[i]
            if (item.nodeName === 'IMG') {
              imgArr.push(item)
            }
            if (item.childNodes.length) {
              children(item.childNodes)
            }
          }
        }

        function imgLoad(img, callback) {
          if (img) {
            var timer = setInterval(function () {
              if (img.complete) {
                clearInterval(timer)
                callback(img)
              }
            }, 400)
            img.onerror = function (i) {
              clearInterval(timer)
              timer = null
              img.onerror = null
            }
          }
        }

        function calculation() {
          let widths = 0
          for (let i = 0; i < chirdnodes.length; i++) {
            if (chirdnodes[i].nodeName === 'LI') {
              widths = chirdnodes[i].offsetWidth
              elWidth += widths
              chirdWidth.push(widths + 'px')
              maxWidth.push(widths)
            }
          }
          if (elWidth < 820 || elWidth > el.offsetWidth) {
            elWidth = el.offsetWidth
          }
          let maxNum = Math.max(...maxWidth)
          let chirdNodesLehgth = chirdWidth.length
          let averageWidth = elWidth / chirdNodesLehgth
          if (maxWidth.length === 4) {
            if (maxNum > averageWidth * 2) {
              column = 1
            } else if (
              maxNum > averageWidth &&
              maxNum < averageWidth * 2 - 30
            ) {
              column = 2
            } else if (maxNum <= averageWidth) {
              column = 4
            }
          } else if (maxWidth.length === 3) {
            if (maxNum > averageWidth) {
              column = 1
            } else if (maxNum < averageWidth) {
              column = 3
            }
          } else if (maxWidth.length === 2) {
            if (maxNum > averageWidth) {
              column = 1
            } else if (maxNum < averageWidth) {
              column = 2
            }
          } else if (maxWidth.length > 4 && maxNum < averageWidth + 20) {
            column = 4
          } else if (maxWidth.length > 4 && maxNum > averageWidth + 20) {
            column = 1
          }
          console.log(chirdWidth, column, elWidth)
          if (column === 1) {
            el.style.display = 'grid'
            el.style.gridTemplateColumns = 'auto'
          } else if (column === 2) {
            el.style.display = 'grid'
            el.style.gridTemplateColumns = 'auto auto'
          } else if (column === 3) {
            el.style.display = 'flex'
            el.style.alignItems = 'flex-end'
          } else if (column === 4) {
            el.style.display = 'flex'
            el.style.alignItems = 'flex-end'
            el.style.flexWrap = 'wrap'
          } else {
          }
        }
        // 聚焦元素
        let elWidth = 0
        let chirdnodes = el.childNodes
        let column = 1
        let chirdWidth = []
        let maxWidth = []
        let imgArr = []
        children(el.childNodes)
        if (imgArr.length) {
          for (let i = 0; i < imgArr.length; i++) {
            imgLoad(imgArr[i], function () {
              if (i === imgArr.length - 1) {
                calculation()
              }
            })
          }
        } else {
          calculation()
        }
      },
    })
  },
}
