import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonList, IonNote, IonTextarea } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Song, SongFormProps } from '../common/types';
import DOMPurify from 'dompurify';
import { useHistory, useLocation } from 'react-router';
import './SongForm.css';
import { getThumbnailLink } from '../common/helper';

const SongForm: React.FC<SongFormProps> = (props) => {

  const playlistName = 'Clam Strip Night!';
  const [id, setId] = useState<number | null | undefined>();
  const [message, setMessage] = useState<string | null | undefined>('');
  const [title, setTitle] = useState<string | number | null | undefined>('');
  const [bandName, setBandName] = useState<string | number | null | undefined>('');
  const [songName, setSongName] = useState<string | number | null | undefined>('');
  const [link, setLink] = useState<string | number | null | undefined>('');
  const [playlist, setPlaylist] = useState<string | number | null | undefined>(playlistName);
  const [isFormValidated, setFormValidated] = useState<boolean>(false);
  const [thumbnailLink, setThumbnailLink] = useState<string | null | undefined>('');
  const location = useLocation<{ song: Song }>();
  const history = useHistory();

  const urlStartsWith1 = "https://www.youtu";
  const urlStartsWith2 = "https://youtu";

  // Start logic related to clearing form when user navigates away without submitting.
  // There must be an easier way.
  const [previousPathname, setPreviousPathname] = useState<string>('');
  const myStateRef = useRef(previousPathname);
  const setMyState = (data: string) => {
    myStateRef.current = data;
    setPreviousPathname(data);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.getElementsByClassName("bandArtist")[0]?.querySelector("input")?.focus();
      document.getElementsByClassName("bandArtist")[0].parentElement?.classList.remove("ion-invalid");
      document.getElementsByClassName("songName")[0].parentElement?.classList.remove("ion-invalid");
      document.getElementsByClassName("titleClass")[0].parentElement?.classList.remove("ion-invalid");
      document.getElementsByClassName("url")[0].parentElement?.classList.remove("ion-invalid");
    }, 500);
    setMyState(location.pathname);
    const unlisten = history.listen((location) => {
      //myStateRef.current is the previous page
      //clear everything if you just left /page/Submit
      if (myStateRef.current === '/page/Submit') {
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
    if (location.state) {
      if (location.state.song) {
        setId(location.state.song.id);
        if (location.state.song.message) {
          setMessage(location.state.song.message);
        }
        setTitle(location.state.song.title);
        setBandName(location.state.song.bandName);
        setSongName(location.state.song.songName);
        setLink(location.state.song.link);
        if (location.state.song.playlist) {
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
    if ((!title || !bandName || !songName || !link) &&
      buttonIdentifier !== 'cancelUpdateSodSong' && buttonIdentifier !== 'cancelNewOrBPSong') {
      return;
    }
    props.song.message = sanitizeData(String(message));
    props.song.title = sanitizeData(String(title));
    props.song.bandName = sanitizeData(String(bandName));
    props.song.songName = sanitizeData(String(songName));
    props.song.link = sanitizeData(String(link));
    props.song.playlist = sanitizeData(String(playlist));

    if (buttonIdentifier === 'newSodSong') {
      await props.sodInsertCallback();
    } else if (buttonIdentifier === 'updateSodSong') {
      await props.sodUpdateCallback();
    } else if (buttonIdentifier === 'cancelUpdateSodSong') {
      await props.sodCancelUpdateCallback();
    } else if (buttonIdentifier === 'bullpenSong') {
      await props.bpCallback();
    } else if (buttonIdentifier === 'cancelNewOrBPSong') {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Tab') {
      var classList = (e.target as HTMLFormElement).parentElement?.classList;
      if(classList?.contains("bandArtist")) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByClassName("songName")[0]?.querySelector("input")?.focus();
      } else if(classList?.contains("songName")) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByClassName("titleClass")[0]?.querySelector("input")?.focus();
      } else if(classList?.contains("titleClass")) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByClassName("url")[0]?.querySelector("input")?.focus();
      } else if(classList?.contains("url")) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByClassName("comment")[0]?.querySelector("textarea")?.focus();
      }
    }
    const timeout = setTimeout(() => {
      validateForm();
    }, 500);
  }

  const handleTextFocusEvent = (e: React.FormEvent<HTMLIonInputElement>) => {
    (e.target as HTMLFormElement).parentElement?.parentElement?.classList.remove("ion-invalid");
    var classList = (e.target as HTMLFormElement).parentElement?.classList;
    var classListTextArea = (e.target as HTMLFormElement).parentElement?.parentElement?.classList;
    document.getElementsByClassName("bandArtistNote")[0].classList.add("hide");
    document.getElementsByClassName("songNameNote")[0].classList.add("hide");
    document.getElementsByClassName("titleNote")[0].classList.add("hide");
    document.getElementsByClassName("commentNote")[0] && 
      document.getElementsByClassName("commentNote")[0].classList.add("hide");
    if(classList?.contains("bandArtist")) {
      document.getElementsByClassName("bandArtistNote")[0].classList.remove("hide");
      (e.target as HTMLFormElement).parentElement?.parentElement?.classList.add("item-has-focus");
    } else if(classList?.contains("songName")) {
      document.getElementsByClassName("songNameNote")[0].classList.remove("hide");
    } else if(classList?.contains("titleClass")) {
      document.getElementsByClassName("titleNote")[0].classList.remove("hide");
      if(!title && bandName && songName) {
        setTitle(bandName + " - " + songName);
      }
    } else if(classListTextArea?.contains("comment")) {
      document.getElementsByClassName("commentNote")[0].classList.remove("hide");
    }
    const timeout = setTimeout(() => {
        validateForm();
    }, 500);
  };

  //Handles clear button click and mouse paste events
  const onChanged = (target: HTMLIonInputElement) => {
    validateForm();
    setLink((state) => {
      setThumbnailLink(getThumbnailLink(state, "high"));
      return state;
    });
  };

  const handleTextBlurEvent = (e: React.FormEvent<HTMLIonInputElement>) => {
    var classList = (e.target as HTMLFormElement).parentElement?.classList;
    if(classList?.contains("bandArtist") && !bandName) {
      (e.target as HTMLFormElement).parentElement?.parentElement?.classList.add("ion-invalid");
    } else if(classList?.contains("songName") && !songName) {
      (e.target as HTMLFormElement).parentElement?.parentElement?.classList.add("ion-invalid");
    } else if(classList?.contains("titleClass") && !title) {
      (e.target as HTMLFormElement).parentElement?.parentElement?.classList.add("ion-invalid");
    } else if(classList?.contains("url") && !link?.toString().startsWith(urlStartsWith1)
          && !link?.toString().startsWith(urlStartsWith2)) {
      (e.target as HTMLFormElement).parentElement?.parentElement?.classList.add("ion-invalid");
    }
    validateForm();
  };

  const validateForm = () => {
    if(
      document.getElementsByClassName("bandArtist")[0].querySelector("input")?.value?.trim()
      &&
      document.getElementsByClassName("songName")[0].querySelector("input")?.value.trim()
      &&
      document.getElementsByClassName("titleClass")[0].querySelector("input")?.value.trim()
      &&
      (document.getElementsByClassName("url")[0].querySelector("input")?.value?.trim().startsWith(urlStartsWith1)
        || document.getElementsByClassName("url")[0].querySelector("input")?.value?.trim().startsWith(urlStartsWith2))) {
        setFormValidated(true);
    } else {
      setFormValidated(false);
    }
  }

  return (
    <IonList>
      <form onSubmit={(e) => e.preventDefault()} className='submit-form ion-padding' onKeyDown={e => { handleKeyDown(e) }}>
        { thumbnailLink &&
          <div className="image-wrapper">
            <IonImg src={thumbnailLink} className='form-image' alt="Song of the day!" />
          </div>
        }
        <IonItem
          className="item-has-focus ion-touched">
          <IonLabel>
            Band/Artist(s) <span className="asterisk">*</span>:
          </IonLabel>
          <IonInput
            className="bandArtist"
            maxlength={100}
            autofocus
            value={bandName}
            onIonInput={(e) => {setBandName((e.target as HTMLIonInputElement).value); onChanged(e.target)}}
            onBlur={(e) => handleTextBlurEvent((e as React.FormEvent<HTMLIonInputElement>))}
            onFocus={(e) => handleTextFocusEvent((e as React.FormEvent<HTMLIonInputElement>))}
            required
            clear-input
            placeholder="The Allman Brothers Band">
          </IonInput>
          <IonNote className="bandArtistNote" slot="helper">Just who is performing in the video.</IonNote>
        </IonItem>

        <IonItem className="item-has-focus ion-touched">
          <IonLabel>
            Song name <span className="asterisk">*</span>:
          </IonLabel>
          <IonInput
            className="songName"
            maxlength={100}
            value={songName}
            onIonInput={(e) => {setSongName((e.target as HTMLIonInputElement).value); onChanged(e.target)}}
            onBlur={(e) => handleTextBlurEvent((e as React.FormEvent<HTMLIonInputElement>))}
            onFocus={(e) => handleTextFocusEvent((e as React.FormEvent<HTMLIonInputElement>))}
            required
            clear-input
            placeholder="One Way Out">
          </IonInput>
          <IonNote className="hide songNameNote" slot="helper">Just the name of the song. </IonNote>
        </IonItem>

        <IonItem className="item-has-focus ion-touched">
          <IonLabel>
            Title <span className="asterisk">*</span>:
          </IonLabel>
          <IonInput
            className="titleClass" //"title" alone caused issues. Reserved name?
            maxlength={203} //band (max 100) + " - " + //song (max 100)
            value={title}
            onIonInput={(e) => {setTitle((e.target as HTMLIonInputElement).value); onChanged(e.target)}}
            onBlur={(e) => handleTextBlurEvent((e as React.FormEvent<HTMLIonInputElement>))}
            onFocus={(e) => handleTextFocusEvent((e as React.FormEvent<HTMLIonInputElement>))}
            required
            clear-input
            placeholder="Allman Brothers Band - One Way Out - Closing Night At The Fillmore (6/27/71)">
          </IonInput>
          <IonNote className="hide titleNote" slot="helper">The band/artist(s) and song name with any additional descriptors you desire like live, acoustic, location, date etc..</IonNote>
        </IonItem>

        <IonItem className="item-has-focus ion-touched">
          <IonLabel>
            YouTube URL <span className="asterisk">*</span>:
          </IonLabel>
          <IonInput
            className="url"
            maxlength={100}
            value={link}
            onIonInput={(e) => {setLink((e.target as HTMLIonInputElement).value); onChanged(e.target)}}
            onBlur={(e) => handleTextBlurEvent((e as React.FormEvent<HTMLIonInputElement>))}
            onFocus={(e) => handleTextFocusEvent((e as React.FormEvent<HTMLIonInputElement>))}
            required
            type="url"
            clear-input
            placeholder="https://www.youtube.com/watch?v=XAyaw4ktO5g">
          </IonInput>
        </IonItem>

        {!props.updateSODRequest &&
          <IonItem>
            <IonLabel>Comment:</IonLabel>
            <IonTextarea
              className="comment"
              maxlength={250}
              value={message}
              onFocus={(e) => handleTextFocusEvent((e as unknown as React.FormEvent<HTMLIonInputElement>))}
              onIonInput={(e) => setMessage((e.target as HTMLIonTextareaElement).value)}
              placeholder="A great live performance by the Allman Brothers!">
            </IonTextarea>
            <IonNote className="hide commentNote" slot="helper">Optional: Will only be included in the email.</IonNote>
          </IonItem>
        }

        <div className="bottom-guide"><span>*</span><span className="required">required</span></div>

        {props.updateSODRequest &&
          <>

            <IonButton id="cancelUpdateSodSong" expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('cancelUpdateSodSong')}>
              Cancel
            </IonButton>
            <IonButton id="updateSodSong" disabled={!isFormValidated} expand="block" type="submit" className="ion-margin-top" onClick={(e) => submitData('updateSodSong')}>
              Update Song of the Day
            </IonButton>

          </>
        }

        {!props.updateSODRequest &&
          <>
            <IonButton id="bullpenSong" disabled={!isFormValidated} type="submit" className="ion-margin-top" onClick={(e) => { submitData('bullpenSong') }}>
              Save to my Bullpen
            </IonButton>

            <IonButton id="newSodSong" disabled={!isFormValidated} type="submit" className="ion-margin-top" onClick={(e) => submitData('newSodSong')}>
              Submit your Song of the Day
            </IonButton>

            <IonButton id="cancelNewOrBPSong" type="submit" className="ion-margin-top" onClick={(e) => submitData('cancelNewOrBPSong')}>
              Cancel
            </IonButton>
          </>
        }

      </form>
    </IonList>
  );
}

export default SongForm;