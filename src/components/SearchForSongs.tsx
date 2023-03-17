import { useLazyQuery } from '@apollo/client';
import { SearchbarChangeEventDetail, IonBadge, IonCol, IonGrid, IonItem, IonLabel, IonRow, IonSearchbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import FabToSubmit from './FabToSubmit';
import SongList from './SongList';
import { GET_SEARCH_RESULTS } from '../graphql/graphql';
import './SearchForSongs.css';
import { SearchingForSongsProps, Song } from '../common/types';
import { useHistory, useLocation } from 'react-router';
import ErrorDisplay from './ErrorDisplay';

const SearchForSongs: React.FC<SearchingForSongsProps> = (props) => {

  const [searchText, setSearchText] = useState<string | undefined | null>();

  const [apiSearchText, setApiSearchText] = useState<string | undefined | null>();

  const [displayData, setDisplayData] = useState<Song[]>([]);

  const WAIT_INTERVAL = 1000;

  const history = useHistory();

  const location = useLocation();

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

    //Add listener: When page visited again reload songs
    const unlisten = history.listen(() => {
      if (history.location.pathname === location.pathname) {
        getSongs();
      }
    });
    return () => {
      // unlisten() will be called when the component unmounts, prevents memory leaks.
      unlisten();
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      triggerChange();
    }, WAIT_INTERVAL)

    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout)
  }, [searchText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (e.key === 'Enter') {
      triggerChange();
    }
  }

  const handleInputChange = (e: CustomEvent<SearchbarChangeEventDetail>) => {
    setSearchText(e.detail.value);
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
    { loading, error, data }
  ] = useLazyQuery(GET_SEARCH_RESULTS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
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
            <IonSearchbar id="searchText" onIonClear={e => { handleSearchbarClear(e) }} onIonChange={e => { handleInputChange(e) }} onKeyDown={e => { handleKeyDown(e) }} placeholder="Enter Search Text"></IonSearchbar>
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
        error != null ? <ErrorDisplay message={error.message} detail={error.stack} /> :
        displayData
        && <SongList showId={true} showScore={true} songs={displayData} editCallback={props.editCallback} showEditButton={props.showEditButton} showDeleteButton={false} />
      }
      <FabToSubmit />
    </>
  );
};

export default SearchForSongs;
