import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import TokenProviderWrapper from './context/TokenProviderWrapper';

ReactDOM.createRoot(document.getElementById("root")).render(
  <TokenProviderWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TokenProviderWrapper>
);
