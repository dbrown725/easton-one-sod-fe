import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SearchForSongs from '../components/SearchForSongs';
import './Archives.css';

const Archives: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Archives</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Archives</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SearchForSongs />
      </IonContent>
    </IonPage>
  );
};

export default Archives;
