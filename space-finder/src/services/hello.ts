import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const s3Client = new S3Client()

export async function handler(event: APIGatewayProxyEvent, _context: Context) {
  const command = new ListBucketsCommand()
  const listBucketsResults = (await s3Client.send(command)).Buckets
  
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(
      'Hello from lambda, here are your buckets:' + 
      JSON.stringify(listBucketsResults)
    )
  }

  console.log(event)

  return response
}