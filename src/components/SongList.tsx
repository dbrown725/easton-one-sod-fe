import { IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow } from '@ionic/react';
import {Song} from '../common/types';
import {SongListProps} from '../common/types';
import DOMPurify from 'dompurify';
import { trash } from 'ionicons/icons';
import './SongList.css';

const SongList: React.FC<SongListProps> = (props) => {

  const sanitizeData = (dirty: string) => {
    const clean = DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [ 'em' ],
    });
    return clean;
  }

  const highlightMatches = (raw: string) => {
    return raw.replaceAll('em>', 'mark>');
  }

  return (  
        <div>
          <IonList>
            <IonReorderGroup disabled={typeof props.handleReorder === "undefined"} onIonItemReorder={props.handleReorder}> 
            {props.songs &&
              props.songs.map((song: Song) => {
            return (
              <IonCard id={song.id!.toString()} key={song.id} class="card-center">
                <IonCardContent>
                  <IonReorder slot="end" style={{float: "right"}}></IonReorder>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonRow>
                            {
                              typeof props.deleteCallback !== "undefined" &&
                                <>
                                  <IonCol>
                                    <IonIcon icon={trash} size="small" onClick={(event) => props.deleteCallback?.(event,song)}></IonIcon>
                                  </IonCol>
                                </>
                            }

                            {
                              props.showId &&
                                <>
                                  <IonCol>
                                  <IonLabel position="floating">
                                  Id
                                  </IonLabel>
                                  <h3>{song.id}</h3>
                                  </IonCol>
                                </>
                            }
                          
                            {
                              props.showScore &&
                                <>
                                  <IonCol>
                                  <IonLabel position="floating">
                                  Score
                                  </IonLabel>
                                  <h3>{song.score}</h3>
                                  </IonCol>
                                </>
                            }

                          <IonCol>
                            <IonLabel position="floating">
                              Title
                            </IonLabel>
                            <h3><a href={song.link} target='_blank' rel="noreferrer" 
                                  dangerouslySetInnerHTML={{__html: song.titleHighlighted? highlightMatches(sanitizeData(song.titleHighlighted)): sanitizeData(song.title)}}>
                                </a></h3>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Band name
                            </IonLabel>
                            <h3>{song.bandName}</h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Song name
                            </IonLabel>
                            <h3>{song.songName}</h3>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>    
                );
            })}
            </IonReorderGroup>
          </IonList> 
        </div>
    );
}
 
export default SongList;