<template>
  <div>
    <router-view />
    <NotificationAlert />
  </div>
</template>

<script>
import NotificationAlert from '@/components/common/NotificationAlert.vue';

export default {
  components: {
    NotificationAlert,
  },
};
</script>