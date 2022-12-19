import { IGymMachine } from './gymMachine.interface';
import { IWorkedWeights } from './workedWeights.interface';

export interface ITraining {
  id?: string;
  typeTraining?: string;
  numRepetitions?: number;
  numSeries?: number;
  exercisedArea?: string;
  explication?: string;
  like?: number;
  listWorkedWeights?: IWorkedWeights[];
  gymMachine?: IGymMachine;
}
