import { IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Download.css';
import dorm from './../assets/images/Dorm.jpg';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';

const Download: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Download CSV</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Download CSV</IonTitle>
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
                <IonImg className='dormImg' src={dorm} alt={"dorm image"}/>
              </IonCol>
            </IonRow>
          </IonGrid>
          <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Download;
