import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { IconButton, Menu, Button, useTheme } from "react-native-paper";
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { authSignOut, selectIsAuth } from '../../store/authSlice';
import { useDarkMode } from "../theme/ThemeProvider";
/* types */
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export function LeftHeader () {

  return (
    <View style={styles.flexRowContainer}>
      <Image
        style={{ width: 50, height: 50 }}
        source={require('../../assets/splachHnIcon.png')}
      />
    </View>
  );
}

export function StoryListScreenHeader ({ navigation, route }: NativeStackHeaderProps) {

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleNav = (to: 'top' | 'latest') => {
    closeMenu();
    navigation.navigate(to);
  }

  return (
    <View style={{...styles.headerBar}}>
      <View>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../../assets/splachHnIcon.png')}
        />
      </View>
      <View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>{ route.name === 'top' ? 'Top' : 'Latest'}</Button>}>
          <Menu.Item onPress={() => handleNav('top')} title="Top" />
          <Menu.Item onPress={() => handleNav('latest')} title="Latest" />
        </Menu>
      </View>
      <View style={{marginLeft: 'auto'}}>
        <RightHeader />
      </View>
    </View>
  );
}

export function RightHeader () {

  const dispatch = useDispatch();
  const { darkMode, setDarkMode } = useDarkMode();
  const isAuth = useSelector(selectIsAuth);

  return (
    <View style={styles.flexRowContainer}>
      <IconButton animated icon={darkMode ? 'lightbulb-variant' : 'lightbulb-variant-outline'} size={20}
        onPress={() => setDarkMode(dMode => !dMode)}
      />
      {isAuth ? <IconButton icon={'logout'} size={20} animated onPress={() => dispatch(authSignOut())}/> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center"
  },
  headerBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    padding: 4,
    paddingHorizontal: 8,
    marginTop: 20,
  }
});