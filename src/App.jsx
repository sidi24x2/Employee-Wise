import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { useContext } from 'react';
import UserContext from './components/contexts/UserContext';
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import AllUsers from './components/AllUsers';
import EditUser from './components/EditUser';

function App() {
  const [user, setUser] = useState({
    email: null,
    isActive: false,
  });

  useEffect(() => {
    let rawData = localStorage.getItem('activeUser');
    if (rawData) {
      setUser(JSON.parse(rawData));
    }
  }, []);

  function Authenticated() {
    return (
      <>
        <Routes>
          <Route path="/users" element={<AllUsers />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </>
    );
  }

  function NonAuthenticated() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </>
    );
  }
  return (
    <>
      <div className="min-w-[387px] box-border">
        <BrowserRouter>
          <UserContext.Provider
            value={{
              user: user,
              setUser: setUser,
            }}
          >
            <Header />

            {user && user?.isActive ? <Authenticated /> : <NonAuthenticated />}
          </UserContext.Provider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
