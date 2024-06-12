import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { getSpaces } from '../../../src/services/spaces/get-spaces'

describe('Get spaces test suite', () => {
  const someItems = {
    Items: [{
      id: {
        S: '123'
      },
      location: {
        S: 'Paris'
      }
    }]
  }

  const someItem = {
    Item: {
      id: {
        S: '123'
      },
      location: {
        S: 'Paris'
      }
    }
  }
  const dbClientMock = { send: jest.fn() } as any

  afterEach(() => { jest.clearAllMocks() })

  it('should return spaces if no queryStringParameters', async () => {
    dbClientMock.send.mockReturnValueOnce(someItems)
    const getResult = await getSpaces({} as any, dbClientMock)
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify([{
        id: '123',
        location: 'Paris'
      }])
    }
    expect(getResult).toEqual(expectedResult)
  })

  it('should return 200 if queryStringParameters with id exists', async () => {
    dbClientMock.send.mockReturnValueOnce(someItem)
    const getResult = await getSpaces({
      queryStringParameters: {
        id: '123'
      }
    } as any, dbClientMock)
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({
        id: '123',
        location: 'Paris'
      })
    }
    expect(getResult).toEqual(expectedResult)
    expect(dbClientMock.send).toHaveBeenCalledWith(expect.any(GetItemCommand))
    const getItemCommandInput = dbClientMock.send.mock.calls[0][0].input
    expect(getItemCommandInput.TableName).toBeUndefined()
    expect(getItemCommandInput.Key).toEqual({ id: { S: '123'} })
  })
})