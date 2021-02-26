import camelcaseKeys from 'camelcase-keys';
import { Chocolate } from './types';
const postgres = require('postgres');
require('dotenv-safe').config();

const sql = postgres();

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
