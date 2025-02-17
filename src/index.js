import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "@fontsource/noto-sans";
import "@fontsource/noto-sans/800.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter basename='twitter_frontend'>
      <App />
    </BrowserRouter>

);

