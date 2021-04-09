import camelcaseKeys from 'camelcase-keys';
import { paramCase } from 'param-case';
import { generateToken } from './sessions';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';
import { Chocolate, Session, User } from './types';
const postgres = require('postgres');

setPostgresDefaultsOnHeroku();

require('dotenv-safe').config();

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    const gThis: any = globalThis;

    if (!gThis.__postgresSqlClient) {
      gThis.__postgresSqlClient = postgres();
    }
    sql = gThis.__postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

function camelcaseRecords(records: any) {
  return records.map((record: any) => camelcaseKeys(record));
}

export async function getChocolates(): Promise<Chocolate[]> {
  const chocolates = await sql`SELECT * FROM chocolates`;

  return camelcaseRecords(chocolates);
}

export async function getChocolateByUrl(
  url: string | string[] | undefined,
): Promise<Chocolate | null> {
  const chocolate = await sql`SELECT * FROM chocolates WHERE url_path = ${url}`;

  if (!chocolate.length) return null;

  return camelcaseRecords(chocolate)[0];
}

export async function getRandomChocolates(): Promise<Chocolate[]> {
  const chocolates = await sql`
  SELECT * FROM chocolates ORDER BY RANDOM() LIMIT 5
  `;

  return camelcaseRecords(chocolates);
}

export async function createSession(userId: number): Promise<Session> {
  const token = generateToken();

  const session = await sql`
    INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId}) RETURNING *
  `;

  return camelcaseRecords(session)[0];
}

export async function getSessionByToken(
  sessionToken: string,
): Promise<Session | null> {
  if (!sessionToken) return null;

  const session = await sql`
    SELECT * FROM sessions
    WHERE token = ${sessionToken} AND expiry > NOW()
  `;

  return camelcaseRecords(session)[0];
}

export async function deleteSessionByToken(
  token: string,
): Promise<Session | null> {
  const session = await sql`
    DELETE FROM sessions WHERE token = ${token} RETURNING *
  `;

  if (!session) return null;

  return camelcaseRecords(session)[0];
}

export async function deleteAllExpiredSessions(): Promise<Session> {
  const sessions = await sql`
    DELETE FROM sessions WHERE expiry < NOW() RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
}

export async function createUser(
  username: string,
  passwordHash: string,
): Promise<User> {
  const url = paramCase(username);

  const users = await sql`
    INSERT INTO users (username, password_hash, profile_url)
    VALUES (${username}, ${passwordHash}, ${url})
    RETURNING id, username, profile_url
  `;

  return camelcaseRecords(users)[0];
}

export async function getUserByUsername(username: string): Promise<User> {
  const user = await sql`SELECT username FROM users WHERE username = ${username}`;

  return camelcaseRecords(user)[0];
}

export async function getUserById(userId: number): Promise<User> {
  const user = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;

  return camelcaseRecords(user)[0];
}

export async function getUserByUrl(
  url: string | string[] | undefined,
): Promise<User | null> {
  const user = await sql`
    SELECT * FROM users WHERE profile_url = ${url}
  `;

  if (!user) return null;

  return camelcaseRecords(user)[0];
}

export async function getUserWithHashedPasswordByUsername(
  username: string,
): Promise<User | null> {
  const user = await sql`
    SELECT * FROM users WHERE username = ${username}
  `;

  if (!user) return null;

  return camelcaseRecords(user)[0];
}
