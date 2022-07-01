import * as Comlink from 'comlink';
import tmi from 'tmi.js';
import { format, fromUnixTime } from 'date-fns';
import { TwitchMessage } from '../../types/TwitchMessage';

const MAX_STORED_MESSAGES = 300;
const MESSAGE_TRUNK = 50;
const MESSAGE_INTERVAL = 100;

const client = new tmi.Client({
  connection: { reconnect: true },
  channels: [],
  identity: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_OAUTH
  },
});

export interface TwitchClientWorker {
  messages: TwitchMessage[],
  channelEmotes: any[],
  channelBadges: any[],
  init: (callback: any) => void,
  join: (channel: string) => void,
  getMessages: (callback: any) => void,
  subscribe: (channels: string[], callback: any) => void,
  addMessage: (message: TwitchMessage, callback: any) => void,
  destroy: () => void,
  channelMetadata: any,
  channelMessages: any,
  hasSubscribed: boolean,
  hasSubscribedToMetadata: boolean,
  joinTimes: any,
  metadataInterval: any,
  messageInterval: any,
}

const twitchClient: TwitchClientWorker = {
  messages: [],
  channelMessages: {},
  channelBadges: [],
  channelEmotes: [],
  hasSubscribed: false,
  hasSubscribedToMetadata: false,
  joinTimes: {},
  channelMetadata: {},
  metadataInterval: null,
  messageInterval: null,
  init(callback: any) {
    if (!['OPEN', 'CONNECTING'].includes(client.readyState())) {
      client.connect().then(callback);
    }
  },
  addMessage(message, callback) {
    const oldMessages = this.channelMessages[message.channel] || [];
    if (oldMessages.length > MAX_STORED_MESSAGES) {
      oldMessages.splice(0, MESSAGE_TRUNK)
    }

    this.channelMessages[message.channel] = [...oldMessages, message];

    callback(this.channelMessages);
  },
  subscribe(callback: any) {
    if (this.hasSubscribed) return;

    this.hasSubscribed = true;

    client.on('subscription', (channel, username, method, message, tags) => {
      const unixTimestamp = parseInt(tags['tmi-sent-ts'] || '0') / 1000;

      const newMessage: TwitchMessage = {
        id: tags.id,
        channel: channel.replace('#', ''),
        messageType: tags['message-type'],
        messageId: tags['msg-id'],
        username,
        text: "OMG A TEST SUB HAPPENED",
        time: format(fromUnixTime(unixTimestamp), 'h:mm'),
      };
      this.addMessage(newMessage, callback);
    });

    client.on('resub', (channel, username, method, message, tags) => {
      const unixTimestamp = parseInt(tags['tmi-sent-ts'] || '0') / 1000;

      const newMessage: TwitchMessage = {
        id: tags.id,
        channel: channel.replace('#', ''),
        messageId: tags['msg-id'],
        messageType: tags['message-type'],
        username,
        text: "OMG A TEST rESUB HAPPENED",
        time: format(fromUnixTime(unixTimestamp), 'h:mm'),
      };

      this.addMessage(newMessage, callback);
    });

    client.on('message', (channel, tags, message) => {      
      const unixTimestamp = parseInt(tags['tmi-sent-ts'] || '0') / 1000;
      const badges = tags.badges || {};

      const newMessage: TwitchMessage = {
        id: tags.id,
        channel: channel.replace('#', ''),
        messageType: tags['message-type'],
        messageId: tags['msg-id'],
        text: message,
        username: tags['display-name'],
        usernameColor: tags.color,
        replyName: tags['reply-parent-display-name'],
        replyMessage: tags['reply-parent-msg-body'],
        time: format(fromUnixTime(unixTimestamp), 'h:mm'),
        badges: Object.keys(badges),
      };

      this.addMessage(newMessage, callback);
    })
  },
  getMessages(callback) {
    callback(this.messages);
  },
  join(channel: string) {
    if (client.getChannels().includes(channel)) return;

    console.log('join', channel)
    this.joinTimes[channel] = new Date();
    client.join(channel);
  },
  destroy() {
    this.messages = [];
    this.channelMetadata = {};
    client.disconnect();
    clearInterval(this.metadataInterval);

    console.log('destroy')
    close(); // eslint-disable-line
  }
};

Comlink.expose(twitchClient);
