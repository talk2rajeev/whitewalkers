import React from 'react';
import logo from './logo.svg';
import './App.css';

import { RouterProvider } from "react-router-dom";
import AppRouter from './AppRoutes';

export const baseUrl = 'http://localhost:4000';

function App() {
  return (
    <div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
