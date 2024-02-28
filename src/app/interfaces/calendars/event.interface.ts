import { Comment } from './comment.interface';

export interface Event {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  lastUpdateDate?: Date;
  creationDate?: Date;
  comments?: Comment[];
}
