import './Latest.css';
import { GET_MOST_RECENT_SONGS } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Song } from '../common/types';
import { useHistory } from 'react-router';


const Latest: React.FC = () => {

  const history = useHistory();

  const editClickHandler = (event: React.MouseEvent<HTMLSpanElement>, song: Song) => {
    history.push({
      pathname:'/page/Submit',
      state: {song: song, updateSODRequest: true}
    })
  }

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
        <ScrollingSongList
          count={400}
          addDataIncrement={40}
          queryDocumentNode={GET_MOST_RECENT_SONGS}
          queryDefinitionName={"getMostRecentSongs"}
          editCallback={editClickHandler}
          showDeleteButton={false}
          showEditButton={true} />
      </IonContent>
    </IonPage>
  );
};

export default Latest;
