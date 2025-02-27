/* eslint-disable */
const cfgDict = {
  getMathTemp(stageSubject) {
    let item = this.subjectMathTemp[stageSubject]
    if (item) {
      return item
    } else {
      return this.subjectMathTemp['1111']
    }
  },
  subjectMathTemp : {
    '119911': { name: '小学语文',
      config: {
        mathmodelTemp: 'xxyw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '119912': { name: '小学数学',
      config: {
        mathmodelTemp: 'xxsx',
        removeButtons: 'prefill,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '119913': { name: '小学英语',
      config: {
        mathmodelTemp: 'yy',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '119920': { name: '小学科学',
      config: {
        mathmodelTemp: 'xxsx',
        removeButtons: 'prefill,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '129911': { name: '初中语文',
      config: {
        mathmodelTemp: 'yw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '129912': { name: '初中数学',
      config: {
        mathmodelTemp: 'czsx',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '129913': { name: '初中英语',
      config: {
        mathmodelTemp: 'yy',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '129914': { name: '初中物理',
      config: {
        mathmodelTemp: 'wl',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '129915': { name: '初中化学',
      config: {
        mathmodelTemp: 'hx',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '129916': { name: '初中历史',
      config: {
        mathmodelTemp: 'yw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '129917': { name: '初中道法',
      config: {
        mathmodelTemp: 'yw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '129918': { name: '初中地理',
      config: {
        mathmodelTemp: 'ls',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '129919': { name: '初中生物',
      config: {
        mathmodelTemp: 'ls',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '129920': { name: '初中科学',
      config: {
        mathmodelTemp: 'ls',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139911': { name: '高中语文',
      config: {
        mathmodelTemp: 'yw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '139912': { name: '高中数学',
      config: {
        mathmodelTemp: 'gzsx',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139913': { name: '高中英语',
      config: {
        mathmodelTemp: 'yy',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
    '139914': { name: '高中物理',
      config: {
        mathmodelTemp: 'wl',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139915': { name: '高中化学',
      config: {
        mathmodelTemp: 'gzhx',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,prelongFill,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'prepoint2', '-', 'RemoveFormat', 'cptool', 'Font']]
      }
    },
    '139919': { name: '高中生物',
      config: {
        mathmodelTemp: 'hx',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139916': { name: '高中历史',
      config: {
        mathmodelTemp: 'ls',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139918': { name: '高中地理',
      config: {
        mathmodelTemp: 'dl',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,preborder,' +
                      'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['mathjax', '-', 'Bold', 'prepoint2', '-', 'RemoveFormat']]
      }
    },
    '139922': { name: '高中政治',
      config: {
        mathmodelTemp: 'yw',
        removeButtons: 'MenuBlanksBox,Cut,Copy,Paste,Anchor,Outdent,Indent,FontSize,NumberedList,BulletedList,solutionquation,' +
                  'Underline,DoubleLine,waveicons,prepoint2,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock',
        floatingtools_Basic: [['Bold', 'Italic', 'Underline', 'waveicons', 'Strike', 'prepoint2', '-', 'preborder', 'Subscript', 'Superscript', 'Font']]
      }
    },
  }
}

export default cfgDict
