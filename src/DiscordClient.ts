import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID || '';
const GUILD_ID = process.env.REACT_APP_DISCORD_GUILD_ID || '';

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}]; 

const rest = new REST({ version: '9' }).setToken('token');

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

export default main;
