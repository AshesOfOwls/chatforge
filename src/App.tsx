import { useEffect, useState } from 'react';
import TwitchClient from './TwitchClient';
import { useBeforeunload } from 'react-beforeunload';
import './App.css';

const ACTIVE_CHANNEL_DEFAULT = '';
let twitchClient: any = null;

function App() {
  const [activeChannelInputValue, setactiveChannelInputValue] = useState(ACTIVE_CHANNEL_DEFAULT)
  const [activeChannel, setActiveChannel] = useState(ACTIVE_CHANNEL_DEFAULT);
  const [activeOauth, setActiveOauth] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const [copypastaEnabledValue, setCopypastaEnabledValue] = useState<boolean>(false);
  
  useEffect(() => {
    if (!twitchClient) {
      twitchClient = TwitchClient(activeChannel, activeOauth, copypastaEnabledValue);
    } else {
      twitchClient.client?.disconnect();
      twitchClient = TwitchClient(activeChannel, activeOauth, copypastaEnabledValue);
    }
  },[activeChannel, activeOauth, copypastaEnabledValue]);

  useBeforeunload(() => {
    if (twitchClient) {
      twitchClient.client.disconnect();
      twitchClient = null;
    }
  })

  const changeChannel = () => {
    setActiveChannel(activeChannelInputValue);
  }

  const changeUser = () => {
    setActiveOauth(passwordInputValue);
  }

  const handleChannelInputChange = (e: any) => {
    setactiveChannelInputValue(e.target.value);
  }

  const handlePasswordInputChange = (e: any) => {
    setPasswordInputValue(e.target.value);
  }

  const handleChangeCopypasta = (e: any) => {
    setCopypastaEnabledValue(!copypastaEnabledValue);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Channybee_ Bot</h2>
        <div>
          <label>Change channel:</label>
          <input value={activeChannelInputValue} onChange={handleChannelInputChange} />
          <button onClick={changeChannel}>Change Channel</button>
        </div>
        <div>
          <h4>Toggle Copypasta (10 minute intervals):</h4>
          <div>
            <label>Enable:</label>
            <input checked={copypastaEnabledValue} onChange={handleChangeCopypasta} type="checkbox" />
          </div>
        </div>
        <div>
          <h4>Change user:</h4>
          <div>
            <label>oauth:</label>
            <input value={passwordInputValue} onChange={handlePasswordInputChange} type="password" />
          </div>
          <button onClick={changeUser}>Change user</button>
          <div>
            <a href="https://twitchapps.com/tmi/">GET OAUTH TOKEN HERE</a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
