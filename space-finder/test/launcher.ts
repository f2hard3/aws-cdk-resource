import { handler } from '../src/services/spaces/handler';


(async () => {
  const result = await handler({
    // httpMethod: 'GET',
    // queryStringParameters: {
    //   id: '44d1e6c9-b03b-48c6-a6fa-9ef55af853e5'
    // }
    httpMethod: 'POST',
    body: JSON.stringify({
      location: 'Busan'
    })
    // httpMethod: 'PUT',
    // queryStringParameters: {
    //   id: '0cbe3b38-c9ab-4cb2-b3ce-0f5b0dd70891'
    // },
    // body: JSON.stringify({
    //   location: 'Seoul2'
    // })
    // httpMethod: 'DELETE',
    // queryStringParameters: {
    //   id: '0cbe3b38-c9ab-4cb2-b3ce-0f5b0dd70891'
    // }
  } as any, {} as any)

  console.log(result)
})()
