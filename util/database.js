import camelcaseKeys from 'camelcase-keys';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';
const postgres = require('postgres');
require('dotenv-safe').config();

setPostgresDefaultsOnHeroku();

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

function camelcaseRecords(records) {
  return records.map((record) => camelcaseKeys(record));
}

export async function getChocolates() {
  const chocolates = await sql`SELECT * FROM chocolates`;

  if (!chocolates.length) return null;

  return camelcaseRecords(chocolates);
}

export async function getChocolateById(id) {
  const chocolate = await sql`SELECT * FROM chocolates WHERE id = ${id}`;

  if (!chocolate.length) return null;

  return camelcaseRecords(chocolate)[0];
}
