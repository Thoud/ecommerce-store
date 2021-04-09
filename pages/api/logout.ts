import { NextApiRequest, NextApiResponse } from 'next';
import { serializeEmptyCookieServerSide } from '../../util/cookies';
import { deleteSessionByToken } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const deletedSession = await deleteSessionByToken(req.cookies.session);

  const emptyCookie = serializeEmptyCookieServerSide('session');

  res.setHeader('Set-Cookie', emptyCookie);

  res.send({
    deletedSession,
  });
}
