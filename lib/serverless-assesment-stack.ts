import path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class ServerlessAssesmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const personsTable = new dynamodb.Table(this, 'PersonsDynamoDbTable', {
      partitionKey: { name: 'personId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'personsTable',
    });

    const snsTopic = new sns.Topic(this, 'PersonsSnsTopic', {
      topicName: 'PersonsSnsTopic',
    });

    const lambdaFunction = new lambda.Function(this, 'PersonsLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../src/')),
      environment: {
        DYNAMO_TABLE_NAME: personsTable.tableName,
        SNS_TOPIC_ARN: snsTopic.topicArn,
      },
    });

    personsTable.grantReadWriteData(lambdaFunction);

    snsTopic.addSubscription(new subs.LambdaSubscription(lambdaFunction));

    const api = new apigateway.RestApi(this, 'PersonsRestApiGateway');
    const personsResource = api.root.addResource('persons');

    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    personsResource.addMethod('GET', lambdaIntegration);
    personsResource.addMethod('POST', lambdaIntegration);

    new cdk.CfnOutput(this, 'PersonsTableName', {
      value: personsTable.tableName,
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
    });
  }
}
