import type { RouteRecordRaw } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import Dashboard from '@/pages/dashboard/Dashboard.vue';
import AddExpense from '@/components/finance/AddExpense.vue';
import AddIncome from '@/components/finance/AddIncome.vue';
import BudgetTarget from '@/components/finance/BudgetTarget.vue';
import BankImport from '@/components/finance/BankImport.vue';
import AddAccount from '@/components/finance/AddAccount.vue';
import AddTransaction from '@/pages/finance/AddTransaction.vue';
import Settings from '@/pages/dashboard/Settings.vue';
import Profile from '@/pages/dashboard/Profile.vue';

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'add-expense', component: AddExpense },
      { path: 'add-income', component: AddIncome },
      { path: 'budget-target', component: BudgetTarget },
      { path: 'bank-import', component: BankImport },
      { path: 'add-account', component: AddAccount },
      { path: 'add-transaction', component: AddTransaction },
      { path: 'settings', component: Settings },
      { path: 'profile', component: Profile },
    ],
  },
];

export default dashboardRoutes;