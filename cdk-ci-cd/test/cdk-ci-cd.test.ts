import { handler } from '../services/handler';

describe('handler test', () => {
  it('should return 200', async () => {
    const result = await handler()
    expect(result.statusCode).toBe(200)
  })
});
