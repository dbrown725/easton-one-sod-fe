import './Repair.css';
import { GET_SONGS_WITH_ISSUES } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';

const Repair: React.FC = () => {

  return (
      <ScrollingSongList count={700} addDataIncrement={20} queryDocumentNode={GET_SONGS_WITH_ISSUES} queryDefinitionName={"getSongsWithIssues"} pageTitleText={"Song Repair Shop"}/>
  );
};

export default Repair;
