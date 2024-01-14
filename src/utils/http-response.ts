import { APIGatewayProxyResultV2 } from "aws-lambda";

export type AppHttpResponse = APIGatewayProxyResultV2<object>;

export const createHttpResponse = (
	data: object,
	statusCode = 200
): AppHttpResponse => ({
	statusCode,
	headers: { "content-type": "application/json" },
	body: JSON.stringify(data, null, 2),
});

export const createHttpErrorResponse = (
	errors: Error | Error[],
	statusCode = 400
): AppHttpResponse =>
	createHttpResponse(
		{
			errors: (Array.isArray(errors) ? errors : [errors]).map((error) => ({
				name: error.name,
				message: error.message,
			})),
		},
		statusCode
	);

export const createHttp500ErrorResponse = (): AppHttpResponse =>
	createHttpErrorResponse([new Error("An unknown error has occured")], 500);

export const createHttp404ErrorResponse = (message: string): AppHttpResponse =>
	createHttpErrorResponse([new Error(message)], 404);
