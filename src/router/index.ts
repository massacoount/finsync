import { createRouter, createWebHistory } from 'vue-router';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;