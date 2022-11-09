import { memo } from 'react';
/* query */
import { useGetItemByIdQuery } from "../../store/api/api";
/* native */
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, IconButton, Paragraph, ProgressBar } from "react-native-paper";
/* nav */
import { useNavigation } from "@react-navigation/native";
/* types */
import type { ListRenderItemInfo } from "react-native";

/* anti pattern empty interface but leaving just incase i need to stick in a prop later */
interface INewsCardProps extends ListRenderItemInfo<number> {

}

/**
 *@description: Card display for each story item, memoized to save performance
 */
export default memo(({ item: storyId }: INewsCardProps) => {

  if (!storyId) {
    return null;
  }
  /* navigate */
  const navigate = useNavigation();
  const { data, isFetching, isError, isLoading } = useGetItemByIdQuery(storyId); /* query */
  /* first load, replace with shimmer later? */
  if (isLoading) return (
    <View style={{height: 120, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator animating={true} color={'purple'}/>
    </View>
  );

  /* handle errors */
  if (!data && isError) return null;
  if (data && (data.dead || data?.deleted) && data.type !== 'story') return null;

  return (
    <>
      {
        isFetching ? <ProgressBar indeterminate visible={true} color={'purple'} /> : null
      }
      {
        (data && data.type === "story") ?
        <Card elevation={1} onPress={() => navigate.navigate('news', {storyId})} style={{padding: 2, marginVertical: 8}}>
          <Card.Title title={data.by} subtitle={new Date(data.time * 1000).toDateString()} left={() => <IconButton icon={'account-circle'} iconColor={'purple'} size={28} />}/>
          <Card.Content>
            <Paragraph> {data.title} </Paragraph>
          </Card.Content>
          <View style={styles.flexRowContainer}>
            <View style={styles.flexRowContainer}>
              <IconButton icon={'star-outline'} iconColor={'purple'} size={22} />
              <Paragraph> {data.score} </Paragraph>
            </View>
            <View style={styles.flexRowContainer}>
              <IconButton icon={'comment-multiple-outline'} iconColor={'purple'} size={22} />
              <Paragraph> {data.descendants} </Paragraph>
            </View>
          </View>
        </Card> :
        null
      }
    </>
  );
});

const styles = StyleSheet.create({
  flexRowContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
  },
});
