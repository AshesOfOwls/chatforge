import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

const clientId = process.env.REACT_APP_TWITCH_CLIENT_ID || '';
const clientSecret = process.env.REACT_APP_TWITCH_CLIENT_SECRET || '';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

const apiClient = new ApiClient({ authProvider });

async function main() {
  const isLive = await isStreamLive('shroud');

  console.log("is it live?", isLive);
}

async function isStreamLive(userName: string) {
	const user = await apiClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await apiClient.streams.getStreamByUserId(user.id) !== null;
}

export default main;
