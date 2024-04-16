import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style/main.scss';
import { store } from './store';
import { Provider } from 'react-redux';
import { SocketProvider } from './socket/socketContext.tsx';
import { ReloadApiProvider } from './hooks/reload-api/ReloadApiContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ReloadApiProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ReloadApiProvider>
    </Provider>
  </React.StrictMode>,
);
