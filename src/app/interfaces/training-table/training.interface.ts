import { User } from '../user/usuario.interface';
import { GymMachine } from './gymMachine.interface';
import { WorkedWeights } from './workedWeights.interface';

export interface Training {
  id: string;
  name: string;
  typeTraining?: string;
  numRepetitions?: number;
  numSeries?: number;
  exercisedArea?: string;
  needBeSupervised?: boolean;
  description?: string;
  like?: number;
  // user: User;
  userId: string;
  listWorkedWeights?: WorkedWeights[];
  caloriesBurned?: number;
  gymMachine?: GymMachine;
  creationDate: Date;
  lastUpdateDate: Date;
}
