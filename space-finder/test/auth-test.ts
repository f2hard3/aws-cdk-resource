import { type CognitoUser } from '@aws-amplify/auth'
import { Auth, Amplify } from 'aws-amplify'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'

const awsRegion = 'us-west-2'
const identityPoolId = 'us-west-2:f269f6bc-fca7-47a4-aa71-38a34a8a5dee'

Amplify.configure({
  Auth: {
    region:  awsRegion,
    userPoolId: 'us-west-2_HOxLiJjCG',
    userPoolWebClientId: '282v93c8fuksgpqjv8b072r6a',
    identityPoolId: identityPoolId,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
})

class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser

    return result
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession()!.getIdToken()!.getJwtToken()
    const cognitoUserPoolId = `cognito-idp.${awsRegion}.amazonaws.com/us-west-2_HOxLiJjCG`
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId,
        logins: {
          [cognitoUserPoolId]: jwtToken
        }
      })
    })    
    const credentials = await cognitoIdentity.config.credentials()

    return credentials
  }
}

async function testAuth() {
  const service = new AuthService()
  const loginResult = await service.login(
    'SunggonPark',
    'acProxima9254@@'
  )
  
  const credentials = await service.generateTemporaryCredentials(loginResult)
  console.log(loginResult.getSignInUserSession()?.getIdToken().getJwtToken())
  const buckets = await listBuckets(credentials)
  console.log(buckets)
}

async function listBuckets(credentials: any) {
  // const client = new S3Client({ credentials })
  const client = new S3Client()
  const command = new ListBucketsCommand()
  const result = await client.send(command)

  return result
}

testAuth()