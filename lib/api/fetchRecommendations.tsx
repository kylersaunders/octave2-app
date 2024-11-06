import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const octaveApi = createApi({
  reducerPath: 'octaveApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getRecommendations: builder.query<any, string>({
      query: (queryString) => `recommendations?${queryString}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetRecommendationsQuery } = octaveApi;
