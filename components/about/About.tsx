/* react, natve */
import { View, Image, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useDarkMode } from "../theme/ThemeProvider";
import * as Linking from 'expo-linking';
/* types */
import type { IAboutScreenProps } from "../../customTypes";

export default function About (props: IAboutScreenProps) {

  const darkMode = useDarkMode();

  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
      <Text variant="headlineLarge" style={styles.text}> Welcome to Hacker News </Text>
      <Text variant="labelLarge" style={styles.text}> Latest News at your Fingertip </Text>
      <View style={{marginTop: 30, alignItems: 'center'}}>
        <Image
            style={{ width: 150, height: 150}}
            source={darkMode ?  require('../../assets/avi.png') : require('../../assets/avi2.png')}
          />
      </View>
      <View style={{marginTop: 20}}>
        <Text variant="bodyLarge" style={styles.text}> Hi, I'm Mubarak Yahaya. I develop software using magic and a little bit of code. </Text>
        <Text variant="bodyLarge" style={styles.text}> My Dev powers includes: Typescript, Python, C and Thanos Gloves </Text>
      </View>
      <View style={{display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 40}}>
        <Button mode="outlined" onPress={() => Linking.openURL('https://github.com/mubrik')}> GITHUB </Button>
        <Button mode="outlined" onPress={() => Linking.openURL('https://mubrik.com')}> PORTFOLIO </Button>
        <Button mode="outlined" onPress={() => Linking.openURL('mailto: mubarakg4u@gmail.com')}> MAIL </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center'
  }
})