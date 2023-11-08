import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import ReactPlayer from 'react-player';
import './Radio.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { useEffect, useState } from 'react';
import ErrorDisplay from '../components/ErrorDisplay';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_BULLPEN_SONGS, GET_MOST_RECENT_SONGS, GET_RANDOM_SONGS, GET_RANDOM_SONGS_BY_USER_ID, GET_SEARCH_RESULTS, GET_SONGS_BY_IDS, GET_USERS_FOR_DROPDOWN } from '../graphql/graphql';
import { BullpenSongData, Song, UserInfo } from '../common/types';
import { role, refreshRole } from '../firebase';
import { getScreenDimensions } from '../common/helper';

const Radio: React.FC = () => {

  const [errorDetail, setErrorDetail] = useState<TypeError>();

  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);

  const [initialSongLoad, setInitialSongLoad] = useState<boolean>(true);

  const [songs, setSongs] = useState<Song[]>([]);

  const [playIndex, setPlayIndex] = useState<number>(0);

  const [playerWidth, setPlayerWidth] = useState<string>();

  const [playerHeight, setPlayerHeight] = useState<string>();

  const [searchPhraseInput, setSearchPhraseInput] = useState<string | number | null | undefined>('');

  const [searchPhrase, setSearchPhrase] = useState<string | number | null | undefined>('');

  const [radioSongs, setRadioSongs] = useState<number[]>([319, 1908, 6203, 346, 6208, 73, 5393, 3101, 4189, 6097, 573, 836, 3277]);

  const [discJockeySelected, setDiscJockeySelected] = useState<string | undefined>("");

  //Bad code, bad developer, bad! I will fix later
  const [userTwoPrivacyOn, setUserTwoPrivacyOn] = useState<boolean>(false);
  const [userThreePrivacyOn, setUserThreePrivacyOn] = useState<boolean>(false);
  const [userFourPrivacyOn, setUserFourPrivacyOn] = useState<boolean>(false);
  const [userFivePrivacyOn, setUserFivePrivacyOn] = useState<boolean>(false);
  const [userSixPrivacyOn, setUserSixPrivacyOn] = useState<boolean>(false);
  const [userSevenPrivacyOn, setUserSevenPrivacyOn] = useState<boolean>(false);
  const [userEightPrivacyOn, setUserEightPrivacyOn] = useState<boolean>(false);
  const [userNinePrivacyOn, setUserNinePrivacyOn] = useState<boolean>(false);

  interface SongVars {
    // year: number;
  }

  // Based on
  // https://github.com/CookPete/react-player/issues/656
  // https://jsfiddle.net/2tr1fshc/

  // Note: local testing resulted with frequent Video Unavailable
  // Fix: had to use my 'pop-os' hostname instead of an ip address in the browser url input.
  // https://stackoverflow.com/questions/51969269/embedded-youtube-video-doesnt-work-on-local-server/51971125#51971125

  useEffect(() => {
    //ration 16:9 (.5625)
    if(getScreenDimensions().width > 2000) {
      setPlayerWidth('900px');
      setPlayerHeight('506px');
    } else if(getScreenDimensions().width > 1000) {
      setPlayerWidth('600px');
      setPlayerHeight('337px');
    } else {
      setPlayerWidth('380px');
      setPlayerHeight('212px');
    }
    if(role === 'GUEST') {
      //includes privacyOn field
      getUsersForDropDown();
    }
    getSongsByIds();
    refreshRole();
  }, []);

  const [
    getLatestSongs,
    { loading: loadingLatest, error: errorLatest, data: dataLatest }
  ] = useLazyQuery(GET_MOST_RECENT_SONGS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: {count: 20}, onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];
      data.getMostRecentSongs.forEach( (sng: Song)=> {
        songsArray.push(JSON.parse(JSON.stringify(sng)));
      });
      setSongs(songsArray);
    },
  });
  
  const [
    getArchiveSongs,
    { loading: loadingSearch, error: errorSearch, data: dataSearch }
  ] = useLazyQuery(GET_SEARCH_RESULTS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { searchText:  searchPhrase }, onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];
      data.songBySearchText.forEach( (sng: Song)=> {
        songsArray.push(JSON.parse(JSON.stringify(sng)));
      });
      setSongs(songsArray);
    }
  });

  const [
    getRandomSongs,
    { loading, error, data }
  ] = useLazyQuery(GET_RANDOM_SONGS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: {count: 20}, onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];
      data.getRandomSongs.forEach( (sng: Song)=> {
        songsArray.push(JSON.parse(JSON.stringify(sng)));
      });
      setSongs(songsArray);
    },
  });

  const [
    getSongsByIds,
    { loading: loadingByIds, error: errorByIds, data: dataByIds }
  ] = useLazyQuery(GET_SONGS_BY_IDS, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: {songIds: radioSongs}, onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];

      //Sort "Radio" songs
      var arrayLength = radioSongs.length;
      for (var i = 0; i < arrayLength; i++) {
        data.getSongsByIds.forEach( (sng: Song)=> {
          if(sng.id == radioSongs[i]) {
            songsArray.push(JSON.parse(JSON.stringify(sng)));
          }
        });
      }
      setSongs(songsArray);
    },
  });

  const [
    getBpSongs,
    { loading: loadingBp, error: errorBp, data: dataBp }
  ] =  useLazyQuery<BullpenSongData, SongVars>(GET_ALL_BULLPEN_SONGS, 
    {fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];
      data.getAllBullpenSongs.forEach( (sng: Song)=> {
        songsArray.push(JSON.parse(JSON.stringify(sng)));
      });
      setSongs(songsArray);
    },
  });

  useEffect(() => {
    if(discJockeySelected == '0') {
      if(initialSongLoad) {
        setInitialSongLoad(false);
      } else {
        getRandomSongs();
      }
    }
    getRandomSongsByUserId();
  }, [discJockeySelected]);

  const [
    getRandomSongsByUserId,
    { loading: loadingRndSngUsr, error: errorRndSngUsr, data: dataRndSngUsr }
  ] = useLazyQuery(GET_RANDOM_SONGS_BY_USER_ID, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { userId: discJockeySelected, count: 20}, onCompleted: (data) => {
      setPlayIndex(0);
      let songsArray: Song[] = [];
      data.getRandomSongsByUserId.forEach( (sng: Song)=> {
        songsArray.push(JSON.parse(JSON.stringify(sng)));
      });
      setSongs(songsArray);
    },
  });

  const nextVideo = () => {
  	setPlayIndex(playIndex + 1);
  }

  const errorCondition = () => {
    console.log("An Error occurred moving to the next video");
    setPlayIndex(playIndex + 1);
  }

  const clearSearch = () => {
    setSearchPhraseInput("");
  }

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>WSOD Radio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">WSOD Radio</IonTitle>
          </IonToolbar>
        </IonHeader>
          {
            errorDetail != null ? <ErrorDisplay message={errorDetail.message} detail={errorDetail.stack} /> :
          <IonGrid className='radio'>

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
              <IonCol className='player-col'>
                <div className="video-wrapper">
                {/* width='380px' height='212px'  */}
                  {(songs[playIndex]) &&
                      <ReactPlayer url={(songs[playIndex]).link} 
                      controls={true} 
                      playing={videoPlaying} 
                      onEnded={nextVideo} 
                      onError={errorCondition} 
                      width={playerWidth} 
                      height={playerHeight} 
                      onPlay={() => {
                        setVideoPlaying(true);
                      }} />
                  }
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className='song-info-col'>
                {(songs[playIndex]) &&
                  <>
                    <IonRow>
                      <IonCol>
                        <div className='radio-song-title'>{(songs[playIndex]).bandName}  -  {(songs[playIndex]).songName} </div>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        {(role !== 'GUEST' || !(songs[playIndex]).privacyOn) &&
                          <>
                           {(songs[playIndex]).userFirstName == 'David' ? <div>{(songs[playIndex]).userFirstName} {((songs[playIndex]).userLastName)?.charAt(0)}.</div> : <div>{(songs[playIndex]).userFirstName}</div>}
                          </>
                        }
                        {role === 'GUEST' && (songs[playIndex]).privacyOn &&
                          <div>User {(songs[playIndex]).userId}</div>
                        }
                      </IonCol>
                    </IonRow>
                  </>
                }
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="select-column">
                <div className="dj-options-row">
                  <IonItem className="submitter-select-item">
                    <IonLabel>Submitted by:</IonLabel>
                    <IonSelect
                        className="submitter-select"
                        aria-label="Submitter"
                        interface="popover"
                        onIonChange={(e) => {setDiscJockeySelected(e.detail.value); clearSearch()}} value={discJockeySelected}>
                      <IonSelectOption value="">Select DJ</IonSelectOption>    
                      <IonSelectOption value="0">DJ All</IonSelectOption>
                      <IonSelectOption value="6">DJ {userSixPrivacyOn?'User 6':'Brian'}</IonSelectOption>
                      <IonSelectOption value="8">DJ {userEightPrivacyOn?'User 8':'Dave B.'}</IonSelectOption>
                      <IonSelectOption value="9">DJ {userNinePrivacyOn?'User 9':'Dave R.'}</IonSelectOption>
                      <IonSelectOption value="5">DJ {userFivePrivacyOn?'User 5':'Doug'}</IonSelectOption>
                      <IonSelectOption value="2">DJ {userTwoPrivacyOn?'User 2':'Kevin'}</IonSelectOption>
                      <IonSelectOption value="3">DJ {userThreePrivacyOn?'User 3':'Lisa'}</IonSelectOption>
                      <IonSelectOption value="7">DJ {userSevenPrivacyOn?'User 7':'Mike'}</IonSelectOption>
                      <IonSelectOption value="4">DJ {userFourPrivacyOn?'User 4':'Tim'}</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <hr/>
              </IonCol>
            </IonRow>
            <IonRow>  
            <IonCol size-xl="5" size-lg="4.5" size-md="4" size-sm="4" size-xs="2.5">
              </IonCol>    
              <IonCol size-xl="2" size-lg="3" size-md="4"  size-sm="4" size-xs="7">
                <IonButton className="radio-latest ion-text-wrap" fill="clear" expand="block" onClick={(event) => {
                      setDiscJockeySelected("");
                      clearSearch();
                      getLatestSongs();
                    }}>
                  Latest Songs
                </IonButton>
              </IonCol>
              <IonCol size-xl="5" size-lg="4.5" size-md="4" size-sm="4" size-xs="2.5">
              </IonCol>
              <hr/> 
            </IonRow>
            <IonRow>
              <IonCol size-xl="5" size-lg="4.5" size-md="4" size-sm="4" size-xs="2.5">
              </IonCol>    
              <IonCol size-xl="2" size-lg="3" size-md="4"  size-sm="4" size-xs="7">
                <IonButton className="radio-bullpen ion-text-wrap" fill="clear" expand="block" onClick={(event) => {
                      getBpSongs();
                      setDiscJockeySelected("");
                      clearSearch();
                    }}>
                  My Bullpen Songs
                </IonButton>

              </IonCol>
              <IonCol size-xl="5" size-lg="4.5" size-md="4" size-sm="4" size-xs="2.5">
              </IonCol> 
              <hr/>
            </IonRow>
            <IonRow>   
              <IonCol>
                <IonRow>
                  <IonCol size-md="4.5" size-xs="1">
                  </IonCol>  
                  <IonCol size-md="2" size-xs="7">
                    <IonItem>
                      <IonInput
                          className="url"
                          maxlength={100}
                          value={searchPhraseInput}
                          onIonInput={(e) => {setSearchPhraseInput((e.target as HTMLIonInputElement).value);}}
                          placeholder="Allman Brothers"
                          required
                          clear-input>
                        </IonInput>
                    </IonItem>
                  </IonCol>
                  <IonCol size-md="1" size-xs="3">
                    <IonButton className="archive-search ion-text-wrap" fill="clear" expand="block" onClick={(event) => {
                        setDiscJockeySelected("");
                        setSearchPhrase(searchPhraseInput);
                        getArchiveSongs();
                      }}>
                      Search
                    </IonButton>
                  </IonCol>
                  <IonCol size-md="4.5" size-xs="1">
                  </IonCol>  
                </IonRow>

              </IonCol>
            </IonRow>
          </IonGrid>
          }
          <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Radio;
