import { NextApiRequest, NextApiResponse } from 'next';
import { checkPasswordAgainstPasswordHash } from '../../util/auth';
import { serializeSecureCookieServerSide } from '../../util/cookies';
import {
  createSession,
  getSessionByToken,
  getUserWithHashedPasswordByUsername,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = req.body;
  const checkSession = await getSessionByToken(req.cookies.session);

  if (checkSession) {
    return res.status(403).send({
      errorMessage: 'You are already logged in!',
      profileUrl: null,
    });
  }

  const userInfo = await getUserWithHashedPasswordByUsername(user.username);

  if (!userInfo || !userInfo.username) {
    return res.status(401).send({
      errorMessage: 'Username or password are incorrect!',
      profileUrl: null,
    });
  }

  const passwordMatches = await checkPasswordAgainstPasswordHash(
    user.password,
    userInfo.passwordHash,
  );

  if (!passwordMatches) {
    return res.status(401).send({
      errorMessage: 'Username or password are incorrect!',
      profileUrl: null,
    });
  }

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
