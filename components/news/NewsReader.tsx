/* redux */
import { StyleSheet, Text, View} from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
/* types */
import type { INewsReaderScreenProps } from '../../customTypes';
import { useGetItemByIdQuery } from '../../store/api/api';

export default function NewsReader ({ navigation, route }:INewsReaderScreenProps) {

  const { storyId } = route.params;
  if (!storyId) {
    navigation.goBack();
    return null;
  }
  const { data, isFetching, isError } = useGetItemByIdQuery(storyId);

  if (isFetching) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.mainContainer}>
        <Text> Error Getting page </Text>
      </View>
    );
  }

  if (data && data?.type === "story") {

    return (
      <View style={{...styles.mainContainer, justifyContent: 'center'}}>
        <Text style={styles.margin}> Title: {data.title} </Text>
        <Text style={styles.margin}> Date: {new Date(data.time * 1000).toDateString()} </Text>
        <Text style={styles.margin}> URL: {data.url} </Text>
        <Text style={styles.margin}> Rating: {data.score} </Text>
        <Text style={styles.margin}> Comments: {data.descendants} </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  margin: {
    marginVertical: 8
  }
});