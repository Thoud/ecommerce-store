import camelcaseKeys from 'camelcase-keys';
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
