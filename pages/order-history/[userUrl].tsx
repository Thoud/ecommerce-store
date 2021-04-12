import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RecentOrder, StripeSession, User } from '../../util/types';

type Props = {
  orders: RecentOrder[] | null;
  stripeSessions: StripeSession[];
  user: User;
};

export default function OrderHistory({ orders, stripeSessions, user }: Props) {
  if (!orders) {
    return (
      <>
        <Head>
          <title>Order History | Chocolate Heaven</title>
        </Head>
        <h1>Order history</h1>;
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order History | Chocolate Heaven</title>
      </Head>

      <h1>Order history</h1>

      {stripeSessions.map((session, index) => {
        return (
          <div key={session.stripeId}>
            <div>
              <b>Transaction number</b>
              <p>Date</p>
              <p>Total amount</p>
              <p>Payment status</p>
            </div>

            <div>
              <b>{session.stripeId}</b>
              <p>{orders[index].orderDate.split(' ')[0]}</p>
              <p>{session.total}</p>
              <p>{session.paymentStatus}</p>
            </div>

            <Link
              href={`/order-history/detailed/${user.profileUrl}?session_id=${session.stripeId}`}
            >
              <a>See details</a>
            </Link>
          </div>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getOrderInformationByUserId,
    getSessionByToken,
    getUserInformationByUrl,
  } = await import('../../util/database');

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const session = await getSessionByToken(context.req.cookies.session);
  const user = await getUserInformationByUrl(context.query.userUrl);

  if (!user || !session || session.userId !== user.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const orders = await getOrderInformationByUserId(user.id);

  if (!orders) {
    return {
      props: {
        orders: null,
      },
    };
  }

  const stripeSessions = await Promise.all(
    orders.map(async (order: RecentOrder) => {
      const stripeInfo = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId,
      );

      const amountTotal = String(stripeInfo.amount_total).split('');

      const decimal = amountTotal.slice(amountTotal.length - 2).join('');
      const num = amountTotal.slice(0, amountTotal.length - 2).join('');

      return {
        stripeId: stripeInfo.id,
        total: [num, decimal].join(','),
        paymentStatus: stripeInfo.payment_status,
      };
    }),
  );

  return {
    props: {
      orders: orders.reverse(),
      stripeSessions: stripeSessions.reverse(),
      user,
    },
  };
}
