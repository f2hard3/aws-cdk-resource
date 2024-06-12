import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';

export class CdkCiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new CodePipeline(this, 'CiCdPipeline', {
      pipelineName: 'CiCdPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('f2hard3/aws-cdk-resource', 'cicd-practice'),
        commands: [
          'cd cdk-ci-cd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk-ci-cd/cdk.out'
      })
    })

    const stage = pipeline.addStage(new PipelineStage(this, 'PipelineStage', {
      stageName: 'pipelineStage'
    }))

    stage.addPre(new CodeBuildStep('unit-test', {
      commands: [
        'cd cdk-ci-cd',
        'npm ci',
        'npm test'
      ]
    }))
  }
} 
