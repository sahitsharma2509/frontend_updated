import { getKnowledgeBases } from "../../common/data/api";
import {useQuery} from 'react-query';


export default function TestQuery() {
    const { data, isError, isLoading } = useQuery<{name: string}[]>('knowledgebases', getKnowledgeBases);
  
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>An error has occurred</p>;
  
    return (
      <div>
        {data?.map((knowledgeBase: {name: string}, index: number) => (
          <p key={index}>{knowledgeBase.name}</p>
        ))}
      </div>
    );
  }