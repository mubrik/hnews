/* db */
import { signInUserDB, queryDB } from "../../store/setupDb";
/* redux */
import { useDispatch } from "react-redux";
import { authSignIn } from "../../store/authSlice";
/* react */
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, HelperText, ProgressBar } from "react-native-paper";
/* utils */
import { credValidator } from "./utils";
/* types */
import { ILoginScreenProps } from "../../customTypes";

export default function Signin ({ navigation }: ILoginScreenProps) {
  /* complex state, use reducer or lift state later */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passVisibility, setPassVisibility] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'user'|'pass'>('user');
  const [errorObj, setErrorObj] = useState<Record<string, string|null>>({user: null, pass: null, sync: null});
  const [isLoading, setIsLoading] = useState(false);
  /* red dis */
  const dispatch = useDispatch();
  /* useEffect(() => {
    queryDB();
  }, []); */

  async function handleLogin () {
    setIsLoading(true);
    /* mini validator */
    const [userErr, passErr] = credValidator({username, password});
    setErrorObj(prev => ({
      ...prev,
      user: userErr,
      pass: passErr,
      sync: null
    }));
    if (userErr || passErr) {
      return setIsLoading(false);
    }
    /* 'async' 'api' 'db' */
    setTimeout(async () => {
      const [_data, _error] = await signInUserDB({username, password});
      if (_error) {
        setErrorObj(prev => ({ ...prev, sync: _error}));
        return setIsLoading(false);
      }
      /* sign in */
      if (_data) {
        dispatch(authSignIn(_data));
      }
    }, 1200);
  };

  return (
    <View style={{paddingHorizontal: 8, flex: 1, justifyContent: 'center'}}>
      <View style={{marginBottom: 20}}>
        {
          isLoading ?
            <ProgressBar indeterminate={true} animatedValue={1} /> : null
        }
        <Text variant="headlineLarge"> Welcome to Hacker-News </Text>
      </View>
      <View style={{marginTop: 20}}>
        <View>
          <TextInput label={"Username"} value={username} onChangeText={txt => setUsername(txt)} mode="outlined"
            onFocus={() => setFocusedInput('user')} disabled={isLoading} />
          {
            (focusedInput === 'user' && (username.length > 0 && username.length < 4)) ?
            <HelperText type="info" visible={true}>
              Username must be more than 4 characters
            </HelperText> : null
          }
          {
            (!!errorObj['user']) ?
            <HelperText type="error" visible={!!errorObj['user']}>
              {errorObj['user']}
            </HelperText> : null
          }
        </View>
        <View>
          <TextInput
            secureTextEntry={!passVisibility}
            label={"Password"}
            value={password}
            onChangeText={txt => setPassword(txt)}
            mode="outlined"
            right={<TextInput.Icon icon="eye" onPress={() => setPassVisibility(prev => !prev)}/>}
            onFocus={() => setFocusedInput('pass')}
            disabled={isLoading}
          />
          {
            (focusedInput === 'pass' && password != '' && (password.length > 0 && password.length < 4)) ?
            <HelperText type="info" visible={true}>
              Password must be more than 4 characters
            </HelperText> : null
          }
          {
            (!!errorObj['pass']) ?
            <HelperText type="error" visible={true}>
              {errorObj['pass']}
            </HelperText> : null
          }
        </View>
      </View>
      <View style={{marginTop: 20, justifyContent: 'center'}}>
        {
          (!!errorObj['sync']) ?
          <HelperText type="error" visible={true}>
            {errorObj['sync']}
          </HelperText> : null
        }
        <Button mode="elevated" onPress={handleLogin} disabled={isLoading}>
          LOGIN
        </Button>
      </View>
      <View style={{display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 40}}>
        <Text> Need to register? </Text>
        <Button mode="outlined" onPress={() => navigation.navigate('register')}>
          REGISTER
        </Button>
      </View>
    </View>
  );
}
