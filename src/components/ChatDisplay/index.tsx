import { useState, useEffect } from 'react';
import * as Comlink from 'comlink';
import Worker from '../../workers/twitchClient';
import s from './ChatDisplay.module.css';
import responses from './responses';
import { TwitchMessage } from '../../types/TwitchMessage';

export interface ChannelMessages {
  [key: string]: TwitchMessage[],
}

let worker: Worker | null = null;
let init = async (callback: any) => {};
let subscribe = async (callback: any) => {};

const ChatDisplay = () => {
  const [channelMessages, setChannelMessages] = useState<ChannelMessages>({});

  useEffect(() => {
    console.log('create')
    worker = new Worker();

    init = async (callback: any) => {
      if (!worker) return;
      worker.init(Comlink.proxy(callback));
    };
    subscribe = async (callback: any) => {
      if (!worker) return;
      worker.subscribe(Comlink.proxy(callback));
    };

    return () => {
      if (!worker) return;

      worker.destroy();
      worker = null;
    }
  }, []);

  useEffect(() => {
    init(() => {
      // @ts-ignore
      worker.join('m60_');
    });
    subscribe((messages: ChannelMessages) => setChannelMessages(messages));
  }, []);

  // const messages = channelMessages['m60'] || [];

  return (
    <div>
      Messages: 
      <div className={s.messages}>
        {/* { messages.map((message) => (
          <div key={message.id}>
            { message.text }
          </div>
        ))} */}
      </div>
    </div>
  )
};

export default ChatDisplay;
