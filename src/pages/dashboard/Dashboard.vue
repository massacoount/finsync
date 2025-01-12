<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card">
        <h2 class="text-xl font-semibold">Total Income</h2>
        <p class="text-3xl">{{ totalIncome }}</p>
      </div>
      <div class="card">
        <h2 class="text-xl font-semibold">Total Expenses</h2>
        <p class="text-3xl">{{ totalExpenses }}</p>
      </div>
      <div class="card">
        <h2 class="text-xl font-semibold">Remaining Balance</h2>
        <p class="text-3xl">{{ remainingBalance }}</p>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Budget Targets Comparison</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="target in budgetTargets" :key="target.id" class="card">
          <h3 class="text-lg font-semibold">{{ target.category }}</h3>
          <p>Target: {{ target.monthlyTarget }}</p>
          <p>Actual: {{ target.actualSpending }}</p>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Spending by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="category in spendingByCategory" :key="category.id" class="card">
          <h3 class="text-lg font-semibold">{{ category.name }}</h3>
          <p>{{ category.amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      remainingBalance: 0,
      budgetTargets: [
        // Example data
        { id: 1, category: 'Food', monthlyTarget: 500, actualSpending: 450 },
        { id: 2, category: 'Rent', monthlyTarget: 1000, actualSpending: 1000 },
      ],
      spendingByCategory: [
        // Example data
        { id: 1, name: 'Food', amount: 450 },
        { id: 2, name: 'Rent', amount: 1000 },
      ],
    };
  },
  mounted() {
    // Fetch data from the backend and update the state
    this.fetchDashboardData();
  },
  methods: {
    fetchDashboardData() {
      // Replace with actual API calls
      this.totalIncome = 3000;
      this.totalExpenses = 2000;
      this.remainingBalance = this.totalIncome - this.totalExpenses;
      // Fetch budget targets and spending by category from the backend
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>