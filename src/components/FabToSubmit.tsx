import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router';

const FabToSubmit: React.FC = () => {

  const history = useHistory();

  const handleFabClick = () => {
    history.push({pathname:'/page/Submit'});
  }

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton onClick={ () => handleFabClick()}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
}
 
export default FabToSubmit;