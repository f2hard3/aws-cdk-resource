import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SpaceEntry } from '../model/model';
import { validateAsSpaceEntry } from '../shared/validator';
import { createRandomId, parseJSON } from '../shared/utils';

export async function postSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const docClient = DynamoDBDocumentClient.from(dbClient)

  const id = createRandomId() 
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please provide body'
      })
    }
  }

  const item: SpaceEntry = { ...parseJSON(event.body), id }

  validateAsSpaceEntry(item)

  await docClient.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: item
  }))


  return {
    statusCode: 201,
    body: JSON.stringify({ id })
  }
}