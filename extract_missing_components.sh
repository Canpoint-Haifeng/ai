#!/bin/bash

# Create the necessary directories
mkdir -p src/components/Backtop

# Extract all components from the src.zip file
unzip -j ~/attachments/23f993ef-a4ad-4230-a7fb-0a3d452a5908/src.zip "src/components/Backtop/CpVipLoginActivity.vue" -d src/components/Backtop/

# Check if the extraction was successful
if [ -f src/components/Backtop/CpVipLoginActivity.vue ]; then
  echo "Successfully extracted CpVipLoginActivity.vue"
else
  echo "Failed to extract CpVipLoginActivity.vue"
  
  # Create the component if it doesn't exist in the src.zip file
  cat > src/components/Backtop/CpVipLoginActivity.vue << 'EOC'
<template>
  <div class="cp-vip-login-activity">
    <div class="activity-content" v-if="showActivity">
      <div class="activity-header">
        <h3>{{ title }}</h3>
        <span class="close-btn" @click="closeActivity">×</span>
      </div>
      <div class="activity-body">
        <slot></slot>
      </div>
      <div class="activity-footer">
        <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
        <el-button @click="closeActivity">{{ cancelText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CpVipLoginActivity',
  props: {
    title: {
      type: String,
      default: '会员活动'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showActivity: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeActivity() {
      this.$emit('update:showActivity', false)
    },
    handleConfirm() {
      this.$emit('confirm')
      this.closeActivity()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-vip-login-activity {
  .activity-content {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }
      
      .close-btn {
        font-size: 20px;
        color: #909399;
        cursor: pointer;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
    
    .activity-body {
      margin-bottom: 20px;
    }
    
    .activity-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
EOC
  echo "Created CpVipLoginActivity.vue component"
fi

echo "Finished extracting missing components"
