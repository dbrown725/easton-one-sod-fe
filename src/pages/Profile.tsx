import { IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { gql, useQuery } from '@apollo/client';
import './Profile.css';
import dorm from './../assets/images/Dorm.jpg';
import {BullpenSongData} from '../common/types';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

const Profile: React.FC = () => {


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
  console.log('**** UseQuery data GET_BULLPEN_SONG', data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Profile</IonTitle>
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

            <IonRow>
              <IonCol>
                <IonImg className='dormImg' src={dorm} alt={"dorm image"}/>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};

export default Profile;
