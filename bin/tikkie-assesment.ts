#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TikkieAssesmentStack } from '../lib/tikkie-assesment-stack';

const app = new cdk.App();
new TikkieAssesmentStack(app, 'TikkieAssesmentStack');
