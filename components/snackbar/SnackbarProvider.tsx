import { useState, useCallback } from "react";
import { Snackbar } from "react-native-paper";
import createTypeContext from "../utils/createTypeContextUtil";

/* snackbar props that cna be changed */
interface ISnackbarProps {
  show: boolean;
  msg: string;
  action?: {
    name: string;
    callback(): void;
  };
}

interface IAppProps {
  children: React.ReactNode;
}

const [useSnackbar, Provider] = createTypeContext<(props:ISnackbarProps) => void>('snackbar');

export default function SnackBarProvider ({ children }: IAppProps) {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [action, setAction] = useState<ISnackbarProps['action']>();

  const closeSnack = () => setVisible(false);

  const changeSnack = ({show, msg, action}: ISnackbarProps) => {
    setVisible(show);
    setMsg(msg);
    setAction(action);
  };

  return (
    <Provider value={changeSnack}>
      {children}
      <Snackbar visible={visible} onDismiss={closeSnack} duration={4000}
        action={action ? {label: action.name, onPress: action.callback} : {label: 'dismiss', onPress: closeSnack}}
      >
        { msg }
      </Snackbar>
    </Provider>
  );
}
export { useSnackbar };