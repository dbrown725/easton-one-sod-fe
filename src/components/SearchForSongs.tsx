import { useLazyQuery } from '@apollo/client';
import { SearchbarChangeEventDetail, IonBadge, IonCol, IonGrid, IonItem, IonLabel, IonRow, IonSearchbar, IonButton, IonSelect, IonSelectOption, IonToggle, ToggleChangeEventDetail } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import FabToSubmit from './FabToSubmit';
import SongList from './SongList';
import { GET_BAND_STATS, GET_SEARCH_RESULTS, GET_USERS_FOR_DROPDOWN } from '../graphql/graphql';
import './SearchForSongs.css';
import { BandStats, SearchingForSongsProps, Song, UserInfo } from '../common/types';
import { useHistory, useLocation } from 'react-router';
import ErrorDisplay from './ErrorDisplay';
import { BuildSVG } from './BubbleChart';
import { role, refreshRole } from '../firebase';

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

  const [submitterSelected, setSubmitterSelected] = useState<string | undefined>("0");

  const [showBubbles, setShowBubbles] = useState<boolean>(false);

  //Bad code, bad developer, bad! I will fix later
  const [userTwoPrivacyOn, setUserTwoPrivacyOn] = useState<boolean>(false);
  const [userThreePrivacyOn, setUserThreePrivacyOn] = useState<boolean>(false);
  const [userFourPrivacyOn, setUserFourPrivacyOn] = useState<boolean>(false);
  const [userFivePrivacyOn, setUserFivePrivacyOn] = useState<boolean>(false);
  const [userSixPrivacyOn, setUserSixPrivacyOn] = useState<boolean>(false);
  const [userSevenPrivacyOn, setUserSevenPrivacyOn] = useState<boolean>(false);
  const [userEightPrivacyOn, setUserEightPrivacyOn] = useState<boolean>(false);
  const [userNinePrivacyOn, setUserNinePrivacyOn] = useState<boolean>(false);

  const history = useHistory();

  const location = useLocation();

  const maxNumberOfBubbles = 50;

  const [
    getBandStatsList,
    { loading: bsLoading, error: bsError, data: bsData }
  ] = useLazyQuery(GET_BAND_STATS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { count: 1000, userId: submitterSelected}, onCompleted: (data) => {
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
      if(!state) {
        state = "";
      }
      setApiSearchText(state);
      if(state.length > 0) {
        getSongs();
      }
      return state;
    });
  }

  const loadBubbleChartSVG = (() => {
    setBandStats((state) => {
      const id = "bubbleChart" + Math.floor(Date.now() / 1000);
      setBubbleDivId(id);
      const timeout = setTimeout(() => {
        const bandStatsArray: Object[] = [];
        for (var i = 0; i < state.length; i++) {
          if(bandStatsArray.length == maxNumberOfBubbles) {
            break;
          }
          const obj = { id: state[i].bandName, value: state[i].songCount };
          bandStatsArray.push(obj);
        }
        if (bandStatsArray.length > 0) {
          BuildSVG(id, bandStatsArray, svgCallback);
        }
      }, 500, state);
      return state;
    });
  });

  useEffect(() => {
    refreshRole();
    setFocus();
    getBandStatsList();
    if(role === 'GUEST') {
      //includes privacyOn field
      getUsersForDropDown();
    }
    //Add listener: When page visited again reload songs
    const unlisten = history.listen(() => {
      if (history.location.pathname === location.pathname) {
        triggerChange();
        getBandStatsList();
      }
    });
    return () => {
      // unlisten() will be called when the component unmounts, prevents memory leaks.
      unlisten();
    }
  }, []);

  useEffect(() => {
    if(searchText === "") {
      setDisplayData([]);
      setApiSearchText("");
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
      if(apiSearchText && songs.length === 0) {
        setShowZeroResults(true);
        window.setTimeout(() => {
          setShowZeroResults(false);
        }, 5000);
      }

      setFocus();
    }
  });

  const [
    getUsersForDropDown,
    { loading: laodingUsers, error: errorUsers, data: dataUsers }
  ] = useLazyQuery(GET_USERS_FOR_DROPDOWN, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: {}, onCompleted: (data) => {
      data.getUsersForDropDown.map((userInfo:UserInfo)  => {
          var userId:Number = userInfo.id;
          if(userInfo.id == 2) {
            setUserTwoPrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 3) {
            setUserThreePrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 4) {
            setUserFourPrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 5) {
            setUserFivePrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 6) {
            setUserSixPrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 7) {
            setUserSevenPrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 8) {
            setUserEightPrivacyOn(userInfo.privacyOn);
          }
          if(userInfo.id == 9) {
            setUserNinePrivacyOn(userInfo.privacyOn);
          }
        }
      );
    }
  });

  const toggleInputChange = (e: CustomEvent<ToggleChangeEventDetail>) => {
    setShowBubbles(!showBubbles);
  };

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonSearchbar
              id="searchText"
              value = {inputValue}
              onIonClear={e => { handleSearchbarClear(e) }}
              onIonInput={e => { handleInputChange(e) }}
              onKeyDown={e => { handleKeyDown(e) }}
              placeholder="Whole word match: Stone and Stones return very different results.">
            </IonSearchbar>
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
        && <SongList
              showId={true}
              showScore={true}
              songs={displayData}
              editCallback={props.editCallback}
              showEditButton={props.showEditButton}
              showDeleteButton={false}
              closeModalCallback={() => getSongs()}/>
      }

      {displayData.length == 0 &&
        <div className="bandstats-options-row">
          <IonItem className="submitter-select-item">
            <IonLabel>Submitted by:</IonLabel>
            <IonSelect
                className="submitter-select"
                aria-label="Submitter"
                interface="popover"
                onIonChange={(e) => setSubmitterSelected(e.detail.value)} value={submitterSelected}>
              <IonSelectOption value="0">All</IonSelectOption>
              <IonSelectOption value="6">{userSixPrivacyOn?'User 6':'Brian'}</IonSelectOption>
              <IonSelectOption value="8">{userEightPrivacyOn?'User 8':'Dave B.'}</IonSelectOption>
              <IonSelectOption value="9">{userNinePrivacyOn?'User 9':'Dave R.'}</IonSelectOption>
              <IonSelectOption value="5">{userFivePrivacyOn?'User 5':'Doug'}</IonSelectOption>
              <IonSelectOption value="2">{userTwoPrivacyOn?'User 2':'Kevin'}</IonSelectOption>
              <IonSelectOption value="3">{userThreePrivacyOn?'User 3':'Lisa'}</IonSelectOption>
              <IonSelectOption value="7">{userSevenPrivacyOn?'User 7':'Mike'}</IonSelectOption>
              <IonSelectOption value="4">{userFourPrivacyOn?'User 4':'Tim'}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className="show-bubble-chart-toggle">
            <IonLabel>Show Bubbles</IonLabel>
            <IonToggle aria-label="archive toggle" slot="end" checked={showBubbles} onIonChange={e => { toggleInputChange(e) }}></IonToggle>
          </IonItem>
        </div>
      }

      <div className="bubbleChart" id={bubbleDivId} style={{display: displayData.length == 0 && showBubbles ? '' : 'none' }}></div>

      {displayData.length == 0 &&
        <>
        <div className="bandstats-grid-label">
          Top 1000 Bands
        </div>
        <IonGrid className="bandstats-grid">
          <IonRow>
            {
              bandStats.map((bandStats: BandStats, index) => {
                return (
                  <IonCol size="6" size-md="4" size-xl="3" key={index}>
                      <IonButton className="ion-text-wrap" fill="clear" expand="block" onClick={(event) => {
                            cleanAndSetSearchText(bandStats.bandName);
                            setInputValue(bandStats.bandName);
                          }}>
                        {bandStats.bandName + ' - ' + bandStats.songCount}
                      </IonButton>
                  </IonCol>
                );
              })
            }
          </IonRow>
        </IonGrid>
        </>
      }

      <FabToSubmit />
    </>
  );
};

export default SearchForSongs;