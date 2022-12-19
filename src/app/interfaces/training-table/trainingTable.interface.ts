import { ITraining } from './training.interface';

export interface ITrainingTable {
  id?: string;
  idUser: string;
  name: string;
  description?: string;
  creationDate: Date;
  typeTraining: string;
  initDate: Date;
  endDate: Date;
  trainingDuration?: number;
  breakTime?: number;
  observation?: string;
  listTraining?: ITraining[];
}
