<template>
  <div class="dashboard">
    <HeaderComponent />
    <SidebarComponent />
    <main class="p-4">
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import Header from '@/components/layout/HeaderComponent.vue';
import Sidebar from '@/components/layout/SidebarComponent.vue';
import Footer from '@/components/layout/FooterComponent.vue';

export default {
  name: 'DashboardLayout',
  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  }
};
</script>