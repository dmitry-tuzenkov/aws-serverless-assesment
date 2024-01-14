import assert from 'node:assert/strict';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { App, AppAction, AppService, AppServiceRecord } from '../app-types';
import { INMEMORY_PEOPLE_SERVICE } from '../services/persons.service';
import { INMEMORY_EVENTS_SERVICE } from '../services/events.service';
import {
  PersonEntity,
  createAndValidatePersonEntityData,
} from '../entities/person.entity';
import {
  createHttp500ErrorResponse,
  createHttpErrorResponse,
  createHttpResponse,
} from '../utils/http-response';
import { bodyJsonParser } from '../utils/http-request';
import {
  AppEventPersonCreated,
  createPersonCreatedEvent,
} from '../entities/person-event.entity';

export const createPeopleAction: AppAction = ({
  services,
}: Pick<App, 'services'>) => {
  const personsService = services.get(
    INMEMORY_PEOPLE_SERVICE,
  ) as AppService<PersonEntity>;
  const updatesService = services.get(
    INMEMORY_EVENTS_SERVICE,
  ) as AppService<AppEventPersonCreated>;

  assert(personsService, 'persons service in not defined');
  assert(updatesService, 'events publisher service in not defined');

  return async (event: APIGatewayProxyEventV2) => {
    try {
      const payload = await createAndValidatePersonEntityData(
        bodyJsonParser(String(event.body)),
      );

      const data = await personsService.create(payload);
      await updatesService.create(createPersonCreatedEvent(payload));

      return createHttpResponse(data, 201);
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        return createHttpErrorResponse(ex);
      }

      return createHttp500ErrorResponse();
    }
  };
};
