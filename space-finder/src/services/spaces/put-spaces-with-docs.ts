import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function putSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const docClient = DynamoDBDocumentClient.from(dbClient)
  
  if (!event.queryStringParameters?.id || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please provide id and body'
      })
    }
  }

  const { id } = event.queryStringParameters
  const item: { location: string } = JSON.parse(event.body)

  const result = await docClient.send(new UpdateCommand({
    TableName: process.env.TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #attributeName = :attributeValue",
    ExpressionAttributeNames: {
      '#attributeName': 'location'
    },
    ExpressionAttributeValues: {
      ":attributeValue": item.location
    },
    // ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  }))

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes)
  }  
}