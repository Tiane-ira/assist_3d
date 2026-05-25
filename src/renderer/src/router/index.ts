import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue')
    },
    {
      path: '/convert',
      component: () => import('@/views/convert/index.vue')
    },
    {
      path: '/tableShow',
      component: () => import('@/views/tableShow/index.vue')
    }
  ]
})
