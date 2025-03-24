import type { RouteRecordRaw } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DashboardPage from '@/pages/dashboard/DashboardPage.vue';
import TransactionAddPage from '@/pages/finance/transactions/TransactionAddPage.vue';
import SettingsPage from '@/pages/dashboard/SettingsPage.vue';
import ProfilePage from '@/pages/dashboard/ProfilePage.vue';
import { authGuard } from '@/router/guards/auth.guard';

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: DashboardPage },
      { path: 'add-transaction', component: TransactionAddPage },
      { path: 'settings', component: SettingsPage },
      { path: 'profile', component: ProfilePage },
    ],
  },
];

export default dashboardRoutes;