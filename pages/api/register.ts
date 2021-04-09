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
  const user = req.body;

  const userAlreadyExists =
    typeof (await getUserByUsername(user.username)) !== 'undefined';

  if (userAlreadyExists) {
    return res
      .status(409)
      .send({ errorMessage: 'User already exists', profileUrl: null });
  }

  const passwordHash = await hashPassword(user.password);

  const userInfo = await createUser(
    user.username,
    user.firstName,
    user.lastName,
    passwordHash,
  );

  const session = await createSession(userInfo.id);

  const sessionCookie = serializeSecureCookieServerSide(
    'session',
    session.token,
  );

  res.setHeader('Set-Cookie', sessionCookie);

  res.send({
    errorMessage: null,
    profileUrl: userInfo.profileUrl,
  });
}
