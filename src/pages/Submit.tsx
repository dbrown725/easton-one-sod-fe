import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import './Submit.css';
import { Song, SubmitProps } from '../common/types';
import SongForm from '../components/SongForm';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { ADD_BULLPEN_SONG, DELETE_BULLPEN_SONG, GET_SONGS_WITH_ISSUES_COUNT, INSERT_SOD, UPDATE_BULLPEN_SONG, UPDATE_SOD } from '../graphql/graphql';
import { useDispatch } from 'react-redux';
import { setIssueCount } from '../store/slices/issueCountSlice';

const Submit: React.FC<SubmitProps> = (props) => {

  const history = useHistory();

  const [insertSod, { data: sodInsertData, loading: sodInsertLoading, error: sodInsertError }] = useMutation(INSERT_SOD);

  const [updateSod, { data: sodUpdateData, loading: sodUpdateLoading, error: sodUpdateError }] = useMutation(UPDATE_SOD);

  const [addBpSong, { data: bpData, loading: bpLoading, error: bpError }] = useMutation(ADD_BULLPEN_SONG);

  const [updateBPSong, { data: updateBpData, loading: updateBpLoading , error: updateBpError }] = useMutation(UPDATE_BULLPEN_SONG);

  const [deleteBPSong, { data: deleteData, loading: deleteLoading , error: deleteError }] = useMutation(DELETE_BULLPEN_SONG);

  const location = useLocation<{ song: Song, updateSODRequest: boolean }>();

  const [presentAlert] = useIonAlert();

  const [updateSODRequest, setUpdateSODRequest] = useState<boolean>();

  const dispatch = useDispatch();

  const [song, setSong] = useState<Song>({
      id: 0,
      bandName: '',
      songName: '',
      title: '',
      link: '',
      message: '',
      playlist: '',
      userIsTheSubmitter: false
    });


  const clearSong = () => {
    setSong({
      id: 0,
      bandName: '',
      songName: '',
      title: '',
      link: '',
      message: '',
      playlist: '',
      userIsTheSubmitter: false
    });
  }

  useEffect(() => {
    if(location.state){
      if(location.state.song) {
        setSong(location.state.song);
      }
      setUpdateSODRequest(location.state.updateSODRequest);
    }
  }, [location.state]);

  //bpLoading && console.log("....bpLoading");
  bpError && console.log("error: ", bpError);
  //bpData && console.log("data: ", bpData);

  //sodInsertLoading && console.log("....sodInsertLoading");
  sodInsertError && console.log("error: ", sodInsertError);
  //sodInsertData && console.log("data: ", sodInsertData);

  //sodUpdateLoading && console.log("....sodUpdateLoading");
  sodUpdateError && console.log("error: ", sodUpdateError);
  //sodUpdateData && console.log("data: ", sodUpdateData);

  // deleteLoading && console.log("....deleteLoading");
  deleteError && console.log("deleteError: ", deleteError);
  // deleteData && console.log("deleteData: ", deleteData);

  const handleBpFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    //song.userId = 1;
    if(song.id) {
      updateBPSong({ variables: { id: song.id, title: song.title, 
        songName: song.songName, bandName: song.bandName, 
        link: song.link, message: song.message, 
        sortOrder: song.sortOrder } });
    } else {
      addBpSong({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message } });
    }
    clearSong();
  };

  const handleSODInsertFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    //song.userId = 1;
    insertSod({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, playlist: song.playlist } });
    
    if(song.id) {
      deleteBPSong({ variables: { id: song.id } });
    }
    clearSong();
  };

  const [
    getIssueCount,
    { loading: countLoading, error: countError, data: countData }
  ] = useLazyQuery(GET_SONGS_WITH_ISSUES_COUNT, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      dispatch(setIssueCount(data.getSongsWithIssuesCount));
    },
  });

  // countLoading && console.log("....countLoading");
  countError && console.log("countError: ", countError);
    // countData && console.log("countData: ", countData);

  const handleSODUpdateFormSubmit = () => {
    updateSod({ variables: { id: song.id, title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, playlist: song.playlist }, onCompleted: (data) => {
      getIssueCount();
    }, });
    clearSong();
  };

  const handleSODCancelUpdateFormSubmit = () => {
    clearSong();
    history.push({pathname:'/page/Repair'});
  };

  useEffect(() => {
    sodInsertData && showSodInsertAlert();
  }, [sodInsertData]);

  useEffect(() => {
    sodUpdateData && showSodUpdateAlert();
  }, [sodUpdateData]);

  useEffect(() => {
    bpData && showBpAlert();
  }, [bpData]);

  useEffect(() => {
    updateBpData && showBpAlert();
  }, [updateBpData]);

  const showBpAlert = () => {
    presentAlert({
      header: 'Your save to Bullpen is complete.',
      buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              history.push({pathname:'/page/Bullpen'})
            },
          },
        ]
      });
    };

  const showSodInsertAlert = () => {
    presentAlert({
      header: 'Your Song submission is complete.',
      buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              history.push({pathname:'/page/Latest'})
            },
          },
        ]
      });
    }; 

  const showSodUpdateAlert = () => {
    presentAlert({
      header: 'Your Song update is complete.',
      buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              history.push({pathname:'/page/Repair'})
            },
          },
        ]
      });
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Submit a song</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Submit</IonTitle>
            </IonToolbar>
          </IonHeader>
          <SongForm
            bpCallback={handleBpFormSubmit}
            sodInsertCallback={handleSODInsertFormSubmit}
            sodUpdateCallback={handleSODUpdateFormSubmit}
            sodCancelUpdateCallback={handleSODCancelUpdateFormSubmit}
            song={song}
            updateSODRequest={updateSODRequest}></SongForm>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
