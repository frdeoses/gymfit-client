import { IAuthority } from '../security/authority.interface';
import { IRol } from '../security/rol.interface';
import { IFatPercentage } from './fatPercentage.interface';
import { IWeight } from './weight.interface';

export interface IUser {
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
  authorities: IAuthority[];
  userRoles?: IRol[];
  listUserWeight?: IWeight[];
  listFatPercentage?: IFatPercentage[];
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}
