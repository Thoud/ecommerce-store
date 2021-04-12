import { NextApiRequest, NextApiResponse } from 'next';
import { getChocolates } from '../../util/database';
import { Chocolate, Order } from '../../util/types';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { order, domainUrl } = req.body;
  const chocolates = await getChocolates();

  const items = order.map((singleOrder: Order) => {
    const chocolateInOrder = chocolates.find(
      (chocolate: Chocolate) => chocolate.id === singleOrder.id,
    );
    let result;

    if (chocolateInOrder) {
      result = {
        price: chocolateInOrder.stripeId,
        quantity: singleOrder.quantity,
      };
    }

    return result;
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainUrl}/canceled`,
  });

  res.send({
    sessionId: session.id,
  });
}
