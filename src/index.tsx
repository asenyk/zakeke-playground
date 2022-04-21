import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ZakekeEnvironment, ZakekeProvider } from 'zakeke-configurator-react';
import { DialogsRenderer } from 'components/dialogs/Dialogs';

const zakekeEnvironment = new ZakekeEnvironment();

ReactDOM.render(
  <React.StrictMode>
    <ZakekeProvider environment={zakekeEnvironment}>
      <App />
      <DialogsRenderer />
    </ZakekeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
