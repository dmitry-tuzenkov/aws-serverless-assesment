import { AppDataProvider, AppService, AppServiceRecord } from '../app-types';
import { PersonEntity } from '../entities/person.entity';

export interface PersonEntityAppServiceRecord
  extends PersonEntity,
    AppServiceRecord {}

export const PERSONS_SERVICE = 'persons_service';

export const createPersonsService = async (
  dataProvider: AppDataProvider<PersonEntityAppServiceRecord>,
): Promise<AppService<PersonEntityAppServiceRecord>> => {
  const create = async (data: PersonEntityAppServiceRecord) => {
    const record = await dataProvider.create(data, 'id');
    return record;
  };

  const findAll = async () => {
    const records = dataProvider.findAll ? await dataProvider.findAll() : [];
    return records;
  };

  return { create, findAll };
};
