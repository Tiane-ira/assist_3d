import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'hash',
    routes: [
        {
            // 路由
            path: '/',
            // 路由组件
            component: () => import('@/views/layout/index.vue'),
        },
        {
            path: '/convert',
            component: () => import('@/views/convert/index.vue'),
        },
    ]
})