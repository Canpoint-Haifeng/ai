<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import MerchantDetails from './components/MerchantDetails.vue'
import ModelList from './components/ModelList.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-6">
      <MerchantDetails />
      <ModelList />
    </main>
  </div>
</template>
