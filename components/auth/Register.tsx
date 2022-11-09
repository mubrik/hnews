/* db */
import { registerUserDB } from "../../store/setupDb";
/* redux */
import { useDispatch } from "react-redux";
import { authSignIn } from "../../store/authSlice";
/* react */
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text, HelperText } from "react-native-paper";
/* utils */
import { credValidator } from "./utils";
/* types */
import type { IRegisterScreenProps } from "../../customTypes";

export default function Register ({ navigation }: IRegisterScreenProps) {
  /* complex state, use reducer or lift state later */
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<'user'|'pass'|'mail'>('user');
  const [passVisibility, setPassVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<Record<string, string|null>>({user: null, pass: null, mail: null, sync: null});
  /* red dis */
  const dispatch = useDispatch();

  async function handleRegister () {
    setIsLoading(true);
    /* mini validator */
    const [userErr, passErr, emalErr] = credValidator({username, password, email});
    setErrorObj(prev => ({
      ...prev,
      user: userErr,
      pass: passErr,
      mail: emalErr,
      sync: null
    }));
    if (userErr || passErr || emalErr) {
      return ;
    }
    /* emulating a delay */
    /* DB async */
    setTimeout(async () => {
      const [_data, _error] = await registerUserDB({username, email, password});
      if (_error) {
        setErrorObj(prev => ({ ...prev, sync: _error}));
        return;
      }
      if (_data) {
        dispatch(authSignIn(_data));
      }
    }, 1200);
  };

  return (
    <View style={{paddingHorizontal: 8, flex: 1, justifyContent: 'center'}}>
      <View style={{marginBottom: 20}}>
        <Text variant="headlineLarge"> Register on Hacker-News </Text>
      </View>
      <View style={{marginTop: 20}}>
        <View>
          <TextInput label={"Username"} value={username} onChangeText={txt => setUsername(txt)} mode="outlined"
            onFocus={() => setFocusedInput('user')} disabled={isLoading}
          />
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
          <TextInput label={"Email"} value={email} onChangeText={txt => setEmail(txt)} mode="outlined" disabled={isLoading}/>
          {
            (!!errorObj['mail']) ?
            <HelperText type="error" visible={!!errorObj['mail']}>
              {errorObj['mail']}
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
      <View style={{marginTop: 20}}>
        {
          (!!errorObj['sync']) ?
          <HelperText type="error" visible={true}>
            {errorObj['sync']}
          </HelperText> : null
        }
        <Button mode="elevated" onPress={handleRegister} disabled={isLoading}>
          REGISTER
        </Button>
      </View>
      <View style={{display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 40}}>
        <Text> Have an Account? </Text>
        <Button mode="outlined" onPress={() => navigation.navigate('login')}>
          LOGIN
        </Button>
      </View>
    </View>
  );
}
