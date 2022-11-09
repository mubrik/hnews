import * as SecureStore from 'expo-secure-store';
import { INewUser } from '../customTypes';

/* wrapper to save serialized value @ key to local store, rejecttion == fail */
export async function saveLocalStore(key: string, value: string): Promise<void> {
  return await SecureStore.setItemAsync(key, value);
}

/* wrapper to get serializd value @ key from local store, string or null */
export async function getLocalStore(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

/* wrapper to clear serialized value @ key from local store, rejection fail */
export async function clearLocalStore(key:string) {
  return SecureStore.deleteItemAsync(key);
}

/* wrapper function to validate passed in data */
export function validateAuthData({username, password, email}: Partial<INewUser>, mode: "register" | "login"): [boolean, string|null] {
  if (mode === "register" && !email) {
    // can use an email validator rege later
    return [true, "Invalid Email Supplied"];
  }

  if (!username || !password) {
    // can use a password validator regex later
    return [true, "Invalid Credentials supplied"];
  }

  if (username.length < 5 || password.length < 5) {
    return [true, "Length of credentials cannot be lower than 5"];
  }

  return [false, null];
}