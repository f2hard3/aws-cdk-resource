import { Context, SNSEvent } from 'aws-lambda';

const webHookUrl = 'https://hooks.slack.com/services/yourWebHookUrl'

export async function handler(event: SNSEvent, _context: Context) {
  event.Records.forEach(async (record) => {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `Huston, we have a problem: ${record.Sns.Message}`
      })
    })
  })

}
