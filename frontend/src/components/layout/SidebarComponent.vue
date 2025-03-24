<template>
  <div>
    <!-- Overlay for Sidebar -->
    <div class="fixed inset-0 bg-black bg-opacity-50 hidden z-40" id="overlay"></div>

    <!-- Sidebar Navigation -->
    <div class="fixed inset-y-0 left-0 bg-white shadow-lg w-64 p-4 z-50 transform -translate-x-full transition-transform duration-300 flex flex-col justify-between" id="sidebar">
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button id="closeSidebar" class="text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <nav class="space-y-4">
          <!-- <router-link to="/" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </router-link>
          <router-link to="/add-expense" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-money-bill-wave"></i>
            <span>Add Expense</span>
          </router-link>
          <router-link to="/add-income" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-dollar-sign"></i>
            <span>Add Income</span>
          </router-link>
          <router-link to="/budget-target" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-bullseye"></i>
            <span>Budget Target</span>
          </router-link>
          <router-link to="/bank-import" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-file-import"></i>
            <span>Bank Import</span>
          </router-link>
          <router-link to="/add-account" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-university"></i>
            <span>Add Account</span>
          </router-link>-->
          <router-link to="/add-transaction" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-exchange-alt"></i>
            <span>Add Transaction</span>
          </router-link>
          <!-- <router-link to="/profile" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </router-link>
          <router-link to="/settings" class="flex items-center space-x-3 text-gray-500 hover:bg-blue-100 p-2" active-class="text-blue-500 font-bold">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </router-link>-->
        </nav>
      </div>
      <div class="mt-auto">
        <button @click="logout" class="w-full flex items-center justify-center space-x-3 text-red-500 hover:bg-red-100 p-2">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$router.push('/auth/login');
    }
  },
  mounted() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (openSidebar) {
      openSidebar.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      });
    }

    if (closeSidebar) {
      closeSidebar.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });
    }
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>