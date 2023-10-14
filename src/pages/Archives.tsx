import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SearchForSongs from '../components/SearchForSongs';
import './Archives.css';
import { useHistory } from 'react-router';
import { Song } from '../common/types';

const Archives: React.FC = () => {

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
          <IonTitle>Archives</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Archives</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SearchForSongs editCallback={editClickHandler} showEditButton={true} />
      </IonContent>
    </IonPage>
  );
};

export default Archives;
