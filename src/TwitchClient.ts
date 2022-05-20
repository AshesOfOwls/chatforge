import tmi from 'tmi.js';
import copypasta from './copypasta_renage';

const ACTIVE_CHANNEL = 'renagetv';

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
    if(self) return;

    if(message.toLowerCase().match(/who[']?s the best/gi)) {
      const random = Math.round(Math.random() * copypasta.length);

      client.say(channel, copypasta[random]);
      client.say(ACTIVE_CHANNEL, 'hi im a bot')
    }
  });
}

export default main;
