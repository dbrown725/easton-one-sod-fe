import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import { gql, useQuery } from '@apollo/client';
import './Page.css';
import { useCallback, useEffect, useState } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

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

const GET_SEARCH_RESULTS = gql`
query GetSearchResults {
  songBySearchText(searchText: "rolling stones") {
    id
  	bandName
    songName
    title
    titleHighlighted
    link
    playlist
    message
    score
  }
}
`;

  const { loading, error, data } = useQuery<BullpenSongData, SongVars>(GET_BULLPEN_SONG);
  console.log('**** UseQuery data GET_BULLPEN_SONG', data);

  const onSubmit = (event: any) => {
    event.preventDefault();
    console.log("Submitted");
       
    //console.log('cartItems', items);
    //const { loading, error, data } = useQuery<SearchData, SongVars>(GET_SEARCH_RESULTS);
    //console.log('**** UseQuery GET_SEARCH_RESULTS data', data);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer name={name} /> */}
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
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <b>Proof of Concept: Data from Elastic Search. Songs matching text</b>
              </IonCol>
            </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput placeholder="Enter Search Text"></IonInput>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                <IonButton onClick={onSubmit}>Submit</IonButton>
                </IonCol>
              </IonRow>
              {/* <form
                onSubmit={e => {
                  e.preventDefault();
                  addTodo({ variables: { type: input.value } });
                  input.value = '';
                }}
              >
                <input
                  ref={node => {
                    input = node;
                  }}
                />
                <button type="submit">Add Todo</button>
              </form> */}

            
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};

export default Page;
