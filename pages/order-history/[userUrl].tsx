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
      <div>
        <Head>
          <title>Order History | Chocolate Heaven</title>
        </Head>
        <h1 className="m-10">Order history</h1>;
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Order History | Chocolate Heaven</title>
      </Head>

      <h1 className="m-10 mb-20">Order history</h1>

      <div className="mb-10 flex flex-wrap w-full">
        {stripeSessions.map((session, index) => {
          return (
            <div
              className="ml-10 mb-32 mr-20 flex flex-wrap"
              key={session.stripeId}
            >
              <div className="mr-10">
                <p className="font-bold">Order number</p>
                <p>Date</p>
                <p>Total amount</p>
                <p className="font-semibold">Payment status</p>
              </div>

              <div className="mb-7 w-52">
                <p className="font-bold">
                  {session.stripeId.split('').slice(33).join('')}
                </p>
                <p>{orders[index].orderDate.split('.')[0]}</p>
                <p>{session.total}</p>
                <p className="font-semibold">{session.paymentStatus}</p>
              </div>

              <div className="w-full">
                <Link
                  href={`/order-history/detailed/${user.profileUrl}?session_id=${session.stripeId}`}
                >
                  <a className="btn-link-style px-8 py-2.5">See details</a>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
