<script setup lang="ts">
interface Model {
  id: string;
  name: string;
  isAI: boolean;
  accessPoint: string;
  inputTypes: string[];
  outputTypes: string[];
  createTime: string;
}

const models: Model[] = [
  {
    id: '25',
    name: 'gpt-3.5',
    isAI: true,
    accessPoint: '--',
    inputTypes: ['文本', '图片'],
    outputTypes: ['文本', '图片', '音频', '视频'],
    createTime: '2020-07-10 13:20:10'
  },
  {
    id: '11',
    name: 'gpt-3.5',
    isAI: false,
    accessPoint: '--',
    inputTypes: ['图片'],
    outputTypes: ['图片'],
    createTime: '2020-07-10 13:20:10'
  }
]
</script>

<template>
  <div class="bg-white mt-6 p-6 shadow-sm">
    <h2 class="text-lg font-medium mb-4">模型列表</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模型</th>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">接入点</th>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">输入类型</th>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">输出类型</th>
            <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="model in models" :key="model.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ model.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-sm text-gray-900">{{ model.name }}</span>
                <span v-if="model.isAI" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  AI
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ model.accessPoint }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ model.inputTypes.join('; ') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ model.outputTypes.join('; ') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ model.createTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
