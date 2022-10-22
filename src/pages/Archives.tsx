import { gql, useLazyQuery } from '@apollo/client';
import { SearchbarChangeEventDetail, IonBadge, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import SongList from '../components/SongList';
import './Archives.css';



const Page: React.FC = () => {

  const [searchText, setSearchText] = useState<string | undefined | null>();

  const [apiSearchText, setApiSearchText] = useState<string | undefined | null>();

  const WAIT_INTERVAL = 1000;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (e.key === 'Enter') {
      triggerChange();
    }
  }

  const handleInputChange = (e: CustomEvent<SearchbarChangeEventDetail>) => {
    stopTimer();
    setSearchText(e.detail.value);
    startTimer();
  };

  const handleSearchbarClear = (e: CustomEvent<void>) => {
    setSearchText('');
    triggerChange();
  };

  const setFocus = () => {
    window.setTimeout(() => {
      const input = document.querySelector("#searchText > div > input") as HTMLElement;
      if (input != null) {
        input.focus();
      }
    }, 250);
  };

  const [
    getSongs,
    { loading, data }
  ] = useLazyQuery(GET_SEARCH_RESULTS, { variables: { searchText: { apiSearchText } }, onCompleted: setFocus });

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

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSearchbar id="searchText" value={searchText} onIonClear={e => { handleSearchbarClear(e) }} onIonChange={e => { handleInputChange(e) }} onKeyDown={e => { handleKeyDown(e) }} placeholder="Enter Search Text"></IonSearchbar>
            </IonCol>
          </IonRow>

          {data &&
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonBadge slot="start">{data.songBySearchText.length}</IonBadge>
                  <IonLabel>Results</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          }
        </IonGrid>

        {
          data && data.songBySearchText
          && <SongList isBullpen={false} songs={data.songBySearchText} />
        }

      </IonContent>
    </IonPage>
  );
};

export default Page;
