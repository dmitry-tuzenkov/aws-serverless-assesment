import { APP_EVENT, AppEvent } from '../app-types';
import { PersonEntity } from './person.entity';

export type AppEventPersonCreated = AppEvent<PersonEntity>;

export const createPersonCreatedEvent = (
  payload: PersonEntity,
): AppEventPersonCreated => ({
  name: APP_EVENT.PERSON_CREATED,
  payload,
  metadata: { createdAt: Date.now() },
});
