import { v4 } from 'uuid'
import { JSONError } from './validator'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export function createRandomId() {
  return v4()
}

export function parseJSON(json: string) {
  try {
    return JSON.parse(json)
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new JSONError(error.message)
    }
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent): boolean {
  const groups: unknown = event.requestContext.authorizer?.claims['cognito:groups']

  if (typeof groups === 'string') {
    return groups.includes('admins')
  }

  return false
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) arg.headers = {}

  arg.headers['Access-Control-Allow-Origin'] = '*'
  arg.headers['Access-Control-Allow-Methods'] = '*'
}