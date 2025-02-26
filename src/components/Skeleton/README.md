# Skeleton Components for Vue 3 Suspense

This directory contains skeleton components that can be used with Vue 3's Suspense feature to provide loading states while async components are being loaded.

## Available Components

- `IndexSkeleton.vue`: Skeleton for the main index/home page
- `PaperMakerSkeleton.vue`: Skeleton for the paper maker page
- `PaperDetailSkeleton.vue`: Skeleton for the paper detail page

## Usage with Vue Router and Suspense

These components are designed to be used with Vue Router and Suspense. Here's how to use them:

### Basic Usage

```javascript
// In your router configuration
import { withSuspense } from '@/router/suspense-helper'
import { IndexSkeleton } from '@/components/Skeleton'

const routes = [
  {
    path: '/',
    name: 'home',
    component: withSuspense(
      () => import('@/views/Home.vue'),
      IndexSkeleton
    )
  }
]
```

### Direct Usage in Components

You can also use these components directly in your templates with Suspense:

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <IndexSkeleton />
    </template>
  </Suspense>
</template>

<script>
import { defineComponent } from 'vue'
import { IndexSkeleton } from '@/components/Skeleton'
import AsyncComponent from './AsyncComponent.vue'

export default defineComponent({
  components: {
    AsyncComponent,
    IndexSkeleton
  }
})
</script>
```

## Benefits Over vue-skeleton-webpack-plugin

These client-side skeleton components offer several advantages over the webpack plugin approach:

1. They work natively with Vue 3 and Vite
2. They're more flexible and can be used anywhere in your application
3. They're easier to maintain and update
4. They don't require special webpack configuration
5. They can be customized per-route or per-component
