import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Departments from './pages/Departments.vue';
import Employees from './pages/Employees.vue';

import './style.css';

const routes = [
  {
    path: '/',
    redirect: '/departments',
  },
  {
    path: '/departments',
    component: Departments,
  },
  {
    path: '/employees',
    component: Employees,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');