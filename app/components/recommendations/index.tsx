import RecommendationsResults from './components/RecommendationsResults';
import FiltersModal from '../filters';

export default function RecommendationsTab() {
  // always need to persist the last search results in recs state
  // should update in the background if inputs change
  // search term and advanced search inputs should be persisted as well
  return (
    <>
      <div className='flex flex-row h-24'>
        <FiltersModal />
      </div>
      <RecommendationsResults />
    </>
  );
}
