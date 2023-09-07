import { IUser } from '../user/usuario.interface';
import { ITraining } from './training.interface';

export interface ITrainingTable {
  id?: string;
  user: IUser;
  name: string;
  description?: string;
  creationDate: Date;
  typeTraining: string;
  initDate: Date;
  endDate: Date;
  trainingDuration?: number;
  breakTime?: number;
  caloriesBurned?: number;
  observation?: string;
  listTraining?: ITraining[];
}
