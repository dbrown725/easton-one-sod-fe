import { InputChangeEventDetail, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { gql, useLazyQuery } from '@apollo/client';
import './Page.css';
import { useEffect, useRef, useState } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";


const Page: React.FC = () => {

  const [searchText, setSearchText] = useState<string | undefined | null>();

  const [apiSearchText, setApiSearchText] = useState<string | undefined | null>();

  const WAIT_INTERVAL = 1000;

  //const ENTER_KEY = 13;

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
    score: number
  }

  // interface SearchData {
  //   songs: Song[];
  // }


  const GET_SEARCH_RESULTS = gql`
  query GetSearchResults($searchText: String!) {
    songBySearchText(searchText: $searchText) {
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

  // use ref to store the timer id
  const refTimer = useRef<number | null>(null);

  const triggerChange = () => {
    //state updates are batched by React which causes a delay. The below gets the true current state.
    setSearchText((state) => {
      setApiSearchText(state);
      getSongs();
      return state;
    });
  }

  useEffect(() => {
    setFocus();
    // cleanup function
    return () => {
      if (refTimer.current !== null) {
        window.clearTimeout(refTimer.current);
      }
    };
  }, []);

  // trigger the timer
  const startTimer = () => {
    if (refTimer.current !== null) return;
    refTimer.current = window.setTimeout(() => {
      triggerChange();
    }, WAIT_INTERVAL);
  };

  // stop the timer
  const stopTimer = () => {
    if (refTimer.current === null) return;
    window.clearTimeout(refTimer.current);
    refTimer.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === 'Enter') {
      triggerChange();
    }
  }

  const handleInputChange = (e: CustomEvent<InputChangeEventDetail>) => {
    stopTimer();
    setSearchText(e.detail.value);
    startTimer();
  };

  const setFocus = () => {
    window.setTimeout(() => {
    const input = document.querySelector("#searchText > input") as HTMLElement;
        if(input != null) {
          input.focus();
        }
    }, 250);
  };

  const [
    getSongs,
    { loading, data }
  ] = useLazyQuery(GET_SEARCH_RESULTS, { variables: { searchText: { apiSearchText } }, onCompleted:  setFocus});

  if (loading) return <p>Loading ...</p>;

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

        {loading && <h1>loading</h1>}

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
              <b>Proof of Concept: Data from Elastic Search. Songs matching text</b>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput id="searchText" name="searchText" placeholder="Enter Search Text" value={searchText} onIonChange={e => { handleInputChange(e) }} onKeyDown={e => { handleKeyDown(e) }}></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <IonButton onClick={() => getSongs()}>Submit</IonButton> */}
            </IonCol>
          </IonRow>

          {data &&
            <div>

              <IonRow>
                <IonCol>
                  Results
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                </IonCol>
              </IonRow>
            </div>
          }
        </IonGrid>





        {data && data.songBySearchText &&
            data.songBySearchText.map((song: Song) => {
            return (
              <IonCard id={song.id.toString()} key={song.id} class="card-center">
                <IonCardContent className="puzzle-content">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Score
                            </IonLabel>
                            <h3>{song.score}</h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Title
                            </IonLabel>
                            <h3><a href={song.link} target='_blank' rel="noreferrer">{song.title}</a></h3>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Band name
                            </IonLabel>
                            <h3>{song.bandName}</h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Song name
                            </IonLabel>
                            <h3>{song.songName}</h3>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>    
                );
            })}
      </IonContent>
    </IonPage>
  );
};

export default Page;
