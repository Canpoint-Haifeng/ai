<script setup lang="ts">
import { HomeIcon, UserIcon, CogIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const menuItems = [
  { name: '模型管理', icon: HomeIcon },
  { name: 'prompt管理', icon: DocumentTextIcon },
  { name: '场景管理', icon: UserIcon },
  { name: '系统管理', icon: CogIcon },
]
</script>

<template>
  <aside class="w-64 min-h-screen bg-gray-50 border-r border-gray-200">
    <div class="p-4">
      <h1 class="text-xl font-semibold mb-4">全品AI开放平台</h1>
      <nav>
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.name">
            <a href="#" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <component :is="item.icon" class="w-5 h-5 mr-2" />
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
