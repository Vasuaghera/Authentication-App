import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MainContextProvider } from './context/MainContext.jsx';

// Initialize AOS
AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MainContextProvider>
      <App />
    </MainContextProvider>
  </BrowserRouter>
);
