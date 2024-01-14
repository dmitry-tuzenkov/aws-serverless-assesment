import { createApp } from "../src/app";
import { INMEMORY_EVENTS_SERVICE } from "../src/services/events.service";
import { INMEMORY_PEOPLE_SERVICE } from "../src/services/people.service";
import {
	createPersonEntityMock,
	createPostPersonProxyEventMock,
	createUnknownProxyEventMock,
} from "./app.mock";
import { createHttp404ErrorResponse } from "../src/utils/http-response";

const createTestApp = async () => {
	const internalApp = await createApp({
		dynamoTable: "Sample_DynamoTable",
		snsTopic: "Sample_SNSTopick",
	});

	return internalApp;
};

test("Application created correctly", async () => {
	const app = await createApp({
		dynamoTable: "Sample_DynamoTable",
		snsTopic: "Sample_SNSTopick",
	});

	expect(app).toBeDefined();

	expect(app.services.has(INMEMORY_PEOPLE_SERVICE)).toBeDefined();
	expect(app.services.has(INMEMORY_EVENTS_SERVICE)).toBeDefined();

	expect(app.handlePersonCreationEvent).toBeDefined();
	expect(app.handleGetAllPersonsListEvent).toBeDefined();
});

test("Application handle person creation event correctly", async () => {
	const app = await createTestApp();
	const mockedEvent = createPostPersonProxyEventMock();
	const actualResponse = await app.handlePersonCreationEvent(mockedEvent);

	const mockedResponse = {
		statusCode: 201,
		body: createPersonEntityMock(),
	};

	expect(actualResponse).toContainEqual(mockedResponse);
});

test("Application handle get all person list event correctly", async () => {
	const app = await createTestApp();
	const mockedEvent = createPostPersonProxyEventMock();
	const actualResponse = await app.handleGetAllPersonsListEvent(mockedEvent);

	const mockedResponse = {
		statusCode: 201,
		body: [createPersonEntityMock()],
	};

	expect(actualResponse).toContainEqual(mockedResponse);
});

test("Application handle unknown event correctly", async () => {
	const app = await createTestApp();
	const mockedEvent = createUnknownProxyEventMock();
	const actualResponse = await app.handleGetAllPersonsListEvent(mockedEvent);
	const mockedResponse = createHttp404ErrorResponse(
		`GET /unknown pathname is not found`
	);

	expect(actualResponse).toContainEqual(mockedResponse);
});
