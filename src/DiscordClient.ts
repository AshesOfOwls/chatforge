import { Client, Intents } from 'discord.js';
// import { REST } from '@discordjs/rest';
// import { Routes } from 'discord-api-types/v9';

const TOKEN = process.env.REACT_APP_DISCORD_TOKEN || '';

async function main() {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  // client.once('ready', () => {
  //   console.log('Ready!');
  // });

  client.login(TOKEN);
};

export default main;
