import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import './Submit.css';
import { Song, SubmitProps } from '../common/types';
import SongForm from '../components/SongForm';
import { useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { ADD_BULLPEN_SONG, INSERT_SOD, UPDATE_BULLPEN_SONG } from '../graphql/graphql';

const Submit: React.FC<SubmitProps> = (props) => {

  const history = useHistory();

  const [insertSod, { data: sodData, loading: sodLoading, error: sodError }] = useMutation(INSERT_SOD);

  const [addBpSong, { data: bpData, loading: bpLoading, error: bpError }] = useMutation(ADD_BULLPEN_SONG);

  const [updateBPSong, { data: updateBpData, loading: updateBpLoading , error: updateBpError }] = useMutation(UPDATE_BULLPEN_SONG);

  const location = useLocation<{ song: Song }>();

  const [presentAlert] = useIonAlert();

  const [song, setSong] = useState<Song>({
      bandName: 'test',
      songName: '',
      title: '',
      link: '',
      message: '',
      playlist: '',
      userId: 1
    });

  useEffect(() => {
    if(location.state){
      if(location.state.song) {
        setSong(location.state.song);
      }
    }
  }, [location.state]);

  //bpLoading && console.log("....bpLoading");
  bpError && console.log("error: ", bpError);
  //bpData && console.log("data: ", bpData);

  //sodLoading && console.log("....sodLoading");
  sodError && console.log("error: ", sodError);
  //sodData && console.log("data: ", sodData);

  const handleBpFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    //song.userId = 1;
    if(song.id) {
      updateBPSong({ variables: { id: song.id, title: song.title, 
        songName: song.songName, bandName: song.bandName, 
        link: song.link, message: song.message, 
        sortOrder: song.sortOrder } });
    } else {
      addBpSong({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, userId: song.userId } });
    }
  };

  const handleSODFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    //song.userId = 1;
    insertSod({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, playlist: song.playlist, userId: song.userId } });
    
  };

  useEffect(() => {
    sodData && showSodAlert();
  }, [sodData]);

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

  const showSodAlert = () => {
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
          <SongForm bpCallback={handleBpFormSubmit} sodCallback={handleSODFormSubmit} song={song}></SongForm>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
