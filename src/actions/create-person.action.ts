import assert from 'node:assert/strict';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import { App, AppAction, AppService } from '../app-types';
import {
  PERSONS_SERVICE,
  PersonEntityAppServiceRecord,
} from '../services/persons.service';
import { EVENTS_SERVICE } from '../services/events.service';
import { PersonEntity } from '../entities/person.entity';
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
import { createPersonEntityDto } from '../dto/create-person.dto';

export const createPeopleAction: AppAction = ({
  services,
}: Pick<App, 'services'>) => {
  const personsService = services.get(
    PERSONS_SERVICE,
  ) as AppService<PersonEntityAppServiceRecord>;
  const eventUpdatesService = services.get(
    EVENTS_SERVICE,
  ) as AppService<AppEventPersonCreated>;

  assert(personsService, 'persons service in not defined');
  assert(eventUpdatesService, 'events publisher service in not defined');

  return async (event: APIGatewayProxyEvent) => {
    try {
      const payload = await createPersonEntityDto(
        bodyJsonParser<PersonEntity>(String(event.body)),
      );

      const data = await personsService.create({
        ...payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      });

      await eventUpdatesService.create(createPersonCreatedEvent(payload));

      return createHttpResponse(data, 201);
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        return createHttpErrorResponse(ex);
      }

      return createHttp500ErrorResponse();
    }
  };
};
