import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';
import { bootsrap, createApp } from './app';
import { createHttp500ErrorResponse } from './utils/http-response';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  console.log(context.functionName);
  console.log(JSON.stringify(event));
  console.log(`${event.httpMethod} ${event.path}`);

  try {
    const dependencies = await bootsrap({
      region: String(process.env.AWS_REGION), // will be added automatically to aws lambda envs
      dynamoTable: String(process.env.DYNAMO_TABLE_NAME),
      snsTopicArn: String(process.env.SNS_TOPIC_ARN),
    });

    const app = await createApp(dependencies);
    const response = await app.resolveEvent(event);

    return response;
  } catch (error: unknown) {
    console.error('Application error:', error);
    return createHttp500ErrorResponse();
  }
}
