import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class CdkCiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new CodePipeline(this, 'CiCdPipeline', {
      pipelineName: 'CiCdPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('f2hard3/aws-cdk-resource')
      })
    })
  }
}
