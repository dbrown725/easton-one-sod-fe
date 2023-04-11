import { IonAvatar, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow } from '@ionic/react';
import {Song, UserInfo} from '../common/types';
import {SongListProps} from '../common/types';
import DOMPurify from 'dompurify';
import { create, trash } from 'ionicons/icons';
import './SongList.css';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_INFO } from '../graphql/graphql';
import { useEffect, useState } from 'react';
import { refreshRole } from '../firebase';
import { role } from '../firebase';

const SongList: React.FC<SongListProps> = (props) => {

  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [songWrapperList, setSongWrapperList] = useState<SongWrapper[]>([]);

  const sanitizeData = (dirty: string) => {
    const clean = DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [ 'em' ],
    });
    return clean;
  }

  interface SongWrapper {
    song: Song;
    displayEditButton: boolean;
  }

  const highlightMatches = (raw: string) => {
    return raw.replaceAll('em>', 'mark>');
  }

  const [
    getUserInfo,
    { loading, error, data }
  ] = useLazyQuery(GET_USER_INFO, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setUserInfo(data.getUserInfo);
    }
  });

  useEffect(() => {
    getUserInfo();
    refreshRole();
  }, []);

  useEffect(() => {
    var wrapperList: SongWrapper[] = [];
    props.songs.forEach((song) => {
      var showEditButton = props.showEditButton && (role === 'ADMIN' || song.userIsTheSubmitter == true);
      var songWrapper: SongWrapper = {
        song: song,
        displayEditButton: showEditButton
      };
      wrapperList.push(songWrapper);
    });
    setSongWrapperList(wrapperList);
  }, [props.songs]);

  return (  
        <div>
          <IonList>
            <IonReorderGroup disabled={typeof props.handleReorder === "undefined"} onIonItemReorder={props.handleReorder}> 
            {songWrapperList.length > 0 &&
              songWrapperList.map((wrapper: SongWrapper) => {
            return (
              <IonCard id={wrapper.song.id!.toString()} key={wrapper.song.id} class="card-center">
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
                                <img alt={wrapper.song.userFirstName + " " + wrapper.song.userLastName}
                                  src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + wrapper.song.userFirstName + "+" + wrapper.song.userLastName + "&rounded=true&background=" + wrapper.song.userAvatarColor}
                                  title={wrapper.song.userFirstName + " " + wrapper.song.userLastName}/>
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
                                <a href={wrapper.song.link} target='_blank' rel="noreferrer"
                                  dangerouslySetInnerHTML={{__html: wrapper.song.titleHighlighted? highlightMatches(sanitizeData(wrapper.song.titleHighlighted)): sanitizeData(wrapper.song.title)}}>
                                </a>
                            </h3>
                          </IonCol>
                          <IonCol>
                            <IonLabel position="floating">
                              {props.showDeleteButton
                                && <>Added</>
                                }
                              {!props.showDeleteButton
                                && <>Submitted</>
                              }
                            </IonLabel>
                            <h3
                              dangerouslySetInnerHTML={{__html: sanitizeData(wrapper.song.createTime?wrapper.song.createTime.substring(0,10):'')}}>
                            </h3>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Band name
                            </IonLabel>
                            <h3
                              dangerouslySetInnerHTML={{__html: wrapper.song.bandNameHighlighted? highlightMatches(sanitizeData(wrapper.song.bandNameHighlighted)): sanitizeData(wrapper.song.bandName)}}>
                            </h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Song name
                            </IonLabel>
                            <h3
                              dangerouslySetInnerHTML={{__html: wrapper.song.songNameHighlighted? highlightMatches(sanitizeData(wrapper.song.songNameHighlighted)): sanitizeData(wrapper.song.songName)}}>
                            </h3>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            {wrapper.displayEditButton &&
                              <span id="edit" title="Edit" onClick={(event) => props.editCallback?.(event,wrapper.song)}>
                                <IonIcon icon={create} size="small"  title="Edit"></IonIcon>
                              </span>
                            }
                            {props.showDeleteButton &&
                              <span>
                                <IonIcon icon={trash} size="small" onClick={(event) => props.deleteCallback?.(event,wrapper.song)} title="Delete"></IonIcon>
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