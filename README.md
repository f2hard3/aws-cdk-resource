## AWS-CDK-SERVERLESS-TYPESCRIPT

### CDK commands

```
cdk init app --language typescript

cdk bootstrap

cdk synth

cdk deploy
```

```
cdk list

cdk diff

cdk destroy
```

### AWS Cognito force change password

```
aws cognito-idp admin-set-user-password --user-pool-id <user-pool-id> --username <username> --password "<password>" --permanent
```
