// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/Cartcontext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider> {/*คุม app ด้วย Provider */}
      <App />
    </CartProvider>
  </React.StrictMode>,
);
