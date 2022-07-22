import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkTsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mylayer = new lambda.LayerVersion(this, 'MyLayer', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset('layer'),
      compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
      description: "Testing lambda layer with cdk",
      layerVersionName: "myDemoLayer"
    });
    
    // Defines an AWS Lambda resource
    const my_lambda = new lambda.Function(this,'HelloHandler',{
      runtime: lambda.Runtime.PYTHON_3_7,
      functionName: 'cdk-ts',
      code: lambda.Code.fromAsset('lambda'),
      description: 'Testing typescript lambda',
      environment: {'LOG_LEVEL': 'INFO'},
      layers: [mylayer],
      handler: 'hello.handler'
    });
    
    // used to make sure each CDK synthesis produces a different version
    const version = my_lambda.currentVersion;
    const alias = new lambda.Alias(this, 'LambdaAlias', {
      aliasName: 'Prod',
      version,
    });
    
    //Output of created resource
    new cdk.CfnOutput(this, 'cdk-output',{
                       value: my_lambda.functionName});
  }
}
