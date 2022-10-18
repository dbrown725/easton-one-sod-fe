import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import './Bullpen.css';
import { useCallback, useEffect, useState } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";

const Bullpen: React.FC = () => {

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

  interface SearchData {
    songs: Song[];
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
  console.log('**** UseQuery data GET_BULLPEN_SONG', data);

  const onSubmit = (event: any) => {
    event.preventDefault();
    console.log("Submitted");
  }

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
                <b>Proof of Concept: Data from Database. First song in bullpen.</b>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                Band: {data.bullpenSongById.bandName}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                Song: {data.bullpenSongById.songName}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                Title: {data.bullpenSongById.title}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                Link: <a href={data.bullpenSongById.link} target='_blank' rel="noreferrer">{data.bullpenSongById.link}</a>
              </IonCol>
            </IonRow>
            
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};

export default Bullpen;
