import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken, insertOrderInformation } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user, order, checkoutInfo, stripeSessionId } = req.body;

  const session = await getSessionByToken(req.cookies.session);

  if (user.id && session?.userId && user.id !== session.userId) {
    return res.status(401).send({
      errorMessage:
        'Your user id does not match witch your session id. Try logging out or deleting your cookies manually and logging in again!',
    });
  }

  const orderSet = await insertOrderInformation(
    order,
    checkoutInfo,
    user.id,
    stripeSessionId,
  );

  if (!orderSet) {
    return res.status(400).send({
      errorMessage: 'Sorry, something went wrong. Please try again!',
    });
  }

  res.send({
    errorMessage: null,
  });
}
