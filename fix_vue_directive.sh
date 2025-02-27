#!/bin/bash

echo "Fixing Vue.directive to app.directive..."

# Create a directives.js file if it doesn't exist
mkdir -p src/directives
if [ ! -f "src/directives/index.js" ]; then
  cat > src/directives/index.js << 'EOLDIR'
// Directives
export default {
  install(app) {
    // Dialog drag directive
    app.directive('dialogDrag', {
      mounted(el, binding) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cursor = 'move'

        // Get the original styles
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
        
        dialogHeaderEl.onmousedown = (e) => {
          // Mouse position at click
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop
          
          // Get the original width and height
          const dragDomWidth = dragDom.offsetWidth
          const dragDomHeight = dragDom.offsetHeight
          
          const screenWidth = document.body.clientWidth
          const screenHeight = document.body.clientHeight
          
          const minDragDomLeft = dragDom.offsetLeft
          const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
          
          const minDragDomTop = dragDom.offsetTop
          const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight
          
          // Get the style values
          let styL = sty.left
          let styT = sty.top

          // Convert to number
          if (styL.includes('%')) {
            styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
            styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
          } else {
            styL = +styL.replace(/px/g, '')
            styT = +styT.replace(/px/g, '')
          }

          document.onmousemove = function(e) {
            // Calculate movement
            let left = e.clientX - disX
            let top = e.clientY - disY

            // Constrain to screen
            if (-(left) > minDragDomLeft) {
              left = -minDragDomLeft
            } else if (left > maxDragDomLeft) {
              left = maxDragDomLeft
            }

            if (-(top) > minDragDomTop) {
              top = -minDragDomTop
            } else if (top > maxDragDomTop) {
              top = maxDragDomTop
            }

            // Move the dialog
            dragDom.style.left = `${left + styL}px`
            dragDom.style.top = `${top + styT}px`
          }

          document.onmouseup = function() {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    })

    // Auto focus directive
    app.directive('autos', {
      mounted(el, binding) {
        el.focus()
      }
    })

    // Render jax directive
    app.directive('renderjax', {
      mounted(el, binding) {
        if (window.MathJax) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el])
        }
      },
      updated(el, binding) {
        if (window.MathJax) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el])
        }
      }
    })

    // Render option directive
    app.directive('renderOption', {
      mounted(el, binding) {
        if (window.renderMathInElement) {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          })
        }
      },
      updated(el, binding) {
        if (window.renderMathInElement) {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          })
        }
      }
    })
  }
}
EOLDIR
fi

# Update main.js to use the directives
if grep -q "import directive from '@/common/js/directive'" src/main.js; then
  sed -i 's/import directive from .@\/common\/js\/directive./import directives from "@\/directives"/g' src/main.js
  sed -i 's/directive(Vue)/app.use(directives)/g' src/main.js
fi

echo "Vue.directive fixed."
