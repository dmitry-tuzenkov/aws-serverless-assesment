import { bootsrap, createApp } from '../src/app';
import { EVENTS_SERVICE } from '../src/services/events.service';
import { PERSONS_SERVICE } from '../src/services/persons.service';
import {
  createHttp404ErrorResponse,
  createHttpErrorResponse,
  createHttpResponse,
} from '../src/utils/http-response';
import { createPersonListEntity } from '../src/entities/person-list.entity';
import {
  createGetAllPersonsListProxyEventMock,
  createPersonEntityInvalidMock,
  createPersonEntityMock,
  createPostPersonProxyEventMock,
  createUnknownProxyEventMock,
  inMemoryBootstap,
} from './app.mock';

export const createTestApp = async () => {
  const dependencies = await inMemoryBootstap();
  const internalApp = await createApp(dependencies);

  return internalApp;
};

test('Application created correctly', async () => {
  const dependencies = await bootsrap({
    dynamoTable: 'personsTable',
    snsTopicArn: 'personsTopicARN',
    region: 'eu-central-eu',
  });

  const app = await createApp(dependencies);

  expect(app).toBeDefined();

  expect(app.services.has(PERSONS_SERVICE)).toBeDefined();
  expect(app.services.has(EVENTS_SERVICE)).toBeDefined();

  expect(app.actions.has('GET /persons')).toBeDefined();
  expect(app.actions.has('POST /persons')).toBeDefined();
});

test('Application handle person creation event correctly', async () => {
  const app = await createTestApp();
  const mockedEvent = createPostPersonProxyEventMock(createPersonEntityMock());
  const actualResponse = await app.resolveEvent(mockedEvent);
  const mockedResponse = createHttpResponse(createPersonEntityMock(), 201);

  expect(actualResponse).toEqual(mockedResponse);
});

test('Application handle person creation event and fails with validation errors', async () => {
  const app = await createTestApp();
  const mockedEvent = createPostPersonProxyEventMock(
    createPersonEntityInvalidMock(),
  );
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = createHttpErrorResponse(
    [
      {
        name: 'ValidationError',
        message: 'phone is a required field',
      } as Error,
    ],
    400,
  );

  expect(actualResponse).toEqual(mockedResponse);
});

test('Application handle get all person list event correctly as empty', async () => {
  const app = await createTestApp();
  const mockedEvent = createGetAllPersonsListProxyEventMock();
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = createHttpResponse(
    createPersonListEntity({ skip: 0, count: 0, data: [] }),
    200,
  );

  expect(actualResponse).toEqual(mockedResponse);
});

test('Application handle get all person list event correctly as one record', async () => {
  const app = await createTestApp();
  const mockedEvent = createGetAllPersonsListProxyEventMock();
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = createHttpResponse(
    createPersonListEntity({
      skip: 0,
      count: 0,
      data: [createPersonEntityMock()],
    }),
    200,
  );

  expect(actualResponse).toEqual(mockedResponse);
});

test('Application handle unknown event correctly', async () => {
  const app = await createTestApp();
  const mockedEvent = createUnknownProxyEventMock();
  const actualResponse = await app.resolveEvent(mockedEvent);
  const mockedResponse = createHttp404ErrorResponse(
    `GET /unknown pathname is not found`,
  );

  expect(actualResponse).toEqual(mockedResponse);
});
