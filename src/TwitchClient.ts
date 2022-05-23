import tmi from 'tmi.js';
import copypasta from './copypasta';
import { isBefore, differenceInMinutes, differenceInSeconds, addSeconds } from 'date-fns';

const ACTIVE_CHANNEL = 'm60_';
let ACTIVE_CLIENT: any = null;

const connectToTwitch = async () => {
  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_OAUTH
    },
    channels: [ACTIVE_CHANNEL]
  });
  
  await client.connect();

  ACTIVE_CLIENT = client;

  return client;
};

async function main() {
  const client = await connectToTwitch();
  const clientStartDate = new Date();

  listenToMessages(client);

  // say('Hi');
  // 
  // sayCopypasta();
  setInterval(() => {
    const seconds = differenceInSeconds(new Date(), clientStartDate) % 60;
    const minutes = differenceInMinutes(new Date(), clientStartDate);
    console.log("Time since start", `${minutes}:${seconds}`)
  }, 1000 * 10)

  setInterval(() => {
    sayCopypasta();
  }, 1000 * 60 * 5);

  setInterval(() => {
    sayEnqueuedMessage();
  }, 1000);

  setTimeout(() => {
    // say('!play')
    // client.say('m60_', '!play')
    // client.say('m60_', 'Hi :)');
  }, 5000)
  return client;
}

const listenToMessages = (client: any) => {
  client.on('message', (channel: string, tags: Record<string, string>, message: string, self: boolean) => {
    if(self) return;

    const sender = tags['display-name'];

    if(message.toLowerCase().match(/LUL/gi)) {
      enqueueMessage('LUL');
    }

    if(message.toLowerCase().match(/Clap/gi)) {
      enqueueMessage('Clap');
    }

    if(message.toLowerCase().match(/poggies/gi)) {
      enqueueMessage('POGGIES');
    }

    if(message.toLowerCase().match(/PepeHands/gi)) {
      enqueueMessage('PepeHands');
    }

    if(message.toLowerCase().match(/!raid/gi)) {
      enqueueMessage('!raid');
    }

    if(message.toLowerCase().match(/channybee/gi)) {
      say(`Omg hi @${sender}!`);
    }
  });
}

type TQueuedMessage = {
  message: string,
  time: Date,
}

const previousMessages: TQueuedMessage[] = [];
const queuedMessages: TQueuedMessage[] = [];

const isMessageRecent = (message: string) => {
  const recentSameMessage = previousMessages.find((pm) => pm.message === message);

  if (!recentSameMessage) return false;
  
  const timeDifference = differenceInSeconds(new Date(), recentSameMessage.time);

  return timeDifference < 30;
};

const enqueueMessage = (message: string) => {
  if (queuedMessages.find((qm) => qm.message === message)) {
    return;
  }

  if (isMessageRecent(message)) {
    console.log("EXIT CAUSE OF PREVIOUS MESSAGE")
    return;
  }

  const queueDelay = queuedMessages.length * .7;
  const randomDelay = (Math.random() * 3) + 1.5 + queueDelay;
  queuedMessages.push({
    message,
    time: addSeconds(new Date(), randomDelay),
  });
}

const sayEnqueuedMessage = () => {
  const messageIndex = queuedMessages.findIndex((qm) => isBefore(qm.time, new Date()));

  if (messageIndex >= 0) {
    const message = queuedMessages[messageIndex]
    queuedMessages.splice(messageIndex, 1);
    say(message.message);
    previousMessages.unshift({
      message: message.message,
      time: new Date(),
    })
  }
};

const sayCopypasta = () => {
  const random = Math.round(Math.random() * copypasta.length);
  say(copypasta[random]);
}

const say = (message: string) => {
  if (!ACTIVE_CLIENT) return;
  
  ACTIVE_CLIENT.say(ACTIVE_CHANNEL, message);
}

export default main;
