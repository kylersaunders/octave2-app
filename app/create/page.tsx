'use client';

import { InputsForm } from './components/recommendation-inputs/recommendation-inputs';
import { useState } from 'react';
import { RecommendationResponse, RecommendationsData } from '@/types/tracks';
import { DataTable } from './components/recommendation-table/data-table';
import { columns } from './components/recommendation-table/components/columns';

export default function CreatePage() {
  console.log('CreatePage rendered');
  const [data, setData] = useState<RecommendationsData[]>();

  return (
    <div className='flex flex-col justify-center space-y-4 '>
      <InputsForm setData={setData} />
      {data ? <DataTable data={data} columns={columns} /> : null}
    </div>
  );
}
