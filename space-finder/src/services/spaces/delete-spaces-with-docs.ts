import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hasAdminGroup } from '../shared/utils';

export async function deleteSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Not Authorized' })
    }
  }

  const docClient = DynamoDBDocumentClient.from(dbClient)
  
  if (!event.queryStringParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please provide id'
      })
    }
  }

  const { id } = event.queryStringParameters

  const result = await docClient.send(new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: { id }
  }))

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }  
}