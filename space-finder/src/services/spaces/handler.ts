import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './post-spaces-with-docs';
import { getSpaces } from './get-spaces-with-docs';
import { putSpaces } from './put-spaces-with-docs';
import { deleteSpaces } from './delete-spaces-with-docs';
import { JSONError, MissingFieldError } from '../shared/validator';
import { addCorsHeader } from '../shared/utils';
import { captureAWSv3Client, getSegment } from 'aws-xray-sdk-core';

const dbClient = captureAWSv3Client(new DynamoDBClient())

export async function handler(
  event: APIGatewayProxyEvent, 
  _context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult

  const subSeg1 = getSegment().addNewSubsegment('LongCall')
  await new Promise(resolve => setTimeout(resolve, 3000))
  subSeg1.close()

  const subSeg2 = getSegment().addNewSubsegment('LongCall')
  await new Promise(resolve => setTimeout(resolve, 500))
  subSeg2.close()

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getSpaces(event, dbClient)
        break
      case 'POST':
        response = await postSpaces(event, dbClient)
        break
      case 'PUT':
        response = await putSpaces(event, dbClient)
        break
      case 'DELETE':
        response = await deleteSpaces(event, dbClient)
        break
      default:
        break
    }
  } catch(error: unknown) {
    if (error instanceof MissingFieldError || error instanceof JSONError) {
      console.error(error)

      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }
    if (error instanceof Error) {
      console.error(error)

      return {
        statusCode: 500,
        body: JSON.stringify(error.message)
      }
    }
  }

  addCorsHeader(response)
  return response
}