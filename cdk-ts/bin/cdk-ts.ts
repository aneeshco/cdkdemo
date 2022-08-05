#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkServerlessStack } from '../lib/cdk-ts-stack';

const app = new cdk.App();
new CdkServerlessStack(app, 'CdkServerlessStack',{
   stackName: 'cdk-serverless-stack',
   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
