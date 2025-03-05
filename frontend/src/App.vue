<template>
  <div>
    <router-view />
    <Notifications />
  </div>
</template>

<script>
import Notifications from '@/components/common/Notifications.vue';

export default {
  components: {
    Notifications,
  },
};
</script>