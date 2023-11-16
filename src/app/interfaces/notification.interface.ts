export interface INotification {
  id: string;
  title: string;
  description?: string;
  date: Date;
  read: boolean;
  page: string;
}
