import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createPeopleAction } from './actions/create-person.action';
import { App, AppActionHandler, AppOptions, AppServicesMap } from './app-types';
import {
  EVENTS_SERVICE,
  PersonEventEntityAppServiceRecord,
  createEventsService,
} from './services/events.service';
import {
  PERSONS_SERVICE,
  createPersonsService,
} from './services/persons.service';
import {
  AppHttpResponse,
  createHttp404ErrorResponse,
} from './utils/http-response';
import { getPersonAction } from './actions/get-person.action';
import { createPersonsDynamoProvider } from './providers/persons-dynamo.provider';
import { createSNSProvider } from './providers/sns.provider';

const createAppEventResolver =
  ({ actions }: Pick<App, 'actions'>) =>
  async (event: APIGatewayProxyEventV2): Promise<AppHttpResponse> => {
    const httpAction = `${event.requestContext.http.method} ${event.rawPath}`;

    const action = actions.get(httpAction);

    if (action) {
      return await action(event);
    }

    return createHttp404ErrorResponse(`${httpAction} pathname is not found`);
  };

export const bootsrap = async (
  options: AppOptions,
): Promise<{ services: AppServicesMap }> => {
  const services: AppServicesMap = new Map();

  const personDynamoProvider = await createPersonsDynamoProvider(
    options.dynamoTable,
    options.region,
  );

  const dynamoPersonsService = await createPersonsService(personDynamoProvider);
  services.set(PERSONS_SERVICE, dynamoPersonsService);

  const eventNotificationProvider =
    await createSNSProvider<PersonEventEntityAppServiceRecord>(
      options.snsTopicArn,
      options.region,
    );

  const eventsNotificationService = await createEventsService(
    eventNotificationProvider,
  );

  services.set(EVENTS_SERVICE, eventsNotificationService);

  return { services };
};

export const createApp = async (dependencies: {
  services: AppServicesMap;
}): Promise<App> => {
  const { services } = dependencies;
  const actions: Map<string, AppActionHandler> = new Map();

  actions.set('POST /persons', createPeopleAction({ services }));
  actions.set('GET /persons', getPersonAction({ services }));

  const resolveEvent = createAppEventResolver({ actions });

  return { services, actions, resolveEvent };
};
