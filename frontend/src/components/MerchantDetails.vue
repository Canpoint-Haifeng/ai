<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const merchantData = {
  id: '568',
  name: 'open ai',
  creator: '初中wxy(1424025451)',
  createTime: '2019-12-02 12:56:15',
  modelCount: '2',
  notes: '--'
}
</script>

<template>
  <div class="bg-white p-6 shadow-sm">
    <div class="flex items-center mb-6">
      <h1 class="text-xl font-medium">厂商详情 (open ai)</h1>
      <button class="ml-4 px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center">
        <ArrowLeftIcon class="w-4 h-4 mr-1" />
        返回
      </button>
    </div>
    
    <div class="border-t pt-4">
      <h2 class="text-lg font-medium mb-4">厂商基本信息</h2>
      <div class="flex items-start">
        <div class="w-16 h-16 bg-purple-100 rounded-lg mr-8 flex items-center justify-center">
          <svg class="w-12 h-12 text-purple-600" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
        <div class="grid grid-cols-3 gap-4 flex-1">
          <div>
            <span class="text-gray-500">厂商ID：</span>
            <span>{{ merchantData.id }}</span>
          </div>
          <div>
            <span class="text-gray-500">厂商名称：</span>
            <span>{{ merchantData.name }}</span>
          </div>
          <div>
            <span class="text-gray-500">模型数量：</span>
            <span>{{ merchantData.modelCount }}</span>
          </div>
          <div>
            <span class="text-gray-500">创建人：</span>
            <span>{{ merchantData.creator }}</span>
          </div>
          <div>
            <span class="text-gray-500">创建时间：</span>
            <span>{{ merchantData.createTime }}</span>
          </div>
          <div>
            <span class="text-gray-500">备注：</span>
            <span>{{ merchantData.notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
