/**
 * Resource routes module
 */

export default [
  {
    path: 'resource/upload',
    name: 'resourceUpload',
    component: () => import('@/views/resource-upload/index.vue')
  }
]
