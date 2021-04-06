import camelcaseKeys from 'camelcase-keys';
import { generateToken } from './sessions';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';
import { Chocolate } from './types';
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

function camelcaseRecords(records: Chocolate[]) {
  return records.map((record) => camelcaseKeys(record));
}

export async function getChocolates() {
  const chocolates = await sql`SELECT * FROM chocolates`;

  if (!chocolates.length) return null;

  return camelcaseRecords(chocolates);
}

export async function getChocolateById(id: string | string[] | undefined) {
  const chocolate = await sql`SELECT * FROM chocolates WHERE id = ${id}`;

  if (!chocolate.length) return null;

  return camelcaseRecords(chocolate)[0];
}

export async function getRandomChocolates() {
  const chocolates = await sql`
  SELECT * FROM chocolates ORDER BY RANDOM() LIMIT 5
  `;

  if (!chocolates.length) return null;

  return camelcaseRecords(chocolates);
}

export async function createSession() {
  const token = generateToken();

  const sessions = await sql`
    INSERT INTO sessions (token) VALUES (${token}) RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
}

export async function deleteSessionById(id: number) {
  const sessions = await sql`
    DELETE FROM sessions WHERE id = ${id} RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
}

export async function deleteAllExpiredSessions() {
  const sessions = await sql`
    DELETE FROM sessions WHERE expiry < NOW() RETURNING *
  `;

  return camelcaseRecords(sessions)[0];
}

export async function createUser(username: string, passwordHash: string) {
  const users = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `;

  return camelcaseRecords(users)[0];
}

export async function getUserByUsername(username: string) {
  const users = await sql`SELECT username FROM users WHERE username = ${username}`;

  return camelcaseRecords(users)[0];
}
