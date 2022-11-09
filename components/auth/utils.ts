export const lengthValidator = (str: string, len: number) => str.length > len;
export const emailValidator = (str:string) => str.includes('@');

export const credValidator = ({ username, password, email }:{username: string; password: string; email?: string}) => {
  const retArray: string[] = ['', '', ''];

  if (!lengthValidator(username, 4)) {
    retArray[0] = 'Username must be over 4 characters';
  }

  if (!lengthValidator(password, 4)) {
    retArray[1] = 'Password must be over 4 characters';
  }

  if (email && !emailValidator(email)) {
    retArray[2] = 'Email is Invalid';
  }

  return retArray;
};
