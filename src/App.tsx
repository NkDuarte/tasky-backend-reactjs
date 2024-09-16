import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersPage from './pages/user.pages';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <UsersPage />
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default App;
