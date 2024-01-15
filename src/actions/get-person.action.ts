import assert from 'node:assert/strict';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { App, AppAction, AppService } from '../app-types';
import { PERSONS_SERVICE } from '../services/persons.service';
import { PersonEntity } from '../entities/person.entity';
import {
  createHttp500ErrorResponse,
  createHttpErrorResponse,
  createHttpResponse,
} from '../utils/http-response';

import { createPersonListEntity } from '../entities/person-list.entity';

export const getPersonAction: AppAction = ({
  services,
}: Pick<App, 'services'>) => {
  const personsService = services.get(
    PERSONS_SERVICE,
  ) as AppService<PersonEntity>;

  assert(personsService, 'persons service in not defined');

  return async (event: APIGatewayProxyEventV2) => {
    try {
      const records = await personsService.findAll();
      const listEntity = createPersonListEntity({
        skip: 0,
        count: records.length,
        data: records,
      });

      return createHttpResponse(listEntity);
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        return createHttpErrorResponse(ex);
      }

      return createHttp500ErrorResponse();
    }
  };
};
