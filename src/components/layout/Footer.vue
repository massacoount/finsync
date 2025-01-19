<template>
  <footer class="bg-white shadow-md fixed bottom-0 left-0 w-full flex justify-around py-3">
    <router-link to="/" class="flex flex-col items-center text-gray-500" active-class="text-blue-500 font-bold">
      <i class="fas fa-home h-6 w-6"></i>
      <span class="text-xs">Home</span>
    </router-link>
    <router-link to="/profile" class="flex flex-col items-center text-gray-500" active-class="text-blue-500 font-bold">
      <i class="fas fa-user h-6 w-6"></i>
      <span class="text-xs">Profile</span>
    </router-link>
    <router-link to="/settings" class="flex flex-col items-center text-gray-500" active-class="text-blue-500 font-bold">
      <i class="fas fa-cog h-6 w-6"></i>
      <span class="text-xs">Settings</span>
    </router-link>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
/* Add any additional styles here */
</style>