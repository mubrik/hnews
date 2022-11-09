import * as SQLite from 'expo-sqlite';
/* import bcrypt from 'bcryptjs'; */
/* types */
import { INewUser, IUserDetail, NoNullFields } from '../customTypes';
import { validateAuthData } from './wrappers';

/* the main db instance */
let _db: SQLite.WebSQLDatabase | null = null;
const ADMIN_PWORD = 'testing'; /* move to env confiig later */;

/**
 * @description: gets the DB object, sqlite not available web, cached.
*/
export function openDatabase() {

  if (_db === null) {
    /* if (Platform.OS === "web") {
      _db = {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    } */
    _db = SQLite.openDatabase("hackerdb.db");
  }

  return _db;
}

/**
 * @description: sets up the db tables
*/
export function setUpDatabase () {
  const db = openDatabase();
  /* create table */
  db.exec(
    [
      {sql: 'DROP TABLE IF EXISTS users;', args: []},
      {sql: 'DROP TABLE IF EXISTS roles;', args: []},
      {sql: 'DROP TABLE IF EXISTS users_roles;', args: []},
      {sql: `CREATE TABLE IF NOT EXISTS users (
          user_id INTEGER PRIMARY KEY,
          username text UNIQUE,
          email text UNIQUE,
          password text
        );`, args: []
      },
      {sql: `CREATE TABLE IF NOT EXISTS roles (
          role_id INTEGER PRIMARY KEY,
          name TEXT UNIQUE
        );`, args: []
      },
      {sql: `CREATE TABLE IF NOT EXISTS users_roles (
          id INTEGER PRIMARY KEY,
          user_id INTEGER,
          role_id INTEGER,
          FOREIGN KEY(user_id) REFERENCES users(user_id),
          FOREIGN KEY(role_id) REFERENCES roles(role_id)
        );`, args: []
      },
      {sql: `INSERT INTO roles (name) VALUES ('admin');`, args: []},
      {sql: `INSERT INTO roles (name) VALUES ('user');`, args: []},
      {sql: `INSERT INTO users (username, email, password) VALUES ('admin', 'admin@me.com', 'testing');`, args: []},
      {sql: `INSERT INTO users_roles (user_id, role_id) VALUES (1, 1);`, args: []},
      {sql: `PRAGMA foreign_keys=on;`, args: []},
    ],
    false,
    () => console.info("Tables Created")
  );

}

/**
 * @description: for testing queries on db
*/
export function queryDB () {
  const db = openDatabase();

  /* create table */
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM roles WHERE name == 'admin';`,
      undefined,
      (_, result) => console.log("result test query:", result)
    ), [ADMIN_PWORD]},
    (_err) => {
      // log error somewhere
      console.error(_err.message);
    }
  );
}

/**
 * @description: adds a usser to the db, performs checks on variables
*/
export async function registerUserDB ({ username, email, password }: INewUser): Promise<[NoNullFields<IUserDetail>|null , string|null]> {
  /* priv vars */
  return new Promise((resolve, reject) => {
    /* never trust frontend */
    const [_isErr, _errMsg] = validateAuthData({username, password, email}, "register");
    if (_isErr) {
      resolve([null, _errMsg]);
      return true;
    }

    /* check */
    doesUserExistDB(username)
      .then(result => {
        if (result) {
          resolve([null, "Account Exists, Try Login or Reset Password"]);
          return true;
        }
        const db = openDatabase();

        db.transaction((tx) => {
          tx.executeSql(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`,
            [username, email, password], /* hash password later */
            (_tx, result) => {
              if (result.insertId) {
                /* add base role */
                tx.executeSql(`INSERT INTO users_roles (user_id, role_id) VALUES (?, 2);`, [String(result.insertId)]);
                resolve([{ userId: String(result.insertId), username, email }, null]);
                return true;
              } else {
                resolve([null, "Error creating user"]);
                return true;
              }
            },
            (_tx, _err) => {
              console.error(_err.message);
              reject("sql error");
              return false;
            }
          )}
        );
      })
  });
}


/**
 * @description: checks user exist
*/
export async function doesUserExistDB (username: string): Promise<boolean> {

  const db = openDatabase();

  return new Promise((resolve, reject) => {
    /* exec tranx */
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * from users WHERE username = ?;",
        [username],
        (_tx, result) => {
          if (result.rows.length > 0) {
            resolve(true);
            return true;
          }
          resolve(false);
          return true;
        },
        (_tx, err) => {reject("Db Error"); return false;}
      )
    });
  });
}

/**
 * @description: adds a user to DB
*/
export async function signInUserDB ({ username, password }: Pick<INewUser, "username"|"password">): Promise<[NoNullFields<IUserDetail>|null , string|null]> {
  const db = openDatabase();

  /* priv vars */
  return new Promise((resolve, reject) => {

    /* never trust frontend */
    const [_isErr, _errMsg] = validateAuthData({username, password}, "login");
    if (_isErr) {
      resolve([null, _errMsg]);
      return true;
    }
    /* create table */
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * from users WHERE username = ?;",
        [username],
        (_tx, result) => {
          if (result.rows.length > 0) {
            /* no hashing */
            if (!(password === result.rows._array[0].password)) {
              resolve([null, "Incorrect Password"]);
              return true;
            }
            const _data = {
              userId: result.rows._array[0].user_id,
              username,
              email: result.rows._array[0].email
            }
            resolve([_data, null]);
            return true;
          } else {
            resolve([null, "User doesnt exist, Please register"]);
            return true;
          }
        },
        (_tx, err) => {
          reject(err.message);
          return false;
        }
      )
    });
  })
}
