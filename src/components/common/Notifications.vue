<template>
  <div class="fixed top-0 right-0 m-4 space-y-2">
    <div
      v-for="(notification, index) in notifications"
      :key="index"
      :class="[
        'p-4 rounded shadow',
        notification.type === 'success' ? 'bg-green-500 text-white' : '',
        notification.type === 'error' ? 'bg-red-500 text-white' : '',
        notification.type === 'info' ? 'bg-blue-500 text-white' : '',
      ]"
    >
      {{ notification.message }}
      <button @click="removeNotification(index)" class="ml-2 text-white">x</button>
    </div>
  </div>
</template>

<script>
import { useNotifications } from '@/composables/useNotifications';

export default {
  setup() {
    const { notifications, removeNotification } = useNotifications();

    return { notifications, removeNotification };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>