import { IAuthority } from '../security/authority.interface';
import { IRol } from '../security/rol.interface';
import { IFatPercentage } from './fatPercentage.interface';
import { IWeight } from './weight.interface';

export interface IUser {
  id?: string;
  username: string;
  password: string;
  // userRols: String[];
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: Date;
  registrationDate?: Date;
  height?: number;
  weight?: number;
  enabled?: boolean;
  authorities: IAuthority[];
  userRols?: IRol[];
  listUserWeight?: IWeight[];
  listFatPercentage?: IFatPercentage[];
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}
