import camelcaseKeys from 'camelcase-keys';
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

export async function getChocolates(): Promise<Chocolate[] | null> {
  const chocolates = await sql`SELECT * FROM chocolates`;

  if (!chocolates.length) return null;

  return camelcaseRecords(chocolates);
}

export async function getChocolateById(
  id: string | string[] | undefined,
): Promise<Chocolate | null> {
  const chocolate = await sql`SELECT * FROM chocolates WHERE id = ${id}`;

  if (!chocolate.length) return null;

  return camelcaseRecords(chocolate)[0];
}

export async function getRandomChocolates(): Promise<Chocolate[] | null> {
  const chocolates = await sql`
  SELECT * FROM chocolates ORDER BY RANDOM() LIMIT 5
  `;

  if (!chocolates.length) return null;

  return camelcaseRecords(chocolates);
}

export async function createSession(userId: number): Promise<Session> {
  const token = generateToken();

  const sessions = await sql`
    INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId}) RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
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

export async function deleteSessionByToken(token: string): Promise<Session> {
  const sessions = await sql`
    DELETE FROM sessions WHERE token = ${token} RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
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
  const users = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
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

export async function getUserWithHashedPasswordByUsername(
  username: string,
): Promise<User> {
  const users = await sql`
    SELECT * FROM users WHERE username = ${username}
  `;

  return camelcaseRecords(users)[0];
}
