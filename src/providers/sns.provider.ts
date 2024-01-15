import assert from 'assert';
import { AppDataProvider } from '../app-types';

export const SNS_PROVIDER_NAME = ':aws-sns:';

export const createSNSProvider = async <T>(
  topicName: string,
): Promise<AppDataProvider<T>> => {
  const storage: Map<string, T> = new Map();

  assert(topicName, 'sns topic provider name is not defined');

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
    name: SNS_PROVIDER_NAME,
    create,
    findAll,
  };
};
