import { ref } from 'vue';

export function useNotifications() {
  const notifications = ref([]);

  const addNotification = (message, type = 'info') => {
    notifications.value.push({ message, type });
  };

  const removeNotification = (index) => {
    notifications.value.splice(index, 1);
  };

  return { notifications, addNotification, removeNotification };
}