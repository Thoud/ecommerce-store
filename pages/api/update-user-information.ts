import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken, insertUserInformation } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const newUserInfo = req.body;
  const checkSession = await getSessionByToken(req.cookies.session);

  if (checkSession?.userId !== newUserInfo.id) {
    return res.status(401).send({
      errorMessage: 'You are not logged in!',
    });
  }

  const user = await insertUserInformation(newUserInfo);

  if (!user) {
    return res.status(404).send({
      errorMessage: 'The user id does not exist!',
    });
  }

  res.send({
    errorMessage: null,
  });
}
