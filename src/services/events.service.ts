import {
  AppDataProvider,
  AppEvent,
  AppService,
  AppServiceRecord,
} from '../app-types';
import { AppEventPersonCreated } from '../entities/person-event.entity';
import { PersonEntity } from '../entities/person.entity';
export interface PersonEventEntityAppServiceRecord
  extends AppEvent<PersonEntity>,
    AppServiceRecord {}

export const EVENTS_SERVICE = 'events_service';

export const createEventsService = async (
  dataProvider: AppDataProvider<PersonEventEntityAppServiceRecord>,
): Promise<AppService<PersonEventEntityAppServiceRecord>> => {
  const create = async (data: PersonEventEntityAppServiceRecord) => {
    const record = await dataProvider.create(data, '');
    return record;
  };

  const findAll = async () => {
    throw new Error('Events service findAll method is not implemented');
  };

  return { create, findAll };
};
