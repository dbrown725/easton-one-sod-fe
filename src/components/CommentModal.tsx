import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonModal, IonRow, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { CommentModalProps, Song, SongComment } from '../common/types';
import { create, enterSharp, trash } from 'ionicons/icons';
import './CommentModal.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ADD_SONG_COMMENT, DELETE_SONG_COMMENT, GET_SONG_BY_ID, UPDATE_SONG_COMMENT } from '../graphql/graphql';
import { getThumbnailLink, sanitizeData } from '../common/helper';

const CommentModal: React.FC<CommentModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [song, setSong] = useState<Song>();
  const [comment, setComment] = useState<string | number | null | undefined>('');
  const refUpdateValue = useRef<string>('');
  const [presentAlert] = useIonAlert();

  const [addSongComment, { data: cmmtData, loading: cmmtLoading, error: cmmtError }] = useMutation(ADD_SONG_COMMENT);
  // cmmtData && console.log("cmmtData: ", cmmtData);
  // cmmtLoading && console.log("cmmtLoading: ", cmmtLoading);
  // cmmtError && console.log("cmmtError: ", cmmtError);

  const [updateSongComment, { data: updtData, loading: updtLoading, error: updtError }] = useMutation(UPDATE_SONG_COMMENT);
  // updtData && console.log("updtData: ", updtData);
  // updtLoading && console.log("updtLoading: ", updtLoading);
  // updtError && console.log("updtError: ", updtError);

  const [deleteSongComment, { data: dltData, loading: dltLoading, error: dltError }] = useMutation(DELETE_SONG_COMMENT);
  // dltData && console.log("dltData: ", dltData);
  // dltLoading && console.log("dltLoading: ", dltLoading);
  // dltError && console.log("dltError: ", dltError);

  const [
    getSongById,
    { loading, error, data }
  ] = useLazyQuery(GET_SONG_BY_ID, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { songId: props.songId }, onCompleted: (data) => {
      setSong(data.getSongById);
      setIsOpen(true);
    },
  });

  useEffect(() => {
    if (props.songId > 0) {
      getSongById();
    }
  }, [props.songId]);

  const handleSubmitClick = () => {
    addSongComment({ variables: { songId: props.songId, comment: comment } });
    setComment("");
    const timeout = setTimeout(() => {
      getSongById();
    }, 2000);
  };

  const handleUpdate = (id: number) => {
    
    updateSongComment({ variables: { id: id, comment: refUpdateValue.current } });

    setTimeout(() => {
      var commentInput = id as unknown as string + ' comment_input';
      document.getElementsByClassName(commentInput)[0]!.classList.remove('hidden');
    }, 500);

    setTimeout(() => {
      resetCommentClasses();
      getSongById();
      refUpdateValue.current = '';
    }, 3000);
  };

  const deleteComment = (id: number) => {
    deleteSongComment({ variables: { id: id } });
    const timeout = setTimeout(() => {
      getSongById();
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if(e.key == 'Enter') {
      handleSubmitClick();
    }
  }

  const handleUpdateKeyDown = (e: React.KeyboardEvent<HTMLIonInputElement>, id: number) => {
    if(e.key == 'Enter') {
      handleUpdate(id);
    }
  }

  const handleDeleteClick = (id: number) => {
    presentAlert({
      header: 'Confirm comment delete',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('delete cancelled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            deleteComment(id);
          },
        },
      ],
      // onDidDismiss: (e: CustomEvent) => setRoleMessage(`Dismissed with role: ${e.detail.role}`),
    })

  }

  const handleUpdateButtonClick = (songComment: SongComment) => {
    resetCommentClasses();

    var commentText = songComment.id as unknown as string + ' comment';
    document.getElementsByClassName(commentText)[0]!.classList.add('hidden');
    var commentInput = songComment.id as unknown as string + ' comment_input';
    document.getElementsByClassName(commentInput)[0]!.classList.remove('hidden');
  };

  const resetCommentClasses = () => {
    var commentText = 'comment';
    var commentArray = document.getElementsByClassName(commentText);
    for (var i = 0; i < commentArray.length; i++) {
      commentArray[i]!.classList.remove('hidden');
    }

    var commentInput = 'comment_input';
    var commentInputArray = document.getElementsByClassName(commentInput);
    for (var i = 0; i < commentInputArray.length; i++) {
      commentInputArray[i]!.classList.add('hidden');
    }
  }

  return (
    <IonModal className='comment-modal' isOpen={isOpen}>
      {(song && song!.id! > 0) &&
        <>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="toolbar-title">Comments</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <IonGrid>
                <IonRow className="thumbnail-row">
                  <IonCol>
                    <a href={song!.link} target='_blank' rel="noreferrer">
                      <IonImg className='thumbnail-image' src={getThumbnailLink(song!.link, "high")} />
                    </a>
                  </IonCol>
                </IonRow>
                <IonRow className="song-band-row">
                  <IonCol size="12">
                    <span
                      dangerouslySetInnerHTML={{ __html: sanitizeData(song!.songName) }}>
                    </span>
                    <span> by </span>
                    <span className="band-span" dangerouslySetInnerHTML={{ __html: sanitizeData(song!.bandName) }}></span>
                  </IonCol>
                </IonRow>
                <IonRow className="input-row">
                  <IonCol size="10">
                    <IonInput label="New Comment" value={comment}
                      onIonInput={(e) => { setComment((e.target as HTMLIonInputElement).value); }}
                      onKeyDown={e => { handleKeyDown(e) }}
                      labelPlacement="floating" fill="outline" 
                      maxlength={250} placeholder="Enter text">
                    </IonInput>
                  </IonCol>
                  <IonCol title="Submit" size="2" onClick={(e) => handleSubmitClick()}>
                    <IonButton fill='clear'>
                      <IonIcon className="submit-icon" slot="icon-only" size="large" title="enter" color="primary" icon={enterSharp}></IonIcon>
                    </IonButton>
                  </IonCol>
                </IonRow>
                {
                  song!.songComments!.length > 0 &&
                  song!.songComments!.map((comment: SongComment) => {
                    return (
                      <IonRow key={comment.id} className='comment-row'>
                        <IonCol>
                          <IonRow>
                            <IonCol>
                              <IonRow>
                                <IonCol size='9.75'>
                                  <div className={comment.id as unknown as string + ' comment'}>
                                    {comment.comment}
                                  </div>
                                  <IonRow className={comment.id as unknown as string + ' comment_input hidden'}>
                                    <IonCol size='10'>
                                      <IonInput value={comment.comment}
                                        onIonInput={(e) => { refUpdateValue.current = (e.target as HTMLIonInputElement).value as string; }}
                                        onKeyDown={e => { handleUpdateKeyDown(e, comment.id) }}
                                        fill="outline"
                                        maxlength={250}>
                                      </IonInput>
                                    </IonCol>
                                    <IonCol size='2'>
                                      <IonButton fill='clear' title="Submit Update" onClick={(e) => handleUpdate(comment.id)}>
                                        <IonIcon slot="icon-only"
                                          className="update-icon" size="large" title="update" color="primary" icon={enterSharp}></IonIcon>
                                      </IonButton>
                                    </IonCol>
                                  </IonRow>
                                </IonCol>
                                <IonCol size='2.25'>
                                  <IonRow>
                                    <IonAvatar>
                                      <img alt={comment.userFirstName + " " + comment.userLastName}
                                        src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + comment.userFirstName + "+"
                                          + comment.userLastName + "&rounded=true&background=" + comment.userAvatarColor}
                                        title={comment.userFirstName + " " + comment.userLastName} />
                                    </IonAvatar>
                                  </IonRow>
                                  <IonRow>
                                    <div className="date-div"
                                      dangerouslySetInnerHTML={{ __html: sanitizeData(comment.createTime ? comment.createTime.substring(0, 10) : '') }}>
                                    </div>
                                  </IonRow>
                                </IonCol>
                              </IonRow>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            {true &&
                              <span id="edit" title="Edit" onClick={(event) => handleUpdateButtonClick(comment)}>
                                <IonIcon icon={create} size="small" title="Edit"></IonIcon>
                              </span>
                            }
                            {true &&
                              <span onClick={(e) => handleDeleteClick(comment.id)}>
                                <IonIcon icon={trash} size="small" title="Delete"></IonIcon>
                              </span>
                            }
                          </IonRow>
                        </IonCol>
                      </IonRow>
                    );
                  })
                }
              </IonGrid>
            </form>
          </IonContent>
        </>
      }
    </IonModal>
  );
}

export default CommentModal;