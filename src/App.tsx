import React from 'react';
import './App.css';

import { getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirebaseApp } from 'reactfire';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Home from './pages/Home';

function App() {
    const firestoreInstance = getFirestore(useFirebaseApp());
    return (
        <FirestoreProvider sdk={firestoreInstance}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="rooms">
                        <Route path=":roomId" element={<Room />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Outlet />
        </FirestoreProvider>
    );
}

export default App;
