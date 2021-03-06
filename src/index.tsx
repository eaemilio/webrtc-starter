import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';
import { Buffer } from 'buffer';

const firebaseConfig = JSON.parse(Buffer.from(process.env.REACT_APP_FIREBASE_CONFIG ?? '', 'base64').toString());

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <SuspenseWithPerf fallback={<p>Loading...</p>} traceId={'loading-app-status'}>
            <App />
        </SuspenseWithPerf>
    </FirebaseAppProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
