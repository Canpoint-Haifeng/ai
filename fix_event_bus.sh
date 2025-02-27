#!/bin/bash

echo "Fixing Vue 2 event bus to Vue 3 equivalent..."

# Create a new event bus implementation file if it doesn't exist
if [ ! -f "src/utils/eventBus.js" ]; then
  mkdir -p src/utils
  cat > src/utils/eventBus.js << 'EOLBUS'
import { ref } from 'vue'
import mitt from 'mitt'

const emitter = mitt()
const Bus = {
  on: (...args) => emitter.on(...args),
  once: (event, callback) => {
    const fn = (...args) => {
      emitter.off(event, fn)
      callback(...args)
    }
    emitter.on(event, fn)
  },
  off: (...args) => emitter.off(...args),
  emit: (...args) => emitter.emit(...args)
}

export default Bus
EOLBUS

  # Add mitt to package.json if not already there
  if ! grep -q '"mitt"' package.json; then
    npm install --save mitt
  fi
fi

# Update main.js to use the new event bus
if grep -q "Vue.prototype.Bus" src/main.js; then
  sed -i 's/Vue.prototype.Bus = Bus/app.config.globalProperties.Bus = Bus/g' src/main.js
fi

echo "Event bus fixed."
