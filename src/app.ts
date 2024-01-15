import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createPeopleAction } from './actions/create-person.action';
import {
  App,
  AppAction,
  AppActionHandler,
  AppEvent,
  AppOptions,
  AppService,
  AppServiceRecord,
} from './app-types';
import { AppEventPersonCreated } from './entities/person-event.entity';
import { PersonEntity } from './entities/person.entity';
import { createMemoryProvider } from './providers/memory.provider';
import {
  INMEMORY_EVENTS_SERVICE,
  createInMemoryEventsService,
} from './services/events.service';
import {
  PERSONS_SERVICE,
  PersonEntityAppServiceRecord,
  createPersonsService,
} from './services/persons.service';
import {
  AppHttpResponse,
  createHttp404ErrorResponse,
} from './utils/http-response';
import { getPersonAction } from './actions/get-person.action';

export const createApp = async (options: AppOptions): Promise<App> => {
  const actions: Map<string, AppActionHandler> = new Map();
  const services: Map<
    string,
    AppService<PersonEntityAppServiceRecord> | AppService<AppServiceRecord>
  > = new Map();

  const personInMemoryProvider =
    await createMemoryProvider<PersonEntityAppServiceRecord>();

  // options.dynamoTable
  services.set(
    PERSONS_SERVICE,
    await createPersonsService(personInMemoryProvider),
  );

  // options.snsTopic
  // services.set(
  //   INMEMORY_EVENTS_SERVICE,
  //   await createInMemoryEventsService<AppEventPersonCreated>(),
  // );

  actions.set('GET /persons', getPersonAction({ services }));
  actions.set('POST /persons', createPeopleAction({ services }));

  const resolveEvent = async (
    event: APIGatewayProxyEventV2,
  ): Promise<AppHttpResponse> => {
    const httpAction = `${event.requestContext.http.method} ${event.rawPath}`;

    const action = actions.get(httpAction);

    if (action) {
      return action(event);
    }

    return createHttp404ErrorResponse(`${httpAction} pathname is not found`);
  };

  return { services, actions, resolveEvent };
};
