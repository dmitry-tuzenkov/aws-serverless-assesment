import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { PersonEntity } from '../src/entities/person.entity';
import { AppServicesMap } from '../src/app-types';
import { createMemoryProvider } from '../src/providers/memory.provider';
import {
  PERSONS_SERVICE,
  PersonEntityAppServiceRecord,
  createPersonsService,
} from '../src/services/persons.service';
import {
  EVENTS_SERVICE,
  PersonEventEntityAppServiceRecord,
  createEventsService,
} from '../src/services/events.service';

export const inMemoryBootstap = async (): Promise<{
  services: AppServicesMap;
}> => {
  const services: AppServicesMap = new Map();

  const personsInMemoryProvider =
    await createMemoryProvider<PersonEntityAppServiceRecord>();
  const personsService = await createPersonsService(personsInMemoryProvider);

  services.set(PERSONS_SERVICE, personsService);

  const eventNotificationProvider =
    await createMemoryProvider<PersonEventEntityAppServiceRecord>();

  const eventsNotificationService = await createEventsService(
    eventNotificationProvider,
  );

  services.set(EVENTS_SERVICE, eventsNotificationService);
  return { services };
};

export const createPersonEntityMock = (): PersonEntity => ({
  firstName: 'Dmitry',
  lastName: 'Tuzenkov',
  phone: '020000001',
  address: {
    city: 'Amsterdam',
    country: 'Netherlands',
    houseNumber: '2-1020',
    postCode: '1083HJ',
    street: 'De Boolelaan',
  },
});

export const createPersonEntityInvalidMock = (): PersonEntity => ({
  ...createPersonEntityMock(),
  firstName: '',
  lastName: '',
  phone: '',
});

export const createPostPersonProxyEventMock = (
  data: object,
): APIGatewayProxyEventV2 => {
  return {
    requestContext: {
      http: {
        method: 'POST',
      },
    },
    rawPath: '/persons',
    rawQueryString: '',
    body: JSON.stringify(data),
  } as APIGatewayProxyEventV2;
};

export const createGetAllPersonsListProxyEventMock =
  (): APIGatewayProxyEventV2 => {
    return {
      requestContext: {
        http: {
          method: 'GET',
        },
      },
      rawPath: '/persons',
      rawQueryString: '',
      body: '',
    } as APIGatewayProxyEventV2;
  };

export const createUnknownProxyEventMock = (): APIGatewayProxyEventV2 => {
  return {
    requestContext: {
      http: {
        method: 'GET',
      },
    },
    rawPath: '/unknown',
    rawQueryString: '',
    body: '',
  } as APIGatewayProxyEventV2;
};
