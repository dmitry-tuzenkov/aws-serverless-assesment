import { AppEvent } from "../app-types";
import { PersonEntity } from "./person.entity";

export type AppEventPersonCreated = AppEvent<PersonEntity>;

export const APP_EVENT_PERSON_CREATED = "person-created";

export const createPersonCreatedEvent = (
	payload: PersonEntity
): AppEventPersonCreated => ({
	name: APP_EVENT_PERSON_CREATED,
	payload,
	metadata: { createdAt: Date.now() },
});
