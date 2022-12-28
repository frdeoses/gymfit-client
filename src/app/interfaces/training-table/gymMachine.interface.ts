import { IWorkedWeights } from './workedWeights.interface';

export interface IGymMachine {
  id: string;
  name?: string;
  exercisedArea?: string;
  description?: string;
  like: number;
}
