import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Array<{ message: string; type: string }>>([]);

  const addNotification = (message: string, type = 'info') => {
    notifications.value.push({ message, type });
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      removeNotification(notifications.value.length - 1);
    }, 3000);
  };

  const removeNotification = (index: number) => {
    notifications.value.splice(index, 1);
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
});