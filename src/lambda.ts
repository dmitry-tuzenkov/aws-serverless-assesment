import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';
import { createApp } from './app';
import { createHttp500ErrorResponse } from './utils/http-response';

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  console.log(context.functionName);
  console.log(`${event.requestContext.http.method} ${event.rawPath}`);

  try {
    const app = await createApp({
      dynamoTable: String(process.env.AWS_DYNAMO_DB_TABLE_NAME),
      snsTopic: String(process.env.AWS_SNS_TOPIC_NAME),
    });
    const response = await app.resolveEvent(event);

    return response;
  } catch (error: unknown) {
    console.error('Application error:', error);
    return createHttp500ErrorResponse();
  }
}
