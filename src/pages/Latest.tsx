import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { gql, useQuery } from '@apollo/client';
import './Latest.css';
import {SongResult} from '../common/types';
import SongList from '../components/SongList';

const Latest: React.FC = () => {

  interface SongVars {
    count: 50
  }

  const GET_MOST_RECENT_SONGS = gql`
  query getMostRecentSongs {
    getMostRecentSongs(count: 50) {
      id
      bandName
      songName
      title
      link
      message
      sortOrder
      userId
      createTime
      modifyTime
    }
  }
`;


  const { loading, error, data } = useQuery<SongResult, SongVars>(GET_MOST_RECENT_SONGS);
  console.log('**** UseQuery data GET_MOST_RECENT_SONGS', data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Latest songs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Latest songs</IonTitle>
          </IonToolbar>
        </IonHeader>
        {
          data && data.getMostRecentSongs
          && <SongList showId={true} showScore={false} songs={data.getMostRecentSongs} />
        }
      </IonContent>
    </IonPage>
  );
};

export default Latest;
