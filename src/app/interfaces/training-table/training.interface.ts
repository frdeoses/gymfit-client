import { IUser } from '../user/usuario.interface';
import { IGymMachine } from './gymMachine.interface';
import { IWorkedWeights } from './workedWeights.interface';

export interface ITraining {
  id: string;
  name: string;
  typeTraining?: string;
  numRepetitions?: number;
  numSeries?: number;
  exercisedArea?: string;
  needBeSupervised?: boolean;
  description?: string;
  like?: number;
  user: IUser;
  listWorkedWeights?: IWorkedWeights[];
  caloriesBurned?: number;
  gymMachine?: IGymMachine;
  creationDate: Date;
  lastUpdateDate: Date;
}
