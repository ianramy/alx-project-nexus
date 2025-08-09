// src/components/notifications/NotificationToast.tsx

export const NotificationToast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-900 p-4 shadow-lg">
    <p>{message}</p>
  </div>
);
