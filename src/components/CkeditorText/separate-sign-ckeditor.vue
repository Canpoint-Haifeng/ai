import { computed, defineComponent, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "SeparateSignCkeditor",
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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
