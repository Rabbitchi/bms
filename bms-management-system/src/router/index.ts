// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Boards from '../views/Boards.vue';
import Login from '../views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login', // 默认重定向到登录页面
  },
  {
    path: '/login',
    component: Login, // 登录页面
  },
  {
    path: '/boards',
    component: Boards, // Boards 页面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;