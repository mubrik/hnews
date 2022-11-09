import { saveLocalStore, getLocalStore, clearLocalStore } from '../../store/wrappers';
import type { IUserDetail } from '../../customTypes';

const USER_KEY = "hnews-user"/* move to env later */;

export const storeAuthUser = async (args: IUserDetail) => {
  try {
    if (typeof args === "undefined") return;
    /* serialize */
    const jsonV = JSON.stringify(args);
    await saveLocalStore(USER_KEY, jsonV);
    return true;
  } catch (error) {
    return false;
  }
};

export const getAuthUser = async (): Promise<IUserDetail | null> => {
  try {
    const userObj = await getLocalStore(USER_KEY);
    /* parse */
    return userObj === null ? null : JSON.parse(userObj) as IUserDetail;
  } catch (error) {
    return null;
  }
};

/* clear auth user from local store */
export const clearAuthUser = async () => {
  return clearLocalStore(USER_KEY);
};
