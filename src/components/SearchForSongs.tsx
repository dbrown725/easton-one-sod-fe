import { useLazyQuery } from '@apollo/client';
import { SearchbarChangeEventDetail, IonBadge, IonCol, IonGrid, IonItem, IonLabel, IonRow, IonSearchbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import FabToSubmit from './FabToSubmit';
import SongList from './SongList';
import { GET_BAND_STATS, GET_SEARCH_RESULTS } from '../graphql/graphql';
import './SearchForSongs.css';
import { BandStats, SearchingForSongsProps, Song } from '../common/types';
import { useHistory, useLocation } from 'react-router';
import ErrorDisplay from './ErrorDisplay';
import { BuildSVG } from './BubbleChart';

const SearchForSongs: React.FC<SearchingForSongsProps> = (props) => {

  const [searchText, setSearchText] = useState<string | undefined | null>();

  const [apiSearchText, setApiSearchText] = useState<string | undefined | null>();

  const [displayData, setDisplayData] = useState<Song[]>([]);

  const [inputValue, setInputValue] = useState<string | undefined | null>();

  const refTimer = useRef<number | undefined>(undefined);

  const refTimerTrigger = useRef<number | undefined>(undefined);

  const [bandStats, setBandStats] = useState<BandStats[]>([]);

  const [bubbleDivId, setBubbleDivId] = useState<string | undefined>();

  const history = useHistory();

  const location = useLocation();

  const [
    getBandStatsList,
    { loading: bsLoading, error: bsError, data: bsData }
  ] = useLazyQuery(GET_BAND_STATS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { count: 100 }, onCompleted: (data) => {
      let bandStats: BandStats[] = [];
      data.getBandStats.forEach( (bs: BandStats)=> {
        bandStats.push(JSON.parse(JSON.stringify(bs)));
      });
      setBandStats(bandStats);
      loadBubbleChartSVG();
    },
  });

  const svgCallback = (bandName: string) => {
    setInputValue(bandName);
  }

  const triggerChange = () => {
    //state updates are batched by React which causes a delay. The below gets the true current state.
    setSearchText((state) => {
      if(state == null) {
        state = "";
      }
      setApiSearchText(state);
      getSongs();
      return state;
    });
  }

  const loadBubbleChartSVG = (() => {
    setBandStats((state) => {
      const id = "bubbleChart" + Math.floor(Date.now() / 1000);
      setBubbleDivId(id);
      const timeout = setTimeout(() => {
        const bandStatsArray: Object[] = [];
        state.forEach(function (bs, index) {
          const obj = { id: bs.bandName, value: bs.songCount };
          bandStatsArray.push(obj);
        })
        if (bandStatsArray.length > 0) {
          BuildSVG(id, bandStatsArray, svgCallback);
        }
      }, 500, state);
      return state;
    });
  });

  useEffect(() => {
    setFocus();
    getBandStatsList();

    //Add listener: When page visited again reload songs
    const unlisten = history.listen(() => {
      if (history.location.pathname === location.pathname) {
        getSongs();
        getBandStatsList();
      }
    });
    return () => {
      // unlisten() will be called when the component unmounts, prevents memory leaks.
      unlisten();
    }
  }, []);

  useEffect(() => {
    refTimerTrigger.current = window.setTimeout(() => {
      triggerChange();
    }, 1000);

    // if this effect run again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(refTimerTrigger.current);
  }, [searchText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (e.key === 'Enter') {
      triggerChange();
    }
  }

  const handleInputChange = (e: CustomEvent<SearchbarChangeEventDetail>) => {
    setInputValue(e.detail.value);
    clearTimeout(refTimer.current);
    clearTimeout(refTimerTrigger.current);

    refTimer.current = window.setTimeout(() => {
      var clean = e.detail.value;
      if(e.detail.value?.toLowerCase().includes("the the") == false
          &&
          e.detail.value?.toLowerCase().includes("the ") == true
          ) {
            clean = e.detail.value?.replace("The ", "");
      }
      setSearchText(clean);
    }, 2000);
  };

  const handleSearchbarClear = (e: CustomEvent<void>) => {
    setSearchText('');
    setInputValue('');
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
    variables: { searchText:  apiSearchText }, onCompleted: (data) => {
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
            <IonSearchbar id="searchText" value = {inputValue} onIonClear={e => { handleSearchbarClear(e) }} onIonChange={e => { handleInputChange(e) }} onKeyDown={e => { handleKeyDown(e) }} placeholder="Whole word match: 'Stone' and 'Stones' return very different results."></IonSearchbar>
          </IonCol>
        </IonRow>

        {displayData.length > 0 &&
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

      <div className="bubbleChart" id={bubbleDivId} style={{display: displayData.length == 0 ? '' : 'none' }}></div>

      <FabToSubmit />
    </>
  );
};

export default SearchForSongs;
