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

<script lang="ts">
import HeaderComponent from '@/components/layout/HeaderComponent.vue';
import SidebarComponent from '@/components/layout/SidebarComponent.vue';
import FooterComponent from '@/components/layout/FooterComponent.vue';

export default {
  name: 'DashboardLayout',
  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  }
};
</script>