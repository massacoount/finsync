<template>
  <div class="dashboard">
    <Header />
    <Sidebar />
    <main class="p-4">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Footer from '@/components/layout/Footer.vue';

export default {
  name: 'DashboardLayout',
  components: {
    Header,
    Sidebar,
    Footer
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>