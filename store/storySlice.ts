import { createSlice } from '@reduxjs/toolkit';
/* types */
import { IStoryStoreState, IAddLatestStoryAction } from '../customTypes';
import type { RootState } from '../App';

/* gets the initail state for the story slice */
const getInitStory = (): IStoryStoreState => {

  let initState: IStoryStoreState = {latestStories: []}

  /* add serializer later to store in storage and fetch here */

  return initState;
}


const storySlice = createSlice({
  name: 'story',
  initialState: getInitStory,
  reducers: {
    addStories(state, action: IAddLatestStoryAction) {
      /* accept only if larger than curr state */
      if (action.payload.stories.length > state.latestStories.length) {
        return {
          ...state,
          latestStories: [...action.payload.stories]
        }
      }
      return state;
    },
  }
})

export const { addStories } = storySlice.actions;
export const selectLatestStories = (state:RootState) => state.story.latestStories;
export default storySlice.reducer;