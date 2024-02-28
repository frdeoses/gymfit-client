import { User } from '../user/usuario.interface';
import { Training } from './training.interface';

export interface TrainingTable {
  id?: string;
  // user: User;
  userId: string;
  name: string;
  description?: string;
  creationDate: Date;
  lastUpdateDate?: Date;
  typeTraining: string;
  initDate: Date;
  endDate: Date;
  trainingDuration?: number;
  breakTime?: number;
  caloriesBurned?: number;
  observation?: string;
  listTraining?: Training[];
}
