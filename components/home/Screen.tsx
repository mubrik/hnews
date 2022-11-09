/* react nat */
import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View } from 'react-native';
import { ActivityIndicator, ProgressBar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
/* types */
import type { ITopListScreenProps, ILatestListScreenProps, IHnGeneric } from '../../customTypes';
import { useGetTopStoriesQuery, useGetMaxItemQuery } from '../../store/api/api';
import { addStories, selectLatestStories } from '../../store/storySlice';
/* comps */
import NewsCard from '../news/NewsCard';
/* utils */
import { generateStoryArray, filterStoryPredictate, asyncFilterStory } from './utils';
export default function TopStoryScreen (props: ITopListScreenProps) {

  const { data, error, isFetching, isLoading, refetch } = useGetTopStoriesQuery(undefined);
  const [viewData, setViewData] = useState<number[]>([]);
  const dispatch = useDispatch();

  /* sets view data */
  useEffect(() => {
    if (data) {
      setViewData(data.slice(0, 50));
    }
  }, [data]);

  if (error) {
    return (
      <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Text> Error Getting page </Text>
      </View>
    );
  }

  /* 'cache' redux latest story with some data */
  useFocusEffect(useCallback(() => {
    return () => {
      if (data) {
        dispatch(addStories({stories: data.slice(0, 30)}));
      }
    }
  }, [data]));

  /* only on first load */
  if (isLoading) {
    return <ActivityIndicator animating={true} color={'purple'} />;
  }

  const handleEndThreshold = () => {
    /* slowly increase array? */
    const _len = viewData.length;
    if (_len < 500 && data) {
      setViewData(prev => ([
        ...prev,
        ...data.slice(_len, _len + 50)
      ]));
    }
  };

  return (
    <SafeAreaView style={{paddingHorizontal: 8}} >
      {
        data ?
          <FlatList
            data={viewData}
            renderItem={(props) => <NewsCard {...props} />}
            keyExtractor={item => `top-${item}-story`}
            onRefresh={() => refetch()}
            refreshing={isFetching}
            initialNumToRender={5}
            onEndReached={() => handleEndThreshold()}
            onEndReachedThreshold={0.8}
            scrollsToTop={true}
          />
          :
          null
      }
    </SafeAreaView>
  );
}

export function LatestStoryScreen (props: ILatestListScreenProps) {

  const { data, error, isFetching, isLoading, refetch } = useGetMaxItemQuery(0);
  const storeLatestStories = useSelector(selectLatestStories);
  const dispatch = useDispatch();
  const [viewData, setViewData] = useState<number[]>(storeLatestStories);
  const [isFiltering, setIsFiltering] = useState(false);
  const flatlistRef = useRef<FlatList>(null);

  if (error) {
    return (
      <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Text> Error Getting page </Text>
      </View>
    );
  }

  const getLatestStory = async (param: number, length: number) => {
    const _stories = generateStoryArray(param, length);
    /* long operation, outside so i have access to updated viewdata outside effect */
    const result = await asyncFilterStory(_stories, filterStoryPredictate, viewData);

    return result;
  };

  useEffect(() => {
    if (data) {
      getLatestStory(data, 50) /* 50 so init load is a bit fast */
        .then(res => {
          setViewData(prev => [...new Set([...res, ...prev])]);
          setIsFiltering(false);
        });
    }
  }, [data]);

  /* stores view data to redux store on unmount. caching */
  useFocusEffect(useCallback(() => {
    return () => {
      if (viewData.length > 0){
        dispatch(addStories({stories: viewData}));
      }
    }
  }, [viewData]));

  /* only on first load */
  if (isLoading) {
    return <ActivityIndicator animating={true} color={'purple'} />;
  }

  const handleEndThreshold = async () => {
    /* slowly increase array? */
    const _len = viewData.length;
    setIsFiltering(true);
    let lastItem = viewData[_len - 1];
    const _filtered = await getLatestStory(--lastItem, 150);
    /* limiting buffer to 500 ... testing.. optimize later */
    if (_len < 500) {
      setViewData(prev => [...new Set([...prev,..._filtered])]);
    } else {
      /* reduce buffer */
      setViewData(prev => [...new Set([...prev.slice(400, 500), ..._filtered])]);
    }
    setIsFiltering(false);
  };

  return (
    <SafeAreaView style={{paddingHorizontal: 8}} >
      {
        isFiltering ?
          <ProgressBar indeterminate={true}/> : null
      }
      {
        data ?
          <FlatList
            ref={flatlistRef}
            data={viewData}
            renderItem={(props) => <NewsCard {...props} />}
            keyExtractor={(item) => `latest-${item}-story`}
            onRefresh={() => refetch()}
            refreshing={isFetching}
            onEndReached={() => handleEndThreshold()}
            onEndReachedThreshold={0.5} /* higher cause shorter list */
            scrollsToTop={true}
          />
          :
          null
      }
    </SafeAreaView>
  );
}
