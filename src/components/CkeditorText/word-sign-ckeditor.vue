<template>
  <div
    :id="editid"
    ref="editor_con"
    class="editorview"
    :class="{ 'border-rect': showborder }"
  />
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import CTS from '@/common/js/constant'
import { throttle } from '@/common/helper/throttle-debounce'

export default {
  name: 'WordSignCkeditor',
  props: {
    editid: {
      type: String,
    },
    content: {
      type: String,
    },
    clientHeight: Number,
    showborder: Boolean,
  },
  setup(props, { emit, refs }) {
    const isDestroy = ref(false)
    const mcontent = ref('')
    const htmlcontent = ref('')
    const wrapperThrottle = ref(null)
    
    // Methods
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
      if (!isDestroy.value) {
        refs.editor_con.innerHTML = mcontent.value
        let config = {}
        
        config.toolbarGroups = [
          { name: 'document', groups: ['mode'] },
          { name: 'others' },
        ]

        config.extraPlugins = 'autogrow,cpSignTi'
        config.cpsignTiButtons =
          'sign2ques2,sign2ques3,sign2ques4,sign2ques5,sign2ques6,sign2ques7'
        config.autoGrow_maxHeight = props.clientHeight - 245
        config.autoGrow_minHeight = props.clientHeight - 245
        config.height = props.clientHeight - 245
        config.allowedContent = CTS.constant.allowedContent

        config.contenteditable = true
        refs.editor_con.innerHTML = mcontent.value
        
        window.CKEDITOR.replace(props.editid, config)
        let meditor = window.CKEDITOR.instances[props.editid]
        
        if (meditor) {
          meditor.on('instanceReady', (event) => {
            console.log('初始化完成', mcontent.value.length)
            if (mcontent.value) {
              onRendermContent(mcontent.value)
            }
          })
          
          meditor.on('change', (event) => {
            changeData()
          })
        }
      }
    }
    
    const changeData = () => {
      // 截流
      if (!wrapperThrottle.value) {
        wrapperThrottle.value = throttle(1000, updataCkEditorData)
      }
      wrapperThrottle.value()
    }
    
    const updataCkEditorData = () => {
      emit('updataCkEditorData')
    }
    
    // Watch for content changes
    watch(() => props.content, (newValue) => {
      onRendermContent(newValue)
    })
    
    // Lifecycle hooks
    onMounted(() => {
      openEditor()
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
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.editorview {
  line-height: 1.5;
  color: #333333;
  min-height: 700px;
  background: rgba(255, 255, 255, 1);
  padding: 5px 5px 5px 5px;
  overflow: hidden;
  overflow-y: auto;
  font-family: Arial, '微软雅黑', 'Lucida Grande', 'Lucida Sans Unicode',
    Tahoma, san-serif;
  word-break: break-word;

  table {
    border-collapse: separate;
    border-spacing: 2px;
  }
}
</style>

