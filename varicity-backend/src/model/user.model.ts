import { VaricityConfig, Vector3 } from './config.model';
import { JsonInputInterface } from './jsonInput.interface';

export enum UserType {
  EXPERT = 'EXPERT',
  NEWCOMER = 'NEWCOMER',
}

export class Project {
  projectName: string;
  index?: number;
  id?: string;
  configs?: VaricityConfig[];
  visualizationData?: JsonInputInterface;
}

export class CityViewConfig {
  index?: number;
  authorIndex?: number;
  userType: UserType;
  username: string;
  timestamp: Date;
  projectName: string;
  cameraPosition: Vector3;
}

export class User {
  constructor(n: string, u: UserType) {
    this.userType = u;
    this.username = n;
  }

  id?: string;
  index?: number;
  userType: UserType;
  username: string;
}