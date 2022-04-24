import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';

const firebaseConfig = {
    apiKey: 'AIzaSyDVhS0LI3OAtraVQtq3lVEDwZ8KkrGMsC0',
    authDomain: 'webrtc-7d954.firebaseapp.com',
    projectId: 'webrtc-7d954',
    storageBucket: 'webrtc-7d954.appspot.com',
    messagingSenderId: '949895648096',
    appId: '1:949895648096:web:df2a4e83406c46c4bac405',
};

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
