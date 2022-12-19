import { IComment } from './comment.interface';

export interface IEvent {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  comments?: IComment[];
}
