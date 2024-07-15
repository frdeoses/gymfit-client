export interface Notification {
  id: string;
  title: string;
  description?: string;
  date: Date;
  read: boolean;
  page: string;
}
