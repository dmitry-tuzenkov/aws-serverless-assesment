import 'dotenv/config';

import type { APIGatewayProxyEvent } from 'aws-lambda';
import { bootsrap, createApp } from './app';
import {
  AppHttpResponse,
  createHttp500ErrorResponse,
} from './utils/http-response';
import {
  createGetAllPersonsListProxyEventMock,
  createPersonEntityMock,
  createPostPersonProxyEventMock,
} from '../test/app.mock';
import { AppOptions } from './app-types';

async function main(event: APIGatewayProxyEvent): Promise<AppHttpResponse> {
  console.log(`${event.httpMethod} ${event.path}`);

  try {
    const options: AppOptions = {
      region: String(process.env.AWS_REGION), // will be added automatically to aws lambda envs
      dynamoTable: String(process.env.DYNAMO_TABLE_NAME),
      snsTopicArn: String(process.env.SNS_TOPIC_ARN),
    };

    console.log('AppOptions', options);

    const dependencies = await bootsrap(options);

    const app = await createApp(dependencies);
    const response = await app.resolveEvent(event);

    return response;
  } catch (error: unknown) {
    console.error('Application error:', error);
    return createHttp500ErrorResponse();
  }
}

main(createPostPersonProxyEventMock(createPersonEntityMock()))
  .then((response: AppHttpResponse) => console.debug('Got Resonse', response))
  .then(() => main(createGetAllPersonsListProxyEventMock()))
  .then((response: AppHttpResponse) => console.debug('Got Resonse', response));
