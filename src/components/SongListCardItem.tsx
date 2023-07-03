import { IonAvatar, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonReorder, IonRow } from '@ionic/react';
import { SongListItemProps } from '../common/types';
import { chatbubbleEllipsesOutline, create, trash } from 'ionicons/icons';
import './SongListCardItem.css';
import { getScreenDimensions, getThumbnailLink, highlightMatches, sanitizeData } from '../common/helper';
import CommentModal from './CommentModal';
import { useEffect, useState } from 'react';
import { role, refreshRole } from '../firebase';

const SongListCardItem: React.FC<SongListItemProps> = (props) => {

  const [commentSongId, setCommentSongId] = useState<number>(0);

  useEffect(() => {
    refreshRole();
  }, []);

  return (
    <>
      {props.songWrapper.song.id && props.songListProps.showDeleteButton && getScreenDimensions().width >= 992 &&
        <IonCard id={props.songWrapper.song.id!.toString()} key={props.songWrapper.song.id} className="card-item">
          <IonCardContent className="bullpen-wide-screen">
            <IonReorder slot="end" style={{ float: "right" }}></IonReorder>
              <IonGrid>
                <IonRow>
                  <IonCol size="7">
                    <IonItem>
                      <a slot="start" href={props.songWrapper.song.link} target='_blank' rel="noreferrer">
                        <IonImg src={getThumbnailLink(props.songWrapper.song.link, "high")} className='thumbnail-image'/>
                      </a>
                      <IonLabel>
                        <h1 title={sanitizeData(props.songWrapper.song.songName)}
                          dangerouslySetInnerHTML={{ __html: props.songWrapper.song.songNameHighlighted ? 
                            highlightMatches(sanitizeData(props.songWrapper.song.songNameHighlighted)) : sanitizeData(props.songWrapper.song.songName) }}>
                        </h1>
                        <p dangerouslySetInnerHTML={{ __html: props.songWrapper.song.bandNameHighlighted ? 
                            highlightMatches(sanitizeData(props.songWrapper.song.bandNameHighlighted)) : sanitizeData(props.songWrapper.song.bandName) }}></p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                  <IonCol size="4">
                    <IonRow>
                      <IonCol>
                        <div className="title"
                          dangerouslySetInnerHTML={{ __html: props.songWrapper.song.titleHighlighted ? 
                          highlightMatches(sanitizeData(props.songWrapper.song.titleHighlighted)) : sanitizeData(props.songWrapper.song.title) }}>
                        </div>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <div className="date-div"
                          dangerouslySetInnerHTML={{ __html: sanitizeData(props.songWrapper.song.createTime ? 'Added: ' + props.songWrapper.song.createTime.substring(0, 10) : '') }}>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonCol>
                  <IonCol size="1" className="edit-column">
                    <IonRow>
                      <IonCol>
                        <span id="edit" title="Edit" onClick={(event) => props.songListProps.editCallback?.(event, props.songWrapper.song)}>
                          <IonIcon icon={create} size="small" title="Edit"></IonIcon>
                        </span>
                      </IonCol>
                    </IonRow>                  
                    <IonRow>
                      <IonCol> 
                        <span>
                          <IonIcon icon={trash} size="small" onClick={(event) => props.songListProps.deleteCallback?.(event, props.songWrapper.song)} title="Delete"></IonIcon>
                        </span>
                        </IonCol>
                    </IonRow>                         
                  </IonCol>
                </IonRow>
              </IonGrid>
          </IonCardContent>
        </IonCard>
      }
      {props.songWrapper.song.id && getScreenDimensions().width < 992 &&
        <IonCard id={props.songWrapper.song.id!.toString()} key={props.songWrapper.song.id} className="card-item">
          <IonCardContent className="small-screen">
            <IonReorder slot="end" style={{ float: "right" }}></IonReorder>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <a href={props.songWrapper.song.link} target='_blank' rel="noreferrer">
                    <IonImg src={getThumbnailLink(props.songWrapper.song.link, "high")} 
                      className={props.songListProps.showDeleteButton?"bullpen thumbnail-image":"thumbnail-image"}/>
                  </a>  
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" className="song-band-col">
                    <span className="song-span" title={sanitizeData(props.songWrapper.song.songName)}
                      dangerouslySetInnerHTML={{ __html: props.songWrapper.song.songNameHighlighted ? 
                        highlightMatches(sanitizeData(props.songWrapper.song.songNameHighlighted)) : sanitizeData(props.songWrapper.song.songName) }}>
                    </span>
                    <span className="band-span" dangerouslySetInnerHTML={{ __html: props.songWrapper.song.bandNameHighlighted ? 
                        highlightMatches(sanitizeData(props.songWrapper.song.bandNameHighlighted)) : sanitizeData(props.songWrapper.song.bandName) }}></span>
                </IonCol>
              </IonRow>
              <IonRow> 
                <IonCol size="12">
                  <div className="title"
                      dangerouslySetInnerHTML={{ __html: props.songWrapper.song.titleHighlighted ? 
                        highlightMatches(sanitizeData(props.songWrapper.song.titleHighlighted)) : sanitizeData(props.songWrapper.song.title) }}>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow className={props.songListProps.showDeleteButton?"bullpen img-date-buttons-row":"img-date-buttons-row"}>  
                {!props.songListProps.showDeleteButton &&
                <IonCol size="2" className="avatar-column">
                  <IonAvatar>
                    <img
                      src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + props.songWrapper.song.userFirstName + "+"
                        + props.songWrapper.song.userLastName + "&rounded=true&background=" + props.songWrapper.song.userAvatarColor}
                      title={props.songWrapper.song.userFirstName + " " + props.songWrapper.song.userLastName} />
                  </IonAvatar>
                </IonCol>  
                 }
                <IonCol size="5">
                  <div className={props.songListProps.showDeleteButton?"bullpen date-div":"date-div"}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeData(props.songWrapper.song.createTime ?
                        props.songWrapper.song.createTime.substring(0, 10) : '')
                    }}>
                  </div>
                </IonCol>  
                <IonCol size="4" className={props.songListProps.showDeleteButton?"bullpen button-column":"button-column"}>
                  {props.songWrapper.displayEditButton &&
                    <span id="edit" title="Edit" onClick={(event) => props.songListProps.editCallback?.(event, props.songWrapper.song)}>
                      <IonIcon icon={create} size="small" title="Edit"></IonIcon>
                    </span>
                  }
                  {props.songListProps.deleteCallback &&
                    <span>
                      <IonIcon icon={trash} size="small" onClick={(event) => props.songListProps.deleteCallback?.(event, props.songWrapper.song)} title="Delete"></IonIcon>
                    </span>
                  }
                  {role !== 'GUEST' && !props.songListProps.showDeleteButton &&
                    <>
                      <span id="comment" title="Comment" onClick={(event) => setCommentSongId(props.songWrapper.song.id as number)}>
                        <IonIcon icon={chatbubbleEllipsesOutline} size="1" title="Comment"></IonIcon>
                      </span>
                      <span>{props.songWrapper.song.songComments?.length}</span>
                    </>
                  }
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      }
      {commentSongId > 0 && <CommentModal songId={commentSongId} closeModalCallback={() => setCommentSongId(0)}/>}
    </>
  );
}

export default SongListCardItem;