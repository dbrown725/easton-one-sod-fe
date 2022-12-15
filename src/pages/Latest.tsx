import './Latest.css';
import { GET_MOST_RECENT_SONGS } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Latest: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Latest Songs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Latest Songs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ScrollingSongList count={400} addDataIncrement={20} queryDocumentNode={GET_MOST_RECENT_SONGS} queryDefinitionName={"getMostRecentSongs"} />
      </IonContent>
    </IonPage>
  );
};

export default Latest;
