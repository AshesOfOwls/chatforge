import tmi from 'tmi.js';
import copypasta from './copypasta';
import { isBefore, differenceInMinutes, differenceInSeconds, addSeconds } from 'date-fns';
import responses from './responses';

const COPYPASTA_MINUTE_DELAY = 10;
const STALE_MESSAGE_DELAY = 20;
const MESSAGE_MAX_SKIP = 10;
const MESSAGE_MAX_DELAY = 3;
const REPEATABLE_MESSAGE_DELAY = 1;

let intervals: any[] = [];

let ACTIVE_CHANNEL = 'm60_';
let ACTIVE_CLIENT: any = null;
let ENABLE_COPYPASTA: boolean = false;

const connectToTwitch = async (oauth?: string) => {
  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];

  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      password: oauth || process.env.REACT_APP_OAUTH
    },
    channels: [ACTIVE_CHANNEL]
  });
  
  await client.connect();

  ACTIVE_CLIENT = client;

  return client;
};

const countTo = (limit: number, start: number = 0) => {
  const startTime = new Date();
  let currentNumber = start + 1;
  const countingInterval = setInterval(() => {
    if (differenceInSeconds(new Date(), startTime) > Math.random() * 10) {
      say(`${currentNumber}`);
      currentNumber++;
    }

    if (currentNumber === limit + 1) {
      clearInterval(countingInterval);
    }
  }, 3000)
  intervals.push(countingInterval);
}

const sayAlphabet = () => {
  const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  const startTime = new Date();
  let currentLetterIndex = 0;
  const alphabetInterval = setInterval(() => {
    if (differenceInSeconds(new Date(), startTime) > Math.random() * 10) {
      const currentLetter = alphabet[currentLetterIndex]
      say(`${currentLetter}`);
      currentLetterIndex++;
    }

    if (currentLetterIndex === alphabet.length - 1) {
      clearInterval(alphabetInterval);
    }
  }, 3000)
  intervals.push(alphabetInterval);
}

async function main(activeChannel?: string, oauth?: string, enableCopypasta: any = false) {
  if (activeChannel) {
    ACTIVE_CHANNEL = activeChannel;
  }
  
  ENABLE_COPYPASTA = enableCopypasta;

  const client = await connectToTwitch(oauth);
  const clientStartDate = new Date();

  listenToMessages(client);

  const timeSinceStartInterval = setInterval(() => {
    const seconds = differenceInSeconds(new Date(), clientStartDate) % 60;
    const minutes = differenceInMinutes(new Date(), clientStartDate);
    console.log("Time since start", `${minutes}:${seconds}`)
  }, 1000 * 10)
  intervals.push(timeSinceStartInterval);

  let copypastaInterval = null;
  if (ENABLE_COPYPASTA) {
    copypastaInterval = setInterval(() => {
      sayCopypasta();
    }, 1000 * 60 * COPYPASTA_MINUTE_DELAY);
    intervals.push(copypastaInterval);
  }

  const enqueueInterval = setInterval(() => {
    sayEnqueuedMessage();
  }, 1000);
  intervals.push(enqueueInterval);

  return {
    client,
    queuedMessages,
    previousMessages
  };
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

const messageResponses: TMessageResponse[] = responses;

const listenToMessages = (client: any) => {
  client.on('message', (channel: string, tags: Record<string, string>, message: string, self: boolean) => {
    if(self) return;

    const sender = tags['display-name'];

    if (['ashesofowls123', 'channybee_'].includes(sender.toLowerCase()) && Math.random() < 0.9) {
      return;
    }

    const response = messageResponses.find((mr) => message.match(mr.regex));

    if (response) {
      const responses = response.responses;
      enqueueResponse(message, response.regex, responses[Math.floor(Math.random() * responses.length)])
    }

    enqueueResponse(message, /channybee/gi, `Omg hi @${sender}!`);
    enqueueResponse(message, /happy birthday/gi, `Happy Bday @m60_!`);
  });

  client.on('notice', (channel: string, tags: Record<string, string>, message: string, self: boolean) => {
    console.log('on notice', channel, tags, message)
  })
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

  if (Math.random() < 0.5) {
    return;
  }

  // const response = getResponseFromMessage(message);
  // const skipDelay = response?.repeatable ? REPEATABLE_MESSAGE_DELAY : MESSAGE_MAX_SKIP;
  if(differenceInSeconds(new Date(), timeSinceLastMessage) < Math.random() * MESSAGE_MAX_SKIP) {
    return;
  } 

  timeSinceLastMessage = new Date();

  const randomDelay = (Math.random() * MESSAGE_MAX_DELAY) + (message.length * .05);
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
