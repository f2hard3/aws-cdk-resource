import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const docClient = DynamoDBDocumentClient.from(dbClient)

  if (event.queryStringParameters?.id) {
    const { id } = event.queryStringParameters

    const result = await docClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id }
    }))

    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Space with id ${id} not found`
      })
    }
  } else {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }))

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
  }    
}