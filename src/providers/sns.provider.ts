import assert from 'assert';
import * as sns from '@aws-sdk/client-sns';
import { AppDataProvider } from '../app-types';

export const SNS_PROVIDER_NAME = ':aws-sns:';

export const createSNSProvider = async <T>(
  topicArn: string,
  region = 'eu-central-1',
): Promise<AppDataProvider<T>> => {
  const snsClient = new sns.SNSClient({ region });

  assert(topicArn, 'sns topic provider arn is not defined');

  const create = async (data: T): Promise<T> => {
    await snsClient.send(
      new sns.PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(data),
      }),
    );

    return data;
  };

  return {
    name: SNS_PROVIDER_NAME,
    create,
  };
};
