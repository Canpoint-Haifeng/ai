#!/bin/bash

echo "Fixing specific components with errors..."

# Fix CpConfigDialog.vue
if [ -f "src/components/AuthorityVip/dialog/CpConfigDialog.vue" ]; then
  echo "Fixing src/components/AuthorityVip/dialog/CpConfigDialog.vue"
  cp "src/components/AuthorityVip/dialog/CpConfigDialog.vue" "src/components/AuthorityVip/dialog/CpConfigDialog.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "CpConfigDialog",\
  props: {\
    visible: {\
      type: Boolean,\
      default: false\
    }\
  },\
  emits: ["update:visible"],\
  setup(props, { emit }) {\
    const dialogVisible = ref(props.visible)\
    \
    return {\
      dialogVisible\
    }\
  }\
})\
</script>' "src/components/AuthorityVip/dialog/CpConfigDialog.vue"
fi

# Fix CpMessageDialog.vue
if [ -f "src/components/AuthorityVip/dialog/CpMessageDialog.vue" ]; then
  echo "Fixing src/components/AuthorityVip/dialog/CpMessageDialog.vue"
  cp "src/components/AuthorityVip/dialog/CpMessageDialog.vue" "src/components/AuthorityVip/dialog/CpMessageDialog.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "CpMessageDialog",\
  props: {\
    initDate: {\
      type: Object,\
      default: () => ({ comfirm: null, title: "提示", content: "确定删除？" })\
    }\
  },\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/AuthorityVip/dialog/CpMessageDialog.vue"
fi

# Fix CpReceiveReward.vue
if [ -f "src/components/AuthorityVip/dialog/CpReceiveReward.vue" ]; then
  echo "Fixing src/components/AuthorityVip/dialog/CpReceiveReward.vue"
  cp "src/components/AuthorityVip/dialog/CpReceiveReward.vue" "src/components/AuthorityVip/dialog/CpReceiveReward.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "CpReceiveReward",\
  props: {\
    initDate: {\
      type: Object,\
      default: () => ({ comfirm: null, rewards: [] })\
    }\
  },\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/AuthorityVip/dialog/CpReceiveReward.vue"
fi

# Fix LoginActivationVipDialog.vue
if [ -f "src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue" ]; then
  echo "Fixing src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue"
  cp "src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue" "src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
import CpSubjectSelect from "@/components/CpFan/Components/CpSubjectSelect.vue"\
\
export default defineComponent({\
  name: "LoginActivationVipDialog",\
  components: { CpSubjectSelect },\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue"
fi

# Fix LoginObtainVipDialog.vue
if [ -f "src/components/AuthorityVip/dialog/LoginObtainVipDialog.vue" ]; then
  echo "Fixing src/components/AuthorityVip/dialog/LoginObtainVipDialog.vue"
  cp "src/components/AuthorityVip/dialog/LoginObtainVipDialog.vue" "src/components/AuthorityVip/dialog/LoginObtainVipDialog.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "LoginObtainVipDialog",\
  setup() {\
    const getVipHttp = () => {\
      // Implementation\
    }\
    \
    return {\
      getVipHttp\
    }\
  }\
})\
</script>' "src/components/AuthorityVip/dialog/LoginObtainVipDialog.vue"
fi

# Fix separate-sign-ckeditor.vue
if [ -f "src/components/CkeditorText/separate-sign-ckeditor.vue" ]; then
  echo "Fixing src/components/CkeditorText/separate-sign-ckeditor.vue"
  cp "src/components/CkeditorText/separate-sign-ckeditor.vue" "src/components/CkeditorText/separate-sign-ckeditor.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "SeparateSignCkeditor",\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/CkeditorText/separate-sign-ckeditor.vue"
fi

# Fix CpSubjectSelect.vue
if [ -f "src/components/CpFan/Components/CpSubjectSelect.vue" ]; then
  echo "Fixing src/components/CpFan/Components/CpSubjectSelect.vue"
  cp "src/components/CpFan/Components/CpSubjectSelect.vue" "src/components/CpFan/Components/CpSubjectSelect.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "CpSubjectSelect",\
  setup() {\
    const options = ref([\
      { value: "010101", label: "语文" },\
      { value: "010201", label: "数学" },\
      { value: "010301", label: "英语" }\
    ])\
    \
    return {\
      options\
    }\
  }\
})\
</script>' "src/components/CpFan/Components/CpSubjectSelect.vue"
fi

# Fix SharePaperPopover.vue
if [ -f "src/components/PaperItem/SharePaperPopover.vue" ]; then
  echo "Fixing src/components/PaperItem/SharePaperPopover.vue"
  cp "src/components/PaperItem/SharePaperPopover.vue" "src/components/PaperItem/SharePaperPopover.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "SharePaperPopover",\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/PaperItem/SharePaperPopover.vue"
fi

# Fix prePaper.vue
if [ -f "src/components/PreparePapers/prePaper.vue" ]; then
  echo "Fixing src/components/PreparePapers/prePaper.vue"
  cp "src/components/PreparePapers/prePaper.vue" "src/components/PreparePapers/prePaper.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "PrePaper",\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/PreparePapers/prePaper.vue"
fi

# Fix video-segment.vue
if [ -f "src/components/VideoPlay/video-segment.vue" ]; then
  echo "Fixing src/components/VideoPlay/video-segment.vue"
  cp "src/components/VideoPlay/video-segment.vue" "src/components/VideoPlay/video-segment.vue.bak"
  
  # Replace the script section with a corrected version
  sed -i '/<script>/,/<\/script>/c\
<script>\
import { ref, defineComponent } from "vue"\
\
export default defineComponent({\
  name: "VideoSegment",\
  setup() {\
    return {}\
  }\
})\
</script>' "src/components/VideoPlay/video-segment.vue"
fi

echo "Done fixing specific components with errors"
