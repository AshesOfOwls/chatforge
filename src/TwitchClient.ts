import tmi from 'tmi.js';
import copypasta from './copypasta';

const ACTIVE_CHANNEL = 'm60_';

const connectToTwitch = async () => {
  console.log('wtf', process.env.REACT_APP_USERNAME)
  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_OAUTH
    },
    channels: [ACTIVE_CHANNEL]
  });
  
  await client.connect();

  return client;
};

async function main() {
  const client = await connectToTwitch();

  listenToMessages(client);
}

const listenToMessages = (client: any) => {
  client.on('message', (channel: string, tags: Record<string, string>, message: string, self: boolean) => {
    console.log('message', message)
    // Ignore echoed messages.
    if(self) return;

    console.log('ok', message)
    if(message.toLowerCase() === 'copypasta me') {
      const random = Math.round(Math.random() * copypasta.length);
      // "@alca, heya!"
      client.say(channel, copypasta[random]);
    }
  });

  client.say(ACTIVE_CHANNEL, 'hi')
}

export default main;
