import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* comps */
import Home from './home/Home';
import Signin from "./auth/Signin";
import Register from "./auth/Register";
import { RightHeader, LeftHeader } from "./home/HomeHeader";
import NewsReader from "./news/NewsReader";
/* selector */
import { selectIsAuth } from "../store/authSlice";
/* types */
import type { RootStackParamList } from "../customTypes";
/* create stack */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root () {
  const isAuth = useSelector(selectIsAuth);

  return (
    <>
      {
        isAuth ?
        <Stack.Navigator>
          <Stack.Screen name="home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="news" component={NewsReader} initialParams={{ storyId: 0 }} options={{headerRight: () => <RightHeader />}}/>
        </Stack.Navigator> :
        <Stack.Navigator screenOptions={{headerRight: () => <RightHeader />, headerLeft: () => <LeftHeader />}} >
          <Stack.Screen name="login" component={Signin} options={{title: "Login"}} />
          <Stack.Screen name="register" component={Register} options={{title: "Register"}} />
        </Stack.Navigator>
      }
    </>
  );
}
