import { IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Playlist.css';
import dorm from './../assets/images/Dorm.jpg';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';

const Playlist: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Generate Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Generate Playlist</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonGrid>

            {/* Temp hack to replace css for top margin */}
            <IonRow>
              <IonCol>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
              </IonCol>
            </IonRow>


            <IonRow>
              <IonCol>
                <b>Coming soon!.</b>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
              <IonImg src="assets/images/Dorm.jpg" className='menu-logo' alt="Song of the day!"></IonImg>
              </IonCol>
            </IonRow>
          
          </IonGrid>
          <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Playlist;
