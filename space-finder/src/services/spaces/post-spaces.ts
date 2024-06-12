import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

export async function postSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const id = v4()
  
  let item: { location: string }
  if (event.body) {
    item = JSON.parse(event.body)
  } else {
    throw new Error('Body does not exist')
  }

  await dbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall({ ...item, id })
  }))

  return {
    statusCode: 201,
    body: JSON.stringify({ id })
  }
}