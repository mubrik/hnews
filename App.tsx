/* Database */
import { setUpDatabase } from './store/setupDb';
/* redux */
import { Provider as StoreProvider} from 'react-redux';
import configureAppStore from './store/store';
/* navigation */
import { NavigationContainer } from '@react-navigation/native';
/* paper */
import { Provider as PaperProvider } from 'react-native-paper';
/* root component */
import Root from './components/Root';
import SnackBarProvider from './components/snackbar/SnackbarProvider';
import ThemeProvider from './components/theme/ThemeProvider';

/* config db */
setUpDatabase();
/* config redux store */
const store = configureAppStore();

export default function App() {
  return (
    <StoreProvider store={store}>
    <ThemeProvider>
    <SnackBarProvider>
      <Root />
    </SnackBarProvider>
    </ThemeProvider>
    </StoreProvider>
  );
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
