import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { AppHttpResponse } from './utils/http-response';

export enum APP_EVENT {
  PERSON_CREATED = 'person-created',
}
export interface AppEvent<T> {
  name: APP_EVENT;
  payload: T;
  metadata: {
    createdAt: number;
  };
}

export interface AppOptions {
  dynamoTable: string;
  snsTopic: string;
}

export interface AppService<T> {
  create: (data: T) => Promise<T>;
  findAll: () => Promise<T[]>;
}

export interface AppServiceRecord {
  id?: string;
  createdAt?: string;
}

export interface AppDataProvider<T> {
  name: string;
  create: (primaryKey: string, data: T) => Promise<T>;
  findAll?: () => Promise<T[]>;
}

export type AppActionHandler = (
  event: APIGatewayProxyEventV2,
) => Promise<AppHttpResponse>;

export type AppAction = (options: Pick<App, 'services'>) => AppActionHandler;

export interface App {
  services: Map<string, AppService<any>>;
  actions: Map<string, AppActionHandler>;

  resolveEvent: (event: APIGatewayProxyEventV2) => Promise<AppHttpResponse>;
}
