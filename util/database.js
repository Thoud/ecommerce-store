import camelcaseKeys from 'camelcase-keys';
import postgres from 'postgres';
require('dotenv-safe').config();

const sql = postgres();

async function getChocolates() {
  return camelcaseKeys(await sql`SELECT * FROM next_ecommerce_store`);
}

async function getChocolateById(id) {
  const chocolate = await sql`SELECT * FROM next_ecommerce_store WHERE id = ${id}`;
  return camelcaseKeys(chocolate[0]);
}

console.log(await getChocolates());
console.log(await getChocolateById(2));
