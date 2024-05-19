import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { ProfileDataProvider } from './contexts/ProfileDataContext';
import { FriendDataProvider } from './contexts/FriendDataContext';
import { FriendRequestProvider } from './contexts/FriendRequestContext';
import { ChatDataProvider } from './contexts/ChatDataContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <ProfileDataProvider>
          <FriendRequestProvider>
            <FriendDataProvider>
              <ChatDataProvider>
                <App />
              </ChatDataProvider>
            </FriendDataProvider>
          </FriendRequestProvider>
        </ProfileDataProvider>
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
