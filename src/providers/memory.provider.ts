import { AppDataProvider } from '../app-types';

export const MEMORY_PROVIDER_NAME = ':memory:';

export const createMemoryProvider = async <T>(): Promise<
  AppDataProvider<T>
> => {
  const storage: Map<string, T> = new Map();

  const create = async (primaryKey: string, data: T): Promise<T> => {
    storage.set(primaryKey, data);
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
