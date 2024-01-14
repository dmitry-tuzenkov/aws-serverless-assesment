import { createApp } from '../src/app';
import { INMEMORY_EVENTS_SERVICE } from '../src/services/events.service';
import { INMEMORY_PEOPLE_SERVICE } from '../src/services/persons.service';
import {
  createGetAllPersonsListProxyEventMock,
  createPersonEntityInvalidMock,
  createPersonEntityMock,
  createPostPersonProxyEventMock,
  createUnknownProxyEventMock,
} from './app.mock';
import {
  createHttp404ErrorResponse,
  createHttpErrorResponse,
} from '../src/utils/http-response';

const createTestApp = async () => {
  const internalApp = await createApp({
    dynamoTable: 'Sample_DynamoTable',
    snsTopic: 'Sample_SNSTopic',
  });

  return internalApp;
};

test('Application created correctly', async () => {
  const app = await createApp({
    dynamoTable: 'Sample_DynamoTable',
    snsTopic: 'Sample_SNSTopick',
  });

  expect(app).toBeDefined();

  expect(app.services.has(INMEMORY_PEOPLE_SERVICE)).toBeDefined();
  expect(app.services.has(INMEMORY_EVENTS_SERVICE)).toBeDefined();

  expect(app.actions.has('GET /persons')).toBeDefined();
  expect(app.actions.has('POST /persons')).toBeDefined();
});

test('Application handle person creation event correctly', async () => {
  const app = await createTestApp();
  const mockedEvent = createPostPersonProxyEventMock(createPersonEntityMock());
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = {
    statusCode: 201,
    body: createPersonEntityMock(),
  };

  expect(actualResponse).toContainEqual(mockedResponse);
});

test('Application handle person creation event and fails with validation errors', async () => {
  const app = await createTestApp();
  const mockedEvent = createPostPersonProxyEventMock(
    createPersonEntityInvalidMock(),
  );
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = createHttpErrorResponse(
    [new Error(''), new Error(''), new Error('')],
    400,
  );

  expect(actualResponse).toContainEqual(mockedResponse);
});

test('Application handle get all person list event correctly', async () => {
  const app = await createTestApp();
  const mockedEvent = createGetAllPersonsListProxyEventMock();
  const actualResponse = await app.resolveEvent(mockedEvent);

  const mockedResponse = {
    statusCode: 201,
    body: [createPersonEntityMock()],
  };

  expect(actualResponse).toContainEqual(mockedResponse);
});

test('Application handle unknown event correctly', async () => {
  const app = await createTestApp();
  const mockedEvent = createUnknownProxyEventMock();
  const actualResponse = await app.resolveEvent(mockedEvent);
  const mockedResponse = createHttp404ErrorResponse(
    `GET /unknown pathname is not found`,
  );

  expect(actualResponse).toContainEqual(mockedResponse);
});
