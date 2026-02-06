
import React from 'react';
import ReactDOM from 'react-dom/client';
import ManagerApp from './ManagerApp';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ManagerApp />
  </React.StrictMode>
);
