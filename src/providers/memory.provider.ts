import { AppDataProvider } from '../app-types';

export const MEMORY_PROVIDER_NAME = ':memory:';

export const createMemoryProvider = async <T>(): Promise<
  AppDataProvider<T>
> => {
  const storage: Map<string, T> = new Map();

  const create = async (data: T, primaryKeyName = 'id'): Promise<T> => {
    const dataObject = Object(data);
    const pkey =
      dataObject.hasOwnProperty(primaryKeyName) && dataObject[primaryKeyName];

    if (pkey) {
      throw new Error(
        `Primary key value for '${primaryKeyName}' is not present in the record`,
      );
    }

    storage.set(pkey, data);
    return data;
  };

  const findAll = async (): Promise<T[]> => {
    return Array.from(storage.values());
  };

  return {
    name: MEMORY_PROVIDER_NAME,
    create,
    findAll,
  };
};
