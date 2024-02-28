import { Authority } from '../security/authority.interface';
import { Rol } from '../security/rol.interface';
import { FatPercentage } from './fatPercentage.interface';
import { Weight } from './weight.interface';

export interface User {
  id?: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: Date;
  registrationDate?: Date;
  height?: number;
  weight?: number;
  caloriesBurned?: number;
  heartRate?: number;
  enabled?: boolean;
  authorities: Authority[];
  userRoles?: Rol[];
  listUserWeight?: Weight[];
  listFatPercentage?: FatPercentage[];
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}
