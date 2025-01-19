<template>
  <div>
    <header class="bg-blue-500 text-white p-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Finsync</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
};
</script>

<style scoped>
/* Add any additional styles here */
</style>