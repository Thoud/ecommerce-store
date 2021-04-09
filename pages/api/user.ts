import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken, getUserById } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSessionByToken(req.cookies.session);

  if (!session || !session.userId) {
    return res.send({ userInfo: null, sessionValid: false });
  }

  const userInfo = await getUserById(session.userId);

  res.send({ userInfo, sessionValid: true });
}
