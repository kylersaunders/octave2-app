import AdvancedSearch from './components/advanced-search/advanced-search';
import SearchTracks from './components/search-tracks';
import ResultsTable from './components/rec-results';

export default function Recommendations() {
  // always need to persist the last search results in recs state
  // should update in the background if inputs change
  // search term and advanced search inputs should be persisted as well
  return (
    <>
      <div className='flex flex-row justify-center items-center space-x-4 px-8'>
        <SearchTracks />
        <AdvancedSearch />
      </div>
      <ResultsTable />
    </>
  );
}
