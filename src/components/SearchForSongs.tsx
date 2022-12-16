import { useLazyQuery } from '@apollo/client';
import { SearchbarChangeEventDetail, IonBadge, IonCol, IonGrid, IonItem, IonLabel, IonRow, IonSearchbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import FabToSubmit from './FabToSubmit';
import SongList from './SongList';
import { GET_SEARCH_RESULTS } from '../graphql/graphql';
import './SearchForSongs.css';
import { SearchingForSongsProps, Song } from '../common/types';

const SearchForSongs: React.FC<SearchingForSongsProps> = (props) => {

  const [searchText, setSearchText] = useState<string | undefined | null>();

  const [apiSearchText, setApiSearchText] = useState<string | undefined | null>();

  const [displayData, setDisplayData] = useState<Song[]>([]);

  const WAIT_INTERVAL = 1000;

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
  ] = useLazyQuery(GET_SEARCH_RESULTS, {
    variables: { searchText: { apiSearchText } }, onCompleted: (data) => {
      let songs: Song[] = [];
      data.songBySearchText.forEach( (sng: Song)=> {
        songs.push(JSON.parse(JSON.stringify(sng)));
      });
      setDisplayData(songs);

      setFocus();
    }
  });

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonSearchbar id="searchText" value={searchText} onIonClear={e => { handleSearchbarClear(e) }} onIonChange={e => { handleInputChange(e) }} onKeyDown={e => { handleKeyDown(e) }} placeholder="Enter Search Text"></IonSearchbar>
          </IonCol>
        </IonRow>

        {displayData &&
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonBadge slot="start">{displayData.length}</IonBadge>
                <IonLabel>Results</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
        }
      </IonGrid>

      {
        displayData
        && <SongList showId={true} showScore={true} songs={displayData} editCallback={props.editCallback} showEditButton={props.showEditButton} showDeleteButton={false} />
      }
      <FabToSubmit />
    </>
  );
};

export default SearchForSongs;
