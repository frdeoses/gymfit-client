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
  description?: string;
  like?: number;
  user: IUser;
  listWorkedWeights?: IWorkedWeights[];
  gymMachine?: IGymMachine;
  creationDate: Date;
  lastUpdateDate: Date;
}
