<template>
  <!-- <div class="editorview" contenteditable="true" :id="editid" ref="editor_con"></div> -->
  <div
    :id="editid"
    ref="editor_con"
    class="editorview"
    @click="editorClick"
    v-html="mcontent"
  />
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { useStore } from 'vuex'
import cfgDict from './config.js'
import { throttle } from '@/common/helper/throttle-debounce'
import { getToken } from '@/common/js/util'

export default {
  name: 'SeparateSignCkeditor',
  props: {
    editid: {
      type: String
    },
    content: {
      type: String
    },
    clientHeight: Number
  },
  setup(props, { emit, refs }) {
    const store = useStore()
    const app = inject('app')
    
    const isDestroy = ref(false)
    const mcontent = ref('')
    const htmlcontent = ref('')
    const wrapperThrottle = ref(null)
    
    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    
    // Watch for content changes
    watch(() => props.content, (newValue) => {
      if(mcontent.value === newValue) return
      onRendermContent(newValue)
    })
    
    // Methods
    const editorClick = () => {
      let currentEditor = app.currentEditor
      currentEditor && currentEditor.destroy()
      openEditor()
    }
    
    const onRendermContent = (v) => {
      mcontent.value = v
      let editor = window.CKEDITOR.instances[props.editid]
      if (editor) {
        editor.setData(mcontent.value)
      }
    }
    
    const resultCkEditorData = () => {
      let meditor = window.CKEDITOR.instances[props.editid]
      let tempcontent = ''
      if (meditor) {
        tempcontent = meditor.getData()
      }
      return tempcontent
    }
    
    const openEditor = () => {
      if (!isDestroy.value || 1) {
        const VITE_ENV_FLAG = import.meta.env.VITE_ENV
        const VITE_MATHTEMPCONFIG = import.meta.env.VITE_MATHTEMPCONFIG
        const VITE_STATICSOURCE = import.meta.env.VITE_SRC
        
        let config = { mathtempConfig: `/plugins/qchoice/${VITE_MATHTEMPCONFIG}` }
        if (VITE_ENV_FLAG == "dev") { // 测试环境加 management
          config = { mathtempConfig: `/management/plugins/qchoice/${VITE_MATHTEMPCONFIG}` }
        }
        
        const curStageSubject = currSubject.value.periodCode + currSubject.value.subjectCode
        const mathTemp = cfgDict.getMathTemp(curStageSubject)
        config = Object.assign(config, mathTemp.config)
        config.vue_app_base_url = VITE_STATICSOURCE
        config.canpointToken = getToken()
        
        config.extraPlugins = 'divarea,cpSeparate,cpbatch2latex,cpmenubutton,panelbutton,cpSignTi,cpfind,floating-tools,mathjax,xml,ajax,basicstyles,autogrow,cptool,imageresizerowandcolumn,ckeditor_wiris'
        config.autoGrow_maxHeight = 100000
        config.contenteditable = true
        
        refs.editor_con.innerHTML = mcontent.value
        window.CKEDITOR.replace(props.editid, config)
        window.CKEDITOR.addCss(".cke_editable{background-color: #fff;}")
        
        let meditor = window.CKEDITOR.instances[props.editid]
        app.currentEditor = meditor
        
        if (meditor) {
          meditor.on('instanceReady', event => {
            if (mcontent.value) {
              onRendermContent(mcontent.value)
            }
          })
          
          meditor.on('change', event => {
            changeData()
          })
        }
      }
    }
    
    const changeData = () => {
      // 截流
      if (!wrapperThrottle.value) {
        wrapperThrottle.value = throttle(200, updataCkEditorData)
      }
      wrapperThrottle.value()
    }
    
    const updataCkEditorData = () => {
      const editor = window.CKEDITOR.instances[props.editid]
      const str = editor && editor.getData()
      mcontent.value = str
      emit('updataCkEditorData', str)
    }
    
    // Lifecycle hooks
    onMounted(() => {
      if (props.content) {
        mcontent.value = props.content
      }
    })
    
    onBeforeUnmount(() => {
      isDestroy.value = true
      let meditor = window.CKEDITOR.instances[props.editid]
      if (meditor) {
        meditor.destroy(true)
        meditor = null
      }
      wrapperThrottle.value = null
    })
    
    return {
      mcontent,
      editorClick,
      onRendermContent,
      resultCkEditorData,
      openEditor,
      changeData,
      updataCkEditorData
    }
  }
}
</script>

<style lang="scss" scoped>
.editorview {
  line-height: 1.5;
  color: #333333;
  min-height: 100px;
  // background: rgba(255, 255, 255, 1);
  padding: 5px 5px 5px 5px;
  overflow: hidden;
  overflow-y: auto;
  font-family: Arial, '微软雅黑', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, san-serif;
  word-break: break-word;
  table {
    border-collapse: separate;
    border-spacing: 2px;
  }
}
</style>
