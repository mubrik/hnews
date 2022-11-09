import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
/* utility types */
export type NoNullFields<T> = { [K in keyof T]: NonNullable<T[K]> };
/* user detail */
export interface IUserDetail {
  userId: string | null;
  username: string | null;
  email: string | null;
}

export interface INewUser {
  username: string;
  email: string;
  password: string;
}

/* redux auth slice  */
export interface IAuthStoreState extends IUserDetail {
  isAuthenticated: boolean;
}

export interface IStoryStoreState {
  latestStories: number[];
}

/* Sign in action type */
export interface ISignInAction {
  type: string;
  payload: {
    userId: string;
    username: string;
    email: string;
  }
}

/* Signout action type */
export interface ISignOutAction {
  type: string;
  payload: undefined;
}

/* add stories action type */
export interface IAddLatestStoryAction {
  type: string;
  payload: {stories: number[]};
}

/* action union */
export type IStoreActions = ISignInAction |
  ISignOutAction


/* Hacker news types */
interface IHnBase {
  id: number;
  deleted: boolean;
  type: "job"| "story" | "comment" | "poll" | "pollopt";
  by: string;
  time: number; /* unix */
  dead: boolean;
  kids: number[]; /* The ids of the item's comments, in ranked display order. */
}

interface IHnJob extends IHnBase {
  type: "job",
  text: string;
  url: string;
  title: string;
}

export interface IHnStory extends IHnBase {
  type: "story";
  score: number; /* story score */
  descendants: number; /* comment count */
  url: string;
  title: string;
}

export interface IHnComment extends IHnBase {
  type: "comment",
  parent: number; /* item parent / comment id */
  text: string; /* the comment */
}

export interface IHnPoll extends IHnBase {
  type: "poll",
  text: string;
  descendants: number; /* comment count */
  parts: number[]; /* related pollopts id */
  score: number; /* votes */
  title: string;
}

export type IHnGeneric =
  IHnJob |
  IHnStory |
  IHnComment |
  IHnPoll

/* react ative nav stack type */
export interface RootStackParamList extends ParamListBase {
  home: undefined;
  about: undefined;
  login: undefined;
  register: undefined;
  news: {storyId: number};
}
/* this way react navigation object has a default type */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface HomeTabStackParamList extends ParamListBase {
  list: undefined;
  about: undefined;
}

export interface StoryStackParamList extends ParamListBase {
  top: undefined;
  latest: undefined;
}

/* individula screen props */
/* tab screens */
export type IAboutScreenProps = BottomTabScreenProps<HomeTabStackParamList, 'about'>;
export type IStoryListScreenProps = BottomTabScreenProps<HomeTabStackParamList, 'list'>;
/* lists screens */
export type ITopListScreenProps = NativeStackScreenProps<StoryStackParamList, 'top'>;
export type ILatestListScreenProps = NativeStackScreenProps<StoryStackParamList, 'latest'>;
/* root screens */
export type IHomeScreenProps = NativeStackScreenProps<RootStackParamList, 'home'>;
export type INewsReaderScreenProps = NativeStackScreenProps<RootStackParamList, 'news'>;
export type ILoginScreenProps = NativeStackScreenProps<RootStackParamList, 'login'>;
export type IRegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'register'>;