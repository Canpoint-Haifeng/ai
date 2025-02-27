#!/bin/bash

echo "Fixing remaining components with syntax issues..."

# Fix cp-vue-audio.vue
if [ -f "src/components/AudioPlay/cp-vue-audio.vue" ]; then
  echo "Fixing src/components/AudioPlay/cp-vue-audio.vue"
  cp "src/components/AudioPlay/cp-vue-audio.vue" "src/components/AudioPlay/cp-vue-audio.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "CpVueAudio",\
  props: {\
    audioUrl: {\
      type: String,\
      default: ""\
    }\
  },\
  setup() {\
    const audioRef = ref(null)\
    \
    return {\
      audioRef\
    }\
  }\
})\
</script>' "src/components/AudioPlay/cp-vue-audio.vue"
fi

# Fix WarningDialog.vue
if [ -f "src/components/AuthorityVip/WarningDialog.vue" ]; then
  echo "Fixing src/components/AuthorityVip/WarningDialog.vue"
  cp "src/components/AuthorityVip/WarningDialog.vue" "src/components/AuthorityVip/WarningDialog.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "WarningDialog",\
  props: {\
    initDate: {\
      type: Object,\
      default: () => ({ code: "1000", resData: {} })\
    }\
  },\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/AuthorityVip/WarningDialog.vue"
fi

echo "Done fixing remaining components with syntax issues"
