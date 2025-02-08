import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/mainPage'
  },
  {
    path:'/mainPage',
    name:'mainPage',
    component:()=>import('../views/mainPage/index.vue'),
    children:[
      {
        path: 'chat/:name',
        name: 'chat',
        component: () => import('../views/mainPage/chat/chat.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
