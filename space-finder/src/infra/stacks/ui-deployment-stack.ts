import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';


export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)

    const deploymentBucket = new Bucket(this, 'UIDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`
    })

    const uiDir = join('..', 'space-finder-frontend', 'dist')
    if (!existsSync(uiDir)) {
      console.warn('UI directory not found:', uiDir)
      return
    }

    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)]
    })

    const originIdentity = new OriginAccessIdentity(this, 'originAccessIdentity')
    deploymentBucket.grantRead(originIdentity)

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity
        })
      }
    })

    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName
    })
  }


}