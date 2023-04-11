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

  const [bandStats, setBandStats] = useState<BandStats[]>([]);

  const [clearClicked, setClearClicked] = useState<boolean>(false);

  const [enterPressed, setEnterPressed] = useState<boolean>(false);

  const [bubbleDivId, setBubbleDivId] = useState<string | undefined>();

  const [showZeroResults, setShowZeroResults] = useState<boolean>(false);

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
    cleanAndSetSearchText(bandName);
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
    if(searchText == "") {
      setDisplayData([]);
    } else {
      triggerChange();
    }
  }, [searchText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (e.key === 'Enter') {
      setEnterPressed(true);
      clearTimeout(refTimer.current);
      cleanAndSetSearchText(inputValue);
      triggerChange();
    }
  }

  const handleInputChange = (e: CustomEvent<SearchbarChangeEventDetail>) => {
    
    clearTimeout(refTimer.current);
    setInputValue(e.detail.value);

    if(clearClicked || enterPressed) {
      setClearClicked(false);
      setEnterPressed(false);
    } else {
      refTimer.current = window.setTimeout(() => {
        cleanAndSetSearchText(e.detail.value);
      }, 2000);
    }
  };

  const cleanAndSetSearchText = ((rawSearchText: string | undefined | null) => {
    var clean = rawSearchText;
    if(rawSearchText?.toLowerCase().includes("the the") == false
        &&
        rawSearchText?.toLowerCase().includes("the ") == true
        ) {
          if(rawSearchText.startsWith("the ")) {
            clean = rawSearchText?.replace("the ", "");
          } else {
            clean = rawSearchText?.replace("The ", "");
          }
    }
    setSearchText(clean);
  })

  const handleSearchbarClear = (e: CustomEvent<void>) => {
    setClearClicked(true);
    setSearchText('');
    setInputValue('');
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
      if(songs.length == 0) {
        setShowZeroResults(true);
        window.setTimeout(() => {
          setShowZeroResults(false);
        }, 5000);

      }

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

        {(displayData.length > 0 || showZeroResults) &&
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
