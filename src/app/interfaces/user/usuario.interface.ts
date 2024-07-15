import { Authority } from '../security/authority.interface';
import { Rol } from '../security/rol.interface';
import { AnthropometricData } from './anthropometric-data.interface';
import { PersonalData } from './personal-data.interface';

export interface User {
  id?: string;
  username: string;
  personalData: PersonalData;
  registrationDate?: Date;
  enabled?: boolean;
  authorities: Authority[];
  anthropometricData: AnthropometricData;
}
