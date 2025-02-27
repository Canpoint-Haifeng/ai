const ResourceUpload = () => import(/* webpackChunkName: "resourceUpload" */ './index.vue')

export default [
  {
    path: 'resource/upload',
    name: 'resourceUpload',
    component: ResourceUpload
  }
]
