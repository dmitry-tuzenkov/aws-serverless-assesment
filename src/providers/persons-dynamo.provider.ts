import assert from 'assert';
import * as dynamodb from '@aws-sdk/client-dynamodb';
import { AppDataProvider } from '../app-types';
import { PersonEntityAppServiceRecord } from '../services/persons.service';

export const DYNAMO_PROVIDER_NAME = ':aws-dynamodb-persons-table:';

export const createPersonsDynamoProvider = async (
  tableName: string,
  region = 'eu-central-1',
): Promise<AppDataProvider<PersonEntityAppServiceRecord>> => {
  const client = new dynamodb.DynamoDBClient({ region });

  assert(tableName, 'dynamo db provider table name is not defined');

  const create = async (
    data: PersonEntityAppServiceRecord,
  ): Promise<PersonEntityAppServiceRecord> => {
    try {
      assert(data.id, 'primary key is not defined');
      const command = new dynamodb.PutItemCommand({
        TableName: tableName,
        Item: {
          personId: { S: String(data.id) },
          createdAt: { S: String(data.createdAt) },
          firstName: { S: data.firstName },
          lastName: { S: data.lastName },
          phone: { S: data.phone },
          address: {
            M: {
              street: { S: data.address.street },
              houseNumber: { S: data.address.houseNumber },
              postCode: { S: data.address.postCode },
              city: { S: data.address.city },
              country: { S: data.address.country },
            },
          },
        },
      });
      await client.send(command);
      console.debug('DynamoDbPersonsCreated');
    } catch (error) {
      console.error('Error creating person record:', error);
      throw new Error('Failed to create a person');
    }

    return data;
  };

  const findAll = async (): Promise<PersonEntityAppServiceRecord[]> => {
    try {
      const command = new dynamodb.ScanCommand({
        TableName: tableName,
        Limit: 20,
      });

      const result = await client.send(command);
      console.debug('DynamoDbPersonsResult', JSON.stringify(result));

      if (!result.Count) {
        return [];
      }

      const persons = result.Items?.map((item) => {
        return {
          id: item?.personId.S,
          firstName: item?.firstName.S,
          lastName: item?.lastName.S,
          phone: item?.phone.S,
          address: {
            street: item?.address?.M?.street.S,
            houseNumber: item?.address?.M?.houseNumber.S,
            postCode: item?.address?.M?.postCode.S,
            city: item?.address?.M?.city.S,
            country: item?.address?.M?.country.S,
          },
          createdAt: item?.createdAt.S,
        };
      });

      return persons as PersonEntityAppServiceRecord[];
    } catch (error) {
      console.error('Error creating person record:', error);
      throw new Error('Failed to retreive a person');
    }

    return [];
  };

  return {
    name: DYNAMO_PROVIDER_NAME,
    create,
    findAll,
  };
};
