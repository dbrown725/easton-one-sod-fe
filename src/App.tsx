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

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  
  return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/page/Latest" />
              </Route>
              <Route path="/page/Archives" exact={true}>
                <Archives/>
              </Route>
              <Route path="/page/Bullpen" exact={true}>
                <Bullpen/>
              </Route>
              <Route path="/page/Latest" exact={true}>
                <Latest/>
              </Route>
              <Route path="/page/Submit" exact={true}>
                <Submit/>
              </Route>
              <Route path="/page/Download" exact={true}>
                <Download/>
              </Route>
              <Route path="/page/Playlist" exact={true}>
                <Playlist/>
              </Route>
              <Route path="/page/Profile" exact={true}>
                <Profile/>
              </Route>
              <Route path="/page/Repair" exact={true}>
                <Repair/>
              </Route>
              {/* <Route path="/page/:name" exact={true}>
                <Page />
              </Route> */}
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
