import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonList, IonRow, IonTextarea } from '@ionic/react';
import { useState } from 'react';
import {SongFormProps} from '../common/types';

const SongForm: React.FC<SongFormProps> = (props) => {

  const [message, setMessage] = useState<string | null>();
  const [title, setTitle] = useState<string | number |null>();
  const [bandName, setBandName] = useState<string |number | null>();
  const [songName, setSongName] = useState<string | number |null>();
  const [link, setLink] = useState<string | number |null>();
  const [playlist, setPlaylist] = useState<string | number |null>('End of the World (And I Feel Fine)');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.song.message = String(message);
    props.song.title = String(title);
    props.song.bandName = String(bandName);
    props.song.songName = String(songName);
    props.song.link = String(link);
    props.song.playlist = String(playlist);

    await props.Callback(); // triggering the callback
    clearForm();
  };

  const clearForm = () => {
    setMessage('');
    setTitle('');
    setBandName('');
    setSongName('');
    setLink('');
  }

  return (
    <IonList>
      <form onSubmit={onSubmit}>
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
               {/* <IonCol>
                <IonButton id="newBullpenSong" expand="block" type="submit" className="ion-margin-top" class="newBullpenSong">
                  Save to my Bullpen
                </IonButton>
              </IonCol> */}
              <IonCol>
                <IonButton id="newSodSong" expand="block" type="submit" className="ion-margin-top" class="newSodSong">
                  Submit your Song of the Day
                </IonButton>
              </IonCol>
            </IonRow>
        </IonGrid>      

      </form>
    </IonList>
  );
}
 
export default SongForm;