import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AppHttpResponse } from "./utils/http-response";

export interface AppEvent<T> {
	name: string;
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
}

export interface AppDataProvider<T> {
	name: string;
	create: (primaryKey: string, data: T) => Promise<T>;
	findAll?: () => Promise<T[]>;
}

export interface App {
	services: Map<string, AppService<any>>;

	handlePersonCreationEvent: (
		event: APIGatewayProxyEventV2
	) => Promise<AppHttpResponse>;

	handleGetAllPersonsListEvent: (
		event: APIGatewayProxyEventV2
	) => Promise<AppHttpResponse>;

	// TODO: Implement
	// handleUpdateEvent: (event: AppEvent) => Promise<void>;
}
