import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword} from "./../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { useHistory } from 'react-router';
import { IonContent, IonPage } from "@ionic/react";
import { Link, } from "react-router-dom";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [authenticatedOnceAlready, setAuthenticatedOnceAlready] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }

    if (user != null) {
      setAuthenticatedOnceAlready(true);
      history.push({ pathname: '/page/Latest' });
    } else {
      if (authenticatedOnceAlready) {
         //without this check the Login page keeps reloading over and over again.

        //needed to reload <app> so splitpane is not shown when logged out
        window.location.reload();
      }
    }
  }, [user, loading]);

  const login = (() => {
    logInWithEmailAndPassword(email, password);
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key == 'Enter') {
      login();
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen class="background">
        <div className="login" onKeyDown={e => { handleKeyDown(e) }}>
          <div className="login__container">
            <input
              type="text"
              className="login__textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              placeholder="E-mail Address"
            />
            <input
              type="password"
              className="login__textBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              className="login__btn"
              onClick={() => login()}
            >
              Login
            </button>
            {/* <button className="login__btn login__google" onClick={signInWithGoogle}>
              Login with Google
              </button>
            */}

            <div>
              <Link to="/page/Reset">Forgot Password</Link>
            </div>
            {/*
            <div>
              Don't have an account? <Link to="/register">Register</Link> now.
            </div>
          */}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
  
};

export default Login;