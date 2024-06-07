import { GymMachine } from './gym-machine.interface';
import { WorkedWeight } from './worked-weight.interface';

export interface TrainingDto {
  id: string;
  name: string;
  typeTraining?: string;
  numRepetitions?: number;
  numSeries?: number;
  exercisedArea?: string;
  needBeSupervised?: boolean;
  description?: string;
  like?: number;
  userId: string;
  listWorkedWeights?: WorkedWeight[];
  caloriesBurned?: number;
  gymMachine?: GymMachine;
}
