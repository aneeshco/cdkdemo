import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkServerlessStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mylayer = new lambda.LayerVersion(this, 'MyLayer', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset('layer'),
      compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
      description: "Testing lambda layer with cdk",
      layerVersionName: "cdkLayer"
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
    // const v1 = my_lambda.currentVersion;
    const v1Lambda = new lambda.Version(this,'lambda-v1', {
      lambda: my_lambda
    });
    
    const v1alias = new lambda.Alias(this, 'Lambda-v1Alias', {
      aliasName: 'v1',
      version: v1Lambda,
    });
    
    // create Rest api
    const api = new apigateway.RestApi(this,'greeting-api');
    const v1Resource = api.root.addResource('v1');
    const v1Greeting = v1Resource.addResource('greeting');
    v1Greeting.addMethod('GET', new apigateway.LambdaIntegration(v1alias));
    
     
    const v2Resource = api.root.addResource('v2');
    const v2Greeting = v2Resource.addResource('greeting');
    v2Greeting.addMethod('GET', new apigateway.LambdaIntegration(my_lambda));
    
    
    
    //Output of created resource
    new cdk.CfnOutput(this, 'lambda-function-name',{
                       value: my_lambda.functionName});
    new cdk.CfnOutput(this, 'api-gateway-url', {
      value: api.url
    })
  }
}
