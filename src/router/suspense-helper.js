/**
 * Helper functions for implementing Vue 3 Suspense with skeleton components
 * This file provides examples of how to use the skeleton components with Vue's Suspense feature
 */

import { h, Suspense } from 'vue'
import IndexSkeleton from '@/components/Skeleton/IndexSkeleton.vue'
import PaperMakerSkeleton from '@/components/Skeleton/PaperMakerSkeleton.vue'
import PaperDetailSkeleton from '@/components/Skeleton/PaperDetailSkeleton.vue'

/**
 * Creates a route component with Suspense support
 * @param {Function} asyncComponent - Async component to load
 * @param {Object} skeletonComponent - Skeleton component to show while loading
 * @returns {Object} Route component configuration
 */
export function withSuspense(asyncComponent, skeletonComponent) {
  return {
    // This is the wrapper component that will be rendered by the router
    render() {
      return {
        components: {
          default: asyncComponent,
          fallback: skeletonComponent
        },
        setup() {
          return () => {
            return h(Suspense, null, {
              default: () => h(asyncComponent),
              fallback: () => h(skeletonComponent)
            })
          }
        }
      }
    }
  }
}

/**
 * Example usage in route configuration:
 * 
 * import { withSuspense } from '@/router/suspense-helper'
 * 
 * const routes = [
 *   {
 *     path: '/',
 *     name: 'home',
 *     component: withSuspense(
 *       () => import('@/views/Home.vue'),
 *       IndexSkeleton
 *     )
 *   },
 *   {
 *     path: '/paper-maker',
 *     name: 'paperMaker',
 *     component: withSuspense(
 *       () => import('@/views/PaperMaker.vue'),
 *       PaperMakerSkeleton
 *     )
 *   },
 *   {
 *     path: '/paper-detail/:id',
 *     name: 'paperDetail',
 *     component: withSuspense(
 *       () => import('@/views/PaperDetail.vue'),
 *       PaperDetailSkeleton
 *     )
 *   }
 * ]
 */

// Export skeleton components for direct use
export { IndexSkeleton, PaperMakerSkeleton, PaperDetailSkeleton }
