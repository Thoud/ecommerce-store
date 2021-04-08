import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSessionByToken } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const deletedSession = await deleteSessionByToken(req.body);

  res.send({
    deletedSession,
  });
}
