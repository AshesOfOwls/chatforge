import { useEffect } from 'react';
import logo from './logo.svg';
import TwitchClient from './TwitchClient';
import { useBeforeunload } from 'react-beforeunload';
// import DiscordClient from './DiscordClient';
import './App.css';

let twitchClient: any = null;

function App() {
  useEffect(() => {
    if (!twitchClient) {
      twitchClient = TwitchClient();
    }
  });

  useBeforeunload(() => {
    if (twitchClient) {
      twitchClient.disconnect();
      twitchClient = null;
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
