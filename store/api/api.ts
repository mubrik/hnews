import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
/* types */
import { IHnGeneric } from '../../customTypes';

// Define a service using a base URL and expected endpoints
export const hackerNewsApi = createApi({
  reducerPath: 'hnews',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://hacker-news.firebaseio.com/v0/' }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getTopStories: builder.query<number[], undefined>({
      query: () => `topstories.json?print=pretty`,
    }),
    getItemById: builder.query<IHnGeneric, number>({
      query: (arg) => `item/${arg}.json?print=pretty`
    }),
    getMaxItem: builder.query<number, number>({
      query: (arg) => `maxitem.json?print=pretty`
    })
  }),
});

export const { useGetTopStoriesQuery, useGetItemByIdQuery, useGetMaxItemQuery } = hackerNewsApi;