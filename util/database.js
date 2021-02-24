import camelcaseKeys from 'camelcase-keys';
import postgres from 'postgres';
require('dotenv-safe').config();

const sql = postgres();

function camelcaseRecords(records) {
  return records.map((record) => camelcaseKeys(record));
}

export async function getChocolates() {
  const chocolates = await sql`SELECT * FROM next_ecommerce_store`;
  return camelcaseRecords(chocolates);
}

export async function getChocolateById(id) {
  const chocolate = await sql`SELECT * FROM next_ecommerce_store WHERE id = ${id}`;
  return camelcaseRecords(chocolate[0]);
}

console.log(await getChocolates());
console.log(await getChocolateById(2));
