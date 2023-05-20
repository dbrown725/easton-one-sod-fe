import { IonAvatar, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonImg, IonLabel, IonReorder, IonRow } from '@ionic/react';
import { SongListItemProps } from '../common/types';
import { create, trash } from 'ionicons/icons';
import './SongListItemNotDesktop.css';
import { getThumbnailLink, highlightMatches, sanitizeData } from '../common/helper';

const SongListItemNotDesktop: React.FC<SongListItemProps> = (props) => {

  return (
    <>
      {props.songWrapper.song.id &&
        <IonCard id={props.songWrapper.song.id!.toString()} key={props.songWrapper.song.id} class="card-center">
          <IonCardContent>
            <IonReorder slot="end" style={{ float: "right" }}></IonReorder>
            <IonGrid>
              <IonRow>
                <IonCol>
                  {/* Stand in check for when bullPen data */}
                  {!props.songListProps.showDeleteButton &&
                    <IonRow>
                      <IonCol>
                        <IonImg src={getThumbnailLink(props.songWrapper.song.link, "high")} className='thumbnail-image' alt="Song of the day!" />
                      </IonCol>
                      <IonCol>
                        <IonAvatar>
                          <img alt={props.songWrapper.song.userFirstName + " " + props.songWrapper.song.userLastName}
                            src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + props.songWrapper.song.userFirstName + "+" + props.songWrapper.song.userLastName + "&rounded=true&background=" + props.songWrapper.song.userAvatarColor}
                            title={props.songWrapper.song.userFirstName + " " + props.songWrapper.song.userLastName} />
                          {/* <img alt="Silhouette of a person's head" src={adminPic} /> */}
                        </IonAvatar>
                      </IonCol>
                    </IonRow>
                  }
                  {props.songListProps.showDeleteButton &&
                    <IonRow>
                      <IonCol>
                        <IonImg src={getThumbnailLink(props.songWrapper.song.link, "high")} className='thumbnail-image' alt="Song of the day!" />
                      </IonCol>
                    </IonRow>
                  }
                  <IonRow>
                    <IonCol>
                      <IonLabel position="floating">
                        Title
                      </IonLabel>
                      <h3>
                        <a href={props.songWrapper.song.link} target='_blank' rel="noreferrer"
                          dangerouslySetInnerHTML={{ __html: props.songWrapper.song.titleHighlighted ? highlightMatches(sanitizeData(props.songWrapper.song.titleHighlighted)) : sanitizeData(props.songWrapper.song.title) }}>
                        </a>
                      </h3>
                    </IonCol>
                    <IonCol>
                      <IonLabel position="floating">
                        {props.songListProps.showDeleteButton
                          && <>Added</>
                        }
                        {!props.songListProps.showDeleteButton
                          && <>Submitted</>
                        }
                      </IonLabel>
                      <h3
                        dangerouslySetInnerHTML={{ __html: sanitizeData(props.songWrapper.song.createTime ? props.songWrapper.song.createTime.substring(0, 10) : '') }}>
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol>
                      <IonLabel position="floating">
                        Band name
                      </IonLabel>
                      <h3
                        dangerouslySetInnerHTML={{ __html: props.songWrapper.song.bandNameHighlighted ? highlightMatches(sanitizeData(props.songWrapper.song.bandNameHighlighted)) : sanitizeData(props.songWrapper.song.bandName) }}>
                      </h3>
                    </IonCol>

                    <IonCol>
                      <IonLabel position="floating">
                        Song name
                      </IonLabel>
                      <h3
                        dangerouslySetInnerHTML={{ __html: props.songWrapper.song.songNameHighlighted ? highlightMatches(sanitizeData(props.songWrapper.song.songNameHighlighted)) : sanitizeData(props.songWrapper.song.songName) }}>
                      </h3>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {props.songWrapper.displayEditButton &&
                        <span id="edit" title="Edit" onClick={(event) => props.songListProps.editCallback?.(event, props.songWrapper.song)}>
                          <IonIcon icon={create} size="small" title="Edit"></IonIcon>
                        </span>
                      }
                      {props.songListProps.showDeleteButton &&
                        <span>
                          <IonIcon icon={trash} size="small" onClick={(event) => props.songListProps.deleteCallback?.(event, props.songWrapper.song)} title="Delete"></IonIcon>
                        </span>
                      }
                    </IonCol>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      }
    </>
  );
}

export default SongListItemNotDesktop;