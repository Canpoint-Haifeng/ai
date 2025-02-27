#!/bin/bash

echo "Fixing Vue.filter to global filters..."

# Create a filters.js file if it doesn't exist
mkdir -p src/filters
if [ ! -f "src/filters/index.js" ]; then
  cat > src/filters/index.js << 'EOLFIL'
// Filters
import dayjs from 'dayjs'

export function dateBig(val) {
  if (!val) return ''
  return dayjs(val).format('YYYY-MM-DD')
}

export function dateStrBig(val) {
  if (!val) return ''
  return dayjs(val).format('YYYY年MM月DD日')
}

export function datetime(val) {
  if (!val) return ''
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}

export function currency(val) {
  if (!val) return '0.00'
  return parseFloat(val).toFixed(2)
}

export function phoneCut(val) {
  if (!val) return ''
  return val.substr(0, 3) + '****' + val.substr(7)
}

export function emilCut(val) {
  if (!val) return ''
  const index = val.indexOf('@')
  if (index > 0) {
    return val.substr(0, 3) + '****' + val.substr(index)
  }
  return val
}

export function simplifiedChinese(val) {
  if (!val) return ''
  return val
}

export function arrJoin(val) {
  if (!val) return ''
  return val.join(',')
}

export function optionTag(val) {
  const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return options[val]
}

export function smallTopicTag(val) {
  const options = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
  return options[val]
}

export function tinyTopicTag(val) {
  const options = ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)', '(12)', '(13)', '(14)', '(15)', '(16)', '(17)', '(18)', '(19)', '(20)']
  return options[val]
}

export function isEmptyObject(val) {
  return Object.keys(val).length === 0
}

export function formatUserName(val) {
  if (!val) return ''
  if (val.length <= 1) return val
  if (val.length === 2) return val.substr(0, 1) + '*'
  return val.substr(0, 1) + '*'.repeat(val.length - 2) + val.substr(-1)
}

// Create a Vue plugin for global filters
export default {
  install(app) {
    app.config.globalProperties.$filters = {
      dateBig,
      dateStrBig,
      datetime,
      currency,
      phoneCut,
      emilCut,
      simplifiedChinese,
      arrJoin,
      optionTag,
      smallTopicTag,
      tinyTopicTag,
      isEmptyObject,
      formatUserName
    }
  }
}
EOLFIL
fi

# Update main.js to use the filters
if grep -q "import filter from '@/common/js/filter'" src/main.js; then
  sed -i 's/import filter from .@\/common\/js\/filter./import filters from "@\/filters"/g' src/main.js
  sed -i 's/filter(Vue)/app.use(filters)/g' src/main.js
fi

# Update templates to use the new filter syntax
find src -name "*.vue" -type f | xargs grep -l "| " | while read -r file; do
  echo "Processing file: $file"
  
  # Replace {{ value | filter }} with {{ $filters.filter(value) }}
  sed -i 's/{{ \([^|]*\) | \([a-zA-Z0-9]*\) }}/{{ $filters.\2(\1) }}/g' "$file"
  sed -i 's/v-bind:[^=]*="{{ \([^|]*\) | \([a-zA-Z0-9]*\) }}"/v-bind:[^=]*="{{ $filters.\2(\1) }}"/g' "$file"
done

echo "Vue.filter fixed."
