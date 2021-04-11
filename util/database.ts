import camelcaseKeys from 'camelcase-keys';
import { paramCase } from 'param-case';
import { generateToken } from './sessions';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';
import {
  CheckoutInfo,
  Chocolate,
  Order,
  RecentOrder,
  Session,
  User,
} from './types';
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
  firstName: string,
  lastName: string,
  passwordHash: string,
): Promise<User> {
  const url = paramCase(username);

  const user = await sql`
    INSERT INTO users (username, first_name, last_name, password_hash, profile_url)
    VALUES (${username}, ${firstName}, ${lastName}, ${passwordHash}, ${url})
    RETURNING id, username, profile_url
  `;

  return camelcaseRecords(user)[0];
}

export async function insertUserInformation(
  userInfo: User,
): Promise<User | null> {
  const user = await sql`
    UPDATE
      users
    SET
      email = ${userInfo.email},
      first_name = ${userInfo.firstName},
      last_name = ${userInfo.lastName},
      birthday = ${userInfo.birthday},
      address = ${userInfo.address},
      city = ${userInfo.city},
      zip_code = ${userInfo.zipCode},
      phone_number = ${userInfo.phoneNumber}
    WHERE
      id = ${userInfo.id}
    RETURNING
      id, username
  `;

  if (!user) return null;

  return camelcaseRecords(user)[0];
}

export async function getUserByUsername(username: string): Promise<User> {
  const user = await sql`
    SELECT username FROM users WHERE username = ${username}
  `;

  return camelcaseRecords(user)[0];
}

export async function getShallowUserInformationById(
  id: number,
): Promise<User | null> {
  const user = await sql`
    SELECT username, first_name, last_name, profile_url FROM users WHERE id = ${id}
  `;

  if (!user) return null;

  return camelcaseRecords(user)[0];
}

export async function getUserInformationById(id: number): Promise<User | null> {
  const user = await sql`
    SELECT id, username, email, first_name, last_name, birthday, address, city, zip_code, phone_number FROM users WHERE id = ${id}
  `;

  if (!user) return null;

  return camelcaseRecords(user)[0];
}

export async function getUserInformationByUrl(
  url: string | string[] | undefined,
): Promise<User | null> {
  const user = await sql`
    SELECT id, username, email, first_name, last_name, birthday, address, city, zip_code, phone_number FROM users WHERE profile_url = ${url}
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

export async function insertOrderInformation(
  order: Order,
  checkoutInfo: CheckoutInfo,
  userId: number,
  stripeSessionId: string,
): Promise<RecentOrder | null> {
  const orderSet = await sql`
    INSERT INTO
      orders (order_information, first_name, last_name, address, city, zip_code, shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_zip_code, email, phone_number, stripe_session_id, payment_completed, user_id)
    VALUES
      (${JSON.stringify(order)}, ${checkoutInfo.firstName}, ${
    checkoutInfo.lastName
  }, ${checkoutInfo.address}, ${checkoutInfo.city}, ${checkoutInfo.zipCode}, ${
    checkoutInfo.shippingFirstName
  }, ${checkoutInfo.shippingLastName}, ${checkoutInfo.shippingAddress}, ${
    checkoutInfo.shippingCity
  }, ${checkoutInfo.shippingZipCode}, ${checkoutInfo.email}, ${
    checkoutInfo.phoneNumber
  }, ${stripeSessionId}, false, ${userId})
    RETURNING id
  `;

  if (!orderSet) return null;

  return camelcaseRecords(orderSet)[0];
}

// export async function getOrderInformationByUserId(
//   userId: number,
// ): Promise<RecentOrder | null> {}

export async function updatePaymentStatusOnOrder(
  stripeSessionId: string | string[] | undefined,
): Promise<RecentOrder | null> {
  const order = await sql`
    UPDATE
      orders
    SET
      payment_completed = true
    WHERE
      stripe_session_id = ${stripeSessionId}
    RETURNING *
  `;

  if (!order) return null;

  return camelcaseRecords(order)[0];
}
