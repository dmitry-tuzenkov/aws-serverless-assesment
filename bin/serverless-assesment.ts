#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { ServerlessAssesmentStack } from '../lib/serverless-assesment-stack';

const app = new cdk.App();

new ServerlessAssesmentStack(app, 'test-assesment-stack', {
  envName: 'test',
  description: 'Test Serverless Assesment Stack',
  tags: {
    component: 'assesment-stack',
    env: 'test',
    owner: 'company',
  },
});

new ServerlessAssesmentStack(app, 'prod-assesment-stack', {
  envName: 'prod',
  description: 'Production Serverless Assesment Stack',
  env: {
    account: process.env.AWS_PROD_ACCOUNT_ID,
    region: process.env.AWS_PROD_REGION,
  },
  tags: {
    component: 'assesment-stack',
    env: 'prod',
    owner: 'company',
  },
});

new ServerlessAssesmentStack(app, 'dev-assesment-stack', {
  envName: 'dev',
  description: 'Development Serverless Assesment Stack',
  env: {
    account: process.env.AWS_DEVEL_ACCOUNT_ID,
    region: process.env.AWS_DEVEL_REGION,
  },
  tags: {
    component: 'assesment-stack',
    env: 'dev',
    owner: 'company',
  },
});
