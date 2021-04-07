import { NextApiRequest, NextApiResponse } from 'next';
import { checkPasswordAgainstPasswordHash } from '../../util/auth';
import { serializeSecureCookieServerSide } from '../../util/cookies';
import {
  createSession,
  getUserWithHashedPasswordByUsername,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password } = req.body;
  const userLoggedIn = req.cookies.session;

  if (userLoggedIn) {
    return res.status(403).send({
      errorMessage: 'You are already logged in!',
      user: null,
    });
  }

  const userInfo = await getUserWithHashedPasswordByUsername(username);

  if (!userInfo.username) {
    return res.status(401).send({
      errorMessage: 'Username or password are incorrect!',
      user: null,
    });
  }

  const passwordMatches = await checkPasswordAgainstPasswordHash(
    password,
    userInfo.passwordHash,
  );

  if (!passwordMatches) {
    return res.status(401).send({
      errorMessage: 'Username or password are incorrect!',
      user: null,
    });
  }

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
