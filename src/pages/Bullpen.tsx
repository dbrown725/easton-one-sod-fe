import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { gql, useQuery } from '@apollo/client';
import './Bullpen.css';
import {BullpenSongData} from '../common/types';
import SongList from '../components/SongList';

import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

const Bullpen: React.FC = () => {

  interface SongVars {
    // year: number;
  }

  const GET_ALL_BULLPEN_SONGS = gql`
  query GetAllBullPenSongs {
    getAllBullpenSongs(count: 200) {
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

  const { loading, error, data } = useQuery<BullpenSongData, SongVars>(GET_ALL_BULLPEN_SONGS);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Bullpen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Bullpen</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading && <h1>loading</h1>}


        {
        
        data && data.getAllBullpenSongs
          && <SongList showId={false} showScore={false} songs={data.getAllBullpenSongs}/> 

        }

      </IonContent>
    </IonPage>
  );
};

export default Bullpen;
