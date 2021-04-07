import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../util/auth';
import { serializeSecureCookieServerSide } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password } = req.body;

  const userAlreadyExists =
    typeof (await getUserByUsername(username)) !== 'undefined';

  if (userAlreadyExists) {
    return res
      .status(409)
      .send({ errorMessage: 'User already exists', user: null });
  }

  const passwordHash = await hashPassword(password);

  const userInfo = await createUser(username, passwordHash);

  const session = await createSession(userInfo.id);

  const sessionCookie = serializeSecureCookieServerSide(
    'session',
    session.token,
  );

  res.setHeader('Set-Cookie', sessionCookie);

  res.send({
    user: {
      id: userInfo.id,
      username: userInfo.username,
    },
  });
}
