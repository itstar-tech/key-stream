import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {AppProviders} from './context/AppProviders';
import {PageLayout} from './components/Layout';
import {Lobby} from './components/Lobby';
import {Game} from './components/Game';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                <PageLayout>
                    <Routes>
                        <Route path="/" element={<Lobby/>}/>
                        <Route path="/room/:roomId" element={<Game/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </PageLayout>
            </AppProviders>
        </BrowserRouter>
    );
}

export default App;