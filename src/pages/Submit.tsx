import { IonAlert, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Submit.css';
import { Song, SubmitProps } from '../common/types';
import SongForm from '../components/SongForm';
import { useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { ADD_BULLPEN_SONG, INSERT_SOD, UPDATE_BULLPEN_SONG } from '../graphql/graphql';

const Submit: React.FC<SubmitProps> = (props) => {

  const history = useHistory();

  const [showBpAlert, setShowBpAlert] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [addBpSong, { data: bpData, loading: bpLoading, error: bpError }] = useMutation(ADD_BULLPEN_SONG);

  const [insertSod, { data, loading, error }] = useMutation(INSERT_SOD);

  const [updateBPSong, { data: updateBpData, loading: updateBpLoading , error: updateBpError }] = useMutation(UPDATE_BULLPEN_SONG);

  const location = useLocation<{ song: Song }>();

  const [song, setSong] = useState<Song>({
      bandName: 'test',
      songName: '',
      title: '',
      link: '',
      message: '',
      playlist: ''
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

  //loading && console.log("....loading");
  error && console.log("error: ", error);
  //data && console.log("data: ", data);

  const handleBpFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    song.userId = 1;

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
    song.userId = 1;
    insertSod({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, playlist: song.playlist, userId: song.userId } });
    
  };

  useEffect(() => {
    data && setShowAlert(true);
  }, [data]);

  useEffect(() => {
    bpData && setShowBpAlert(true);
  }, [bpData]);

  useEffect(() => {
    updateBpData && setShowBpAlert(true);
  }, [updateBpData]);

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
          <IonAlert
            isOpen={showBpAlert}
            onDidDismiss={() => {setShowBpAlert(false); history.push({pathname:'/page/Bullpen'})}}
            header=""
            subHeader="Congrats!"
            message="Your save to Bullpen is complete."
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {setShowAlert(false); history.push({pathname:'/page/Latest'})}}
            header=""
            subHeader="Congrats!"
            message="Your Song submission is complete."
            buttons={['OK']}
          />
          <SongForm bpCallback={handleBpFormSubmit} sodCallback={handleSODFormSubmit} song={song}></SongForm>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
