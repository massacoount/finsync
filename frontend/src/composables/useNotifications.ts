import { ref } from 'vue';

export function useNotifications() {
  const notifications = ref<{
    message: string; 
    type: string
  }[]>([]);

  const addNotification = (message: string, type = 'info') => {
    notifications.value.push({ message, type });
  };

  const removeNotification = (index: number) => {
    notifications.value.splice(index, 1);
  };

  return { notifications, addNotification, removeNotification };
}