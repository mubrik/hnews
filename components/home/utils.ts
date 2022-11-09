import type { IHnGeneric } from "../../customTypes";

/* generates an array of length, number-- */
export function generateStoryArray (num: number, length: number) {
  if (!num) return [];
  let iter = num;
  /* reduce number to get desending items */
  const arr = [...new Array(length)].map(_ => iter--);
  return arr;
};

/* basically checks if each id/number return data type is a story */
export async function filterStoryPredictate (param: number, exclude?: number[]) {
  /* optimization, fasterto traverse list than making request */
  if (param && exclude?.includes(param)) {
    return true;
  }

  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${param}.json`);
  if (response.ok) {
    const data: IHnGeneric = await response.json();
    if (data.type === 'story' && !data.dead && !data.deleted) {
      return true;
    }
    return false;
  }
  return false;
}

/* takes an array and run the async predicate against it */
export async function asyncFilterStory (stories: number[], pred:((param: number, exclude?: number[]) => Promise<boolean>), exclude?: unknown[]) {

  const mapResult = await Promise.all(stories.map((value) => pred(value)));
  return stories.filter((_, index) => mapResult[index]);
};
