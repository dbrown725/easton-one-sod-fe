import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonRow, IonTextarea } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import {Song, SongFormProps} from '../common/types';
import DOMPurify from 'dompurify';
import { useHistory, useLocation } from 'react-router';

const SongForm: React.FC<SongFormProps> = (props) => {

  const playlistName = 'Clam Strip Night!';
  const [id, setId] = useState<number | null | undefined>();
  const [message, setMessage] = useState<string | null | undefined>('');
  const [title, setTitle] = useState<string | number | null | undefined>('');
  const [bandName, setBandName] = useState<string |number | null | undefined>('');
  const [songName, setSongName] = useState<string | number | null | undefined>('');
  const [link, setLink] = useState<string | number |null | undefined>('');
  const [playlist, setPlaylist] = useState<string | number |null | undefined>(playlistName);
  const location = useLocation<{ song: Song }>();
  const history = useHistory();

  // Start logic related to clearing form when user navigates away without submitting.
  // There must be an easier way.
  const [previousPathname, setPreviousPathname] = useState<string>('');
  const myStateRef = useRef(previousPathname);
  const setMyState = (data: string) => {
    myStateRef.current = data;
    setPreviousPathname(data);
  };

  useEffect(() => {
    setMyState(location.pathname);
    const unlisten = history.listen((location) => {
      //myStateRef.current is the previous page
      //clear everything if you just left /page/Submit
      if(myStateRef.current === '/page/Submit') {
        clearForm();
        clearState();
      }
      setMyState(location.pathname);
    })
    return function cleanup() {
      unlisten()
    }
  }, [])
  // End logic related to clearing form when user navigates away without submitting.

  useEffect(() => {
    if(location.state){
      if(location.state.song) {
        setId(location.state.song.id);
        if(location.state.song.message) {
          setMessage(location.state.song.message);
        }
        setTitle(location.state.song.title);
        setBandName(location.state.song.bandName);
        setSongName(location.state.song.songName);
        setLink(location.state.song.link);
        if(location.state.song.playlist) {
          setPlaylist(location.state.song.playlist);
        } else {
          setPlaylist(playlistName);
        }
      }
    }
  }, [location.state]);

  const sanitizeData = (dirty: string) => {
    const clean = DOMPurify.sanitize(dirty, {
      //options
    });
    return clean;
  }

  const submitData = async (buttonIdentifier: String) => {
    if((!title || !bandName || !songName || !link) &&
      buttonIdentifier !== 'cancelUpdateSodSong' && buttonIdentifier !== 'cancelNewOrBPSong') {
      return;
    }
    props.song.message = sanitizeData(String(message));
    props.song.title = sanitizeData(String(title));
    props.song.bandName = sanitizeData(String(bandName));
    props.song.songName = sanitizeData(String(songName));
    props.song.link = sanitizeData(String(link));
    props.song.playlist = sanitizeData(String(playlist));

    if(buttonIdentifier === 'newSodSong') {
      await props.sodInsertCallback();
    } else if(buttonIdentifier === 'updateSodSong') {
      await props.sodUpdateCallback();
    } else if(buttonIdentifier === 'cancelUpdateSodSong') {
      await props.sodCancelUpdateCallback();
    } else if(buttonIdentifier === 'bullpenSong') {
      await props.bpCallback();
    } else if(buttonIdentifier === 'cancelNewOrBPSong') {
      history.goBack();
    } else {
      console.log('fell through');
    }
    clearForm();
    clearState();
  };

  const clearForm = () => {
    setMessage('');
    setTitle('');
    setBandName('');
    setSongName('');
    setLink('');
  }

  const clearState = () => {
    setId(null);
    setMessage('');
    setTitle('');
    setBandName('');
    setSongName('');
    setLink('');
    setPlaylist(playlistName);
  }

  return (
    <IonList>
      <form onSubmit={(e) => e.preventDefault()}>
        <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Message (for email only)</IonLabel>
                  <IonTextarea value={message} onIonChange={(e) => setMessage((e.target as HTMLIonTextareaElement).value)} placeholder="Enter a message for your email"></IonTextarea>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Title</IonLabel>
                  <IonInput autofocus value={title} onIonChange={(e) => setTitle((e.target as HTMLIonInputElement).value)} required clear-input placeholder="Enter title"></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Band/Artist</IonLabel>
                  <IonInput value={bandName} onIonChange={(e) => setBandName((e.target as HTMLIonInputElement).value)} required clear-input placeholder="Enter band or artist's name"></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Song</IonLabel>
                  <IonInput value={songName} onIonChange={(e) => setSongName((e.target as HTMLIonInputElement).value)} required clear-input placeholder="Enter song name"></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">YouTube url</IonLabel>
                  <IonInput value={link} onIonChange={(e) => setLink((e.target as HTMLIonInputElement).value)} required clear-input pattern="https://.*" type="url" placeholder="Enter the YouTube url: https://...."></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">YouTube Playlist</IonLabel>
                  <IonInput value={playlist} readonly={true}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
            {props.updateSODRequest &&
              <>
                <IonCol>
                  <IonButton id="cancelUpdateSodSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('cancelUpdateSodSong')}>
                    Cancel
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton id="updateSodSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('updateSodSong')}>
                    Update Song of the Day
                  </IonButton>
                </IonCol>
              </>
            }

            {!props.updateSODRequest &&
              <>
                <IonCol>
                  <IonButton id="cancelNewOrBPSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('cancelNewOrBPSong')}>
                    Cancel
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton id="bullpenSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => {submitData('bullpenSong')}}>
                    Save to my Bullpen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton id="newSodSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('newSodSong')}>
                    Submit your Song of the Day
                  </IonButton>
                </IonCol>
              </>
            }
            </IonRow>
        </IonGrid>      

      </form>
    </IonList>
  );
}
 
export default SongForm;