// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type IBingo = {
  numbers: number[];
};
export type IGame = {
  numbers: number[];
};

export interface IUser {
  id: any;
  createdAt: number;
  email: any;
  hash: string;
  salt: string;
  password?: any;
}
