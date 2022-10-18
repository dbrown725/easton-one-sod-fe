import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { gql, useQuery } from '@apollo/client';
import './Submit.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

const Submit: React.FC = () => {

  // const { name } = useParams<{ name: string; }>();

  interface BullpenSongData {
    bullpenSongById: Song;
  }

  interface Song {
    id: number;
    bandName: string;
    songName: string;
    title: string;
    link: string;
    message: string;
    sortOrder: number;
    createTime: string;
    modifyTime: string;
  }

  interface SongVars {
    // year: number;
  }

  const GET_BULLPEN_SONG = gql`
  query GetBullPenSong {
    bullpenSongById(id: 1) {
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


  const { loading, error, data } = useQuery<BullpenSongData, SongVars>(GET_BULLPEN_SONG);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Submit a song</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Submit</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading && <h1>loading</h1>}
        {data &&
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
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};

export default Submit;
