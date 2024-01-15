import assert from 'node:assert/strict';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { App, AppAction, AppService, AppServiceRecord } from '../app-types';
import {
  PERSONS_SERVICE,
  PersonEntityAppServiceRecord,
} from '../services/persons.service';
import { EVENTS_SERVICE } from '../services/events.service';
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
import { createPersonEntityDto } from '../dto/create-person.dto';

export const createPeopleAction: AppAction = ({
  services,
}: Pick<App, 'services'>) => {
  const personsService = services.get(
    PERSONS_SERVICE,
  ) as AppService<PersonEntityAppServiceRecord>;
  // const updatesService = services.get(
  //   INMEMORY_EVENTS_SERVICE,
  // ) as AppService<AppEventPersonCreated>;

  assert(personsService, 'persons service in not defined');
  // assert(updatesService, 'events publisher service in not defined');

  return async (event: APIGatewayProxyEventV2) => {
    try {
      const payload = await createPersonEntityDto(
        bodyJsonParser<PersonEntity>(String(event.body)),
      );

      const data = await personsService.create(payload);
      // await updatesService.create(createPersonCreatedEvent(payload));

      return createHttpResponse(data, 201);
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        return createHttpErrorResponse(ex);
      }

      return createHttp500ErrorResponse();
    }
  };
};
