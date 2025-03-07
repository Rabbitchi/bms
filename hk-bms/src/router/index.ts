import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Layout from '@/views/Layout.vue';
import SalesOverview from '@/views/SalesOverview.vue';
import OrderManagement from '@/views/OrderManagement.vue';
import EmployeeManagement from '@/views/EmployeeManagement.vue';
import CustomerManagement from '@/views/CustomerManagement.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/layout', component: Layout,
    children: [
      { path: 'sales-overview', component: SalesOverview },
      { path: 'order-management', component: OrderManagement },
      { path: 'employee-management', component: EmployeeManagement },
      { path: 'customer-management', component: CustomerManagement },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
