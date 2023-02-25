import { IonAvatar, IonCard, IonCardContent, IonChip, IonCol, IonGrid, IonIcon, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow } from '@ionic/react';
import {Song} from '../common/types';
import {SongListProps} from '../common/types';
import DOMPurify from 'dompurify';
import { create, trash } from 'ionicons/icons';
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
                        {/* Stand in check for when bullPen data */}
                        { !props.showDeleteButton &&
                          <IonRow>
                            <IonCol>
                              <IonAvatar>
                                <img alt="Silhouette of a person's head" 
                                  src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + song.userFirstName + "+" + song.userLastName + "&rounded=true&background=" + song.userAvatarColor} 
                                  title={song.userFirstName + " " + song.userLastName}/>
                                {/* <img alt="Silhouette of a person's head" src={adminPic} /> */}
                              </IonAvatar>
                            </IonCol>
                          </IonRow>  
                        }
                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Title
                            </IonLabel>
                            <h3>
                                <a href={song.link} target='_blank' rel="noreferrer" 
                                  dangerouslySetInnerHTML={{__html: song.titleHighlighted? highlightMatches(sanitizeData(song.titleHighlighted)): sanitizeData(song.title)}}>
                                </a>
                            </h3>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Band name
                            </IonLabel>
                            <h3
                              dangerouslySetInnerHTML={{__html: song.bandNameHighlighted? highlightMatches(sanitizeData(song.bandNameHighlighted)): sanitizeData(song.bandName)}}>
                            </h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Song name
                            </IonLabel>
                            <h3
                              dangerouslySetInnerHTML={{__html: song.songNameHighlighted? highlightMatches(sanitizeData(song.songNameHighlighted)): sanitizeData(song.songName)}}>
                            </h3>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            {props.showEditButton &&
                              <span id="edit" title="Edit" onClick={(event) => props.editCallback?.(event,song)}>
                                <IonIcon icon={create} size="small"  title="Edit"></IonIcon>
                              </span>
                            }
                            {props.showDeleteButton &&
                              <span>
                                <IonIcon icon={trash} size="small" onClick={(event) => props.deleteCallback?.(event,song)} title="Delete"></IonIcon>
                              </span>
                            }
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