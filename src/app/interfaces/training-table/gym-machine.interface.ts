export interface GymMachine {
  id: string;
  name: string;
  model: string;
  numMachine: number;
  exercisedArea?: string;
  description?: string;
  like: number;
  creationDate?: Date;
  lastUpdateDate?: Date;
}
