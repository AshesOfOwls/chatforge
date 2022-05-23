import tmi from 'tmi.js';
import copypasta from './copypasta';
import { isBefore, differenceInMinutes, differenceInSeconds, addSeconds } from 'date-fns';

const ACTIVE_CHANNEL = 'm60_';
const COPYPASTA_MINUTE_DELAY = 3;
const STALE_MESSAGE_DELAY = 45;
const MESSAGE_MAX_SKIP = 20;
const MESSAGE_MAX_DELAY = 5;
const REPEATABLE_MESSAGE_DELAY = 1.5;

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

const countTo = (limit: number) => {
  const startTime = new Date();
  let currentNumber = 1;
  const countingInterval = setInterval(() => {
    if (differenceInSeconds(new Date(), startTime) > Math.random() * 10) {
      say(`${currentNumber}`);
      currentNumber++;
    }

    if (currentNumber === limit + 1) {
      clearInterval(countingInterval);
    }
  }, 3000)
}

async function main() {
  const client = await connectToTwitch();
  const clientStartDate = new Date();

  listenToMessages(client);
  // countTo(10);
  // say('LUL')

  setInterval(() => {
    const seconds = differenceInSeconds(new Date(), clientStartDate) % 60;
    const minutes = differenceInMinutes(new Date(), clientStartDate);
    console.log("Time since start", `${minutes}:${seconds}`)
  }, 1000 * 10)
  
  setInterval(() => {
    sayCopypasta();
  }, 1000 * 60 * COPYPASTA_MINUTE_DELAY);

  setInterval(() => {
    sayEnqueuedMessage();
  }, 1000);

  return client;
}

const enqueueResponse = (receivedMessage: string, messageMatch: RegExp, responseMessage: string) => {
  if (receivedMessage.toLowerCase().match(messageMatch)) {
    enqueueMessage(responseMessage);
  }
};

type TMessageResponse = {
  regex: RegExp,
  responses: string[],
  repeatable?: boolean,
}

const messageResponses: TMessageResponse[] = [{
  regex: /^1$/i,
  responses: ['1'],
}, {
  regex: /^LUL$|^LOL$|^HA$|^m60LUL$/i,
  responses: ['LUL', 'LOL', 'lmfao', 'Hahaha', 'LULW', 'LMFAO', 'lol', 'lul', 'HAHAHA'],
}, {
  regex: /^9\/11$/i,
  responses: ['11/11'],
}, {
  regex: /^Clap/gi,
  responses: ['Clap'],
  repeatable: true,
}, {
  regex: /^poggies/gi,
  responses: ['POGGIES'],
}, {
  regex: /^pogchamp/gi,
  responses: ['PogChamp'],
}, {
  regex: /^PepeHands/gi,
  responses: ['PepeHands'],
}, {
  regex: /duDudu/g,
  responses: ['duDudu'],
  repeatable: true,
}, {
  regex: /taco bell/g,
  responses: ['TACO BELL!'],
}, {
  regex: /just dance/g,
  responses: ['JUST DANCE POGGIES'],
}, {
  regex: /^!raid/gi,
  responses: ['!raid'],
}, {
  regex: /^my poops/gi,
  responses: ['MY POOPS'],
}, {
  regex: /^catjam/gi,
  responses: ['catJAM'],
  repeatable: true,
}, {
  regex: /^rickpls/gi,
  responses: ['RickPls'],
  repeatable: true,
}, {
  regex: /^peped/gi,
  responses: ['pepeD'],
  repeatable: true,
}, {
  regex: /^partykirby/gi,
  responses: ['PartyKirby'],
  repeatable: true,
}, {
  regex: /^pepehands/gi,
  responses: ['pepeHands'],
}, {
  regex: /^D:|^m60d/gi,
  responses: ['D:'],
}, {
  regex: /^yeah shit cum|^yea shit cum/gi,
  responses: ['YEA shit cum YEA shit cum YEA shit cum YEA shit cum YEA shit cum'],
}, {
  regex: /^m60Star/gi,
  responses: ['m60Star m60Star m60Star m60Star m60Star m60Star m60Star'],
}];

const listenToMessages = (client: any) => {
  client.on('message', (channel: string, tags: Record<string, string>, message: string, self: boolean) => {
    if(self) return;

    const sender = tags['display-name'];

    const response = messageResponses.find((mr) => message.match(mr.regex));

    if (response) {
      const responses = response.responses;
      enqueueResponse(message, response.regex, responses[Math.floor(Math.random() * responses.length)])
    }

    enqueueResponse(message, /channybee/gi, `Omg hi @${sender}!`);
  });
}

type TQueuedMessage = {
  message: string,
  time: Date,
}

const previousMessages: TQueuedMessage[] = [];
const queuedMessages: TQueuedMessage[] = [];

const getResponseFromMessage = (message: string) => {
  return messageResponses.find((mr) => mr.responses.includes(message));
};

const getRecentMessage = (message: string) => {
  let recentSameMessage: any = previousMessages.find((pm) => pm.message === message);
  
  if (!recentSameMessage) {
    const messageResponse = getResponseFromMessage(message);
    recentSameMessage = previousMessages.find((pm) => messageResponse?.responses.includes(pm.message));
  }

  return recentSameMessage;
};

const isMessageRecent = (message: string) => {
  const recentSameMessage = getRecentMessage(message);

  if (!recentSameMessage) return false;
  
  const timeDifference = differenceInSeconds(new Date(), recentSameMessage.time);

  const messageResponse = getResponseFromMessage(message);

  if (messageResponse && messageResponse.repeatable) {
    return timeDifference < Math.random() * REPEATABLE_MESSAGE_DELAY;
  } 

  return timeDifference < STALE_MESSAGE_DELAY;
};

let timeSinceLastMessage = new Date();

const enqueueMessage = (message: string) => {
  if (queuedMessages.find((qm) => qm.message === message)) {
    return;
  }

  if (isMessageRecent(message)) {
    return;
  }


  if(differenceInSeconds(new Date(), timeSinceLastMessage) < Math.random() * MESSAGE_MAX_SKIP) {
    return;
  } 

  timeSinceLastMessage = new Date();

  const randomDelay = (Math.random() * MESSAGE_MAX_DELAY) + 1;
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
