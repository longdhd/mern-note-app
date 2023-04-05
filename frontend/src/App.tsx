import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import styles from './styles/NotesPage.module.css';
import * as UserApi from './network/users_api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './page/NotesPage';
import PrivacyPage from './page/PrivacyPage';
import NotFoundPage from './page/NotFoundPage';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignupModal(true)}
          onLogoutSuccessfully={() => setLoggedInUser(null)}
        />
        <Container style={{
          padding:'32px 0'
        }}>
          <Routes>
            <Route 
              path="/"
              element={<NotesPage loggedInUser={loggedInUser}/>}
            />
            <Route 
              path="/privacy"
              element={<PrivacyPage />}
            />
            <Route 
              path="/*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Container>
        {showSignupModal &&
          <SignUpModal
            onDismiss={() => setShowSignupModal(false)}
            onSignUpSuccessfully={(user) => {
              setLoggedInUser(user);
              setShowSignupModal(false);
            }}
          />
        }
        {showLoginModal &&
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessfully={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
