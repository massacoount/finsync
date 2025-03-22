import { useNotificationStore } from '@/store/notificationStore';

export function useNotifications() {
  const notificationStore = useNotificationStore();
  
  return {
    notifications: notificationStore.notifications,
    addNotification: notificationStore.addNotification,
    removeNotification: notificationStore.removeNotification
  };
}