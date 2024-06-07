import { FatPercentage } from './fat-percentage.interface';
import { Weight } from './weight.interface';

export interface AnthropometricData {
  listUserWeight?: Weight[];
  listFatPercentage?: FatPercentage[];
  height?: number;
  weight?: number;
  caloriesBurned?: number;
  heartRate?: number;
}
