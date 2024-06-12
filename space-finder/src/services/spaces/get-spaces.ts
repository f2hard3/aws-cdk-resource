import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(
  event: APIGatewayProxyEvent, 
  dbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.id) {
    const { id } = event.queryStringParameters

    const result = await dbClient.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: {
          S: id
        }
      }
    }))

    if (result.Item) {
      const unmarshalledItem = unmarshall(result.Item)
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshalledItem)
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Space with id not found'
      })
    }
  } else {
    const result = await dbClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }))
    const unmarshalledItems = result.Items?.map(item => unmarshall(item))

    return {
      statusCode: 200,
      body: JSON.stringify(unmarshalledItems)
    }
  }    
}