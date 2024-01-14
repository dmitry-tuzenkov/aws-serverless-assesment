import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
	Context,
} from "aws-lambda";
import { createApp } from "./app";
import {
	createHttp404ErrorResponse,
	createHttp500ErrorResponse,
	createHttpErrorResponse,
} from "./utils/http-response";

export async function handler(
	event: APIGatewayProxyEventV2,
	context: Context
): Promise<APIGatewayProxyResultV2> {
	console.log(context.functionName);
	console.log(`${event.requestContext.http.method} ${event.rawPath}`);

	try {
		const httpAction = `${event.requestContext.http.method} ${event.rawPath}`;

		const app = await createApp({
			dynamoTable: String(process.env.AWS_DYNAMO_DB_TABLE_NAME),
			snsTopic: String(process.env.AWS_SNS_TOPIC_NAME),
		});

		switch (httpAction) {
			case "POST /persons":
				return await app.handlePersonCreationEvent(event);

			case "GET /persons":
				return await app.handleGetAllPersonsListEvent(event);

			default:
				return createHttp404ErrorResponse(
					`${httpAction} pathname is not found`
				);
		}
	} catch (error: unknown) {
		console.error("Application error:", error);
		return createHttp500ErrorResponse();
	}
}
