import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/dashboard/Dashboard.vue';
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;// Vue Router configuration