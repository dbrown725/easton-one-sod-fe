import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Archives from './pages/Archives';
import Bullpen from './pages/Bullpen';
import Latest from './pages/Latest';
import Submit from './pages/Submit';
import Download from './pages/Download';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import Repair from './pages/Repair';
import Login from './pages/Login';
import Reset from './pages/Reset';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { auth } from "./firebase";
import { useState } from 'react';

/* Theme variables */
import './theme/variables.css';
import { TimeoutLogic } from './components/TimeoutLogic';
import Radio from './pages/Radio';


setupIonicReact();

const App: React.FC = () => {

  const queryParameters = new URLSearchParams(window.location.search)
  const commentSongId = queryParameters.get("commentSongId")
  if(commentSongId) {
    localStorage.setItem('commentSongId', commentSongId as string);
  }

  const [token, setToken] = useState<string>('');

  auth.onAuthStateChanged(function (user) {
    if (user) {
      user!.getIdToken().then(function (idToken) {
        setToken(idToken);
        localStorage.setItem('token', idToken);
      });
    }
  });

  return (
    <>
      {
        !token &&
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet id="public">
              <Route path="/" exact={true}>
                <Login />
              </Route>
              <Route path="/page/Reset" exact={true}>
                <Reset />
              </Route>
              <Route path="/page/Login" exact={true}>
                <Login />
              </Route>
              <Route render={() => <Redirect to={'/page/Login'} />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      }
      {token &&
        <IonApp>
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <Menu />
              <IonRouterOutlet id="main">
                <Route path="/" exact={true}>
                  <Login />
                </Route>
                <Route path="/page/Login" exact={true}>
                  <Login />
                </Route>
                <Route path="/page/Reset" exact={true}>
                  <Reset />
                </Route>
                <Route path="/page/Archives" exact={true}>
                  <Archives />
                </Route>
                <Route path="/page/Bullpen" exact={true}>
                  <Bullpen />
                </Route>
                <Route path="/page/Latest" exact={true}>
                  <Latest />
                </Route>
                <Route path="/page/Radio" exact={true}>
                  <Radio />
                </Route>
                <Route path="/page/Submit" exact={true}>
                  <Submit />
                </Route>
                <Route path="/page/Download" exact={true}>
                  <Download />
                </Route>
                <Route path="/page/Playlist" exact={true}>
                  <Playlist />
                </Route>
                <Route path="/page/Profile" exact={true}>
                  <Profile />
                </Route>
                <Route path="/page/Repair" exact={true}>
                  <Repair />
                </Route>
                <Route path="/page/Home" exact={true}>
                  <Home />
                </Route>
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter>
          <TimeoutLogic/>
        </IonApp>
      }
    </>
  );
};

export default App;
