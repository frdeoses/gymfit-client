import { IFatPercentage } from "./fatPercentage.interface";
import { IWeight } from "./weight.interface";

export interface IUser {

    id?: string;
    userName: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthDate: Date;
    registrationDate?: Date;
    height?: number;
    listUserWeight?: IWeight [];
    listFatPercentage?: IFatPercentage [];

}