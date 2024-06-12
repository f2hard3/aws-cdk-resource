import { handler } from '../../../src/services/monitor/handler'

describe('Monitor lambda', () => {
  let fetchMock: jest.Mock
  beforeAll(() => {
    fetchMock = jest.fn(() => Promise.resolve()) as jest.Mock;
    global.fetch = fetchMock
  })
  afterEach(() => {
    // fetchMock.mockClear()
    jest.clearAllMocks()
  })

  it('makes requests for records in SnsEvents', async () => {
    await handler({
      Records: [{
        Sns: {
          Message: 'test message'
        }
      }]
    } as any, {} as any)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      body: JSON.stringify({
        text: 'Huston, we have a problem: test message'
      })
    })
  })

  it('makes requests without records', async () => {
    await handler({
      Records: []
    } as any, {} as any)

    expect(fetchMock).not.toHaveBeenCalled()
  })
})