import path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

import { Construct } from 'constructs';

interface CustomStackProps extends cdk.StackProps {
  envName?: string;
}

export class ServerlessAssesmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const { envName } = props;

    const personsTable = new dynamodb.Table(
      this,
      `${envName}-persons-dynamodb-table`,
      {
        partitionKey: { name: 'personId', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        tableName: 'personsTable',
      },
    );

    const snsTopic = new sns.Topic(this, `${envName}-persons-sns-topic`, {
      topicName: 'persons-sns-topic',
    });

    const lambdaFunction = new lambda.Function(
      this,
      `${envName}-persons-lambda`,
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambda.handler',
        code: lambda.Code.fromAsset(path.resolve(__dirname, '../dist/src/')),
        environment: {
          DYNAMO_TABLE_NAME: personsTable.tableName,
          SNS_TOPIC_ARN: snsTopic.topicArn,
        },
      },
    );

    personsTable.grantReadWriteData(lambdaFunction);

    snsTopic.addSubscription(new subs.LambdaSubscription(lambdaFunction));

    const api = new apigateway.RestApi(this, `${envName}-persons-api-gw`);
    const personsResource = api.root.addResource('persons');

    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    personsResource.addMethod('GET', lambdaIntegration);
    personsResource.addMethod('POST', lambdaIntegration);

    // CloudWatch Alarm for Non-200 HTTP Status Codes
    const httpStatusAlarm = api
      .metricClientError({
        statistic: 'sum',
        period: cdk.Duration.minutes(5),
      })

      .createAlarm(this, `${envName}-persons-api-gw-non200status-alarm`, {
        evaluationPeriods: 5,
        alarmName: `${envName}-persons-api-gw-non200status-alarm`,
        actionsEnabled: true,
        alarmDescription:
          'Alarm when non-200 HTTP status codes are encountered for 5 minutes',
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        threshold: 1,
      });

    new cdk.CfnOutput(this, `${envName}-persons-table-name`, {
      value: personsTable.tableName,
    });

    new cdk.CfnOutput(this, `${envName}-persons-api-gw-url`, {
      value: api.url,
    });

    new cdk.CfnOutput(
      this,
      `${envName}-persons-api-gw-non200status-alarm-arn`,
      {
        value: httpStatusAlarm.alarmArn,
      },
    );
  }
}
