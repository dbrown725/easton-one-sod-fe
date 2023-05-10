import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonRow, IonTextarea } from '@ionic/react';
import { useState } from 'react';
import { ErrorDisplayProps } from '../common/types';
import './ErrorDisplay.css';

const ErrorDisplay: React.FC<ErrorDisplayProps> = (props) => {

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const handleDetailClick = () => {
    setShowDetail(!showDetail);
  }
  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCol>
              <IonImg src="assets/images/errorSad.png" className='error-display-logo' alt="an error occured"></IonImg>
            </IonCol>
          </IonCol>
        </IonRow>
        <IonRow>  
          <IonCol>
            <IonGrid>
              <IonRow>
                <IonCol size='10' size-md='4'>
                  <div className='ion-margin'>An error occured: {props.message} 
                  <IonButton fill="clear" onClick={ () => handleDetailClick()}>{showDetail? 'Hide detail' : 'Show Detail'}</IonButton> 
                  </div>
                </IonCol>
                <IonCol size='2' size-md='8'>
                  
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
        <IonRow>
        </IonRow>
        {showDetail && 
          <IonRow>
            <IonCol>
              <IonTextarea className='ion-margin'>{props.detail}</IonTextarea>
            </IonCol>
          </IonRow>
        }
      </IonGrid>
    </IonContent>
  );
}
 
export default ErrorDisplay;