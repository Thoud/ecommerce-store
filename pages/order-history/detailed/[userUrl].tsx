import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Chocolate,
  Order,
  RecentOrder,
  StripeSession,
} from '../../../util/types';

type Props = {
  order: RecentOrder | null;
  stripeSession: StripeSession;
  chocolates: Chocolate[];
};

export default function OrderHistory({
  order,
  stripeSession,
  chocolates,
}: Props) {
  if (!order) {
    return (
      <div>
        <Head>
          <title>Detailed History | Chocolate Heaven</title>
        </Head>
        <h1 className="m-10">Order history</h1>;
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Detailed History | Chocolate Heaven</title>
      </Head>

      <h1 className="m-10 h-5">Order history</h1>

      <div className="flex">
        <div className="m-10 mr-32">
          <h2 className="mb-5">Order details</h2>

          <div className="flex mb-20">
            <div className="mr-14 w-max">
              <p className="font-semibold">Order number</p>
              <p>Date</p>
              <p>First name</p>
              <p>Last name</p>
              <p>Email</p>
              <p>Phone number</p>
              <p>Total amount</p>
              <p>Payment status</p>
            </div>

            <div>
              <p className="font-semibold">
                {stripeSession.stripeId.split('').slice(33).join('')}
              </p>
              <p>{order.orderDate.split(' ')[0]}</p>
              <p>{order.firstName}</p>
              <p>{order.lastName}</p>
              <p>{order.email}</p>
              <p>{order.phoneNumber || '/'}</p>
              <p>{stripeSession.total}</p>
              <p>{stripeSession.paymentStatus}</p>
            </div>
          </div>

          <h2 className="mb-5">Shipping address</h2>

          <div className="flex">
            <div className="mr-14">
              <p>Street and house number</p>
              <p>City</p>
              <p>ZIP code</p>
            </div>

            <div>
              {order.shippingAddress && (
                <>
                  <p>{order.shippingAddress}</p>
                  <p>{order.shippingCity}</p>
                  <p>{order.shippingZipCode}</p>
                </>
              )}
              {!order.shippingAddress && (
                <>
                  <p>{order.address}</p>
                  <p>{order.city}</p>
                  <p>{order.zipCode}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mt-10">Product overview</h2>

          <div className="flex flex-wrap">
            {order.orderInformation.map((item: Order) => {
              const chocolateInOrder = chocolates.find(
                (chocolate: Chocolate) => chocolate.id === item.id,
              );

              let element;

              if (chocolateInOrder) {
                const amount =
                  Number(chocolateInOrder.price.split(',').join('.')) *
                  item.quantity;

                element = (
                  <div key={chocolateInOrder.id} className="flex items-center">
                    <Link href={`/products/${chocolateInOrder.urlPath}`}>
                      <a>
                        <Image
                          src={chocolateInOrder.imgPath}
                          alt={chocolateInOrder.name}
                          width={200}
                          height={200}
                        />
                      </a>
                    </Link>
                    <div>
                      <p className="font-semibold mb-6">
                        {chocolateInOrder.name}
                      </p>
                      <div className="flex">
                        <div className="mr-20">
                          <p className="font-semibold">Price</p>
                          <p>{chocolateInOrder.price} €</p>
                        </div>

                        <div className="mr-20">
                          <p className="font-semibold">Quantity</p>
                          <p>{item.quantity}</p>
                        </div>

                        <div className="mr-20">
                          <p className="font-semibold">Amount</p>
                          <p>
                            {amount.toFixed(2).toString().split('.').join(',')}{' '}
                            €
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return element;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getChocolates,
    getSessionByToken,
    getSingleOrderByStripeId,
    getUserInformationByUrl,
  } = await import('../../../util/database');

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const stripeId = context.query.session_id;

  if (!stripeId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

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

  const order = await getSingleOrderByStripeId(stripeId);
  const chocolates = await getChocolates();

  if (!order) {
    return {
      props: {
        orders: null,
        chocolates: null,
      },
    };
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(
    order.stripeSessionId,
  );

  const amountTotal = String(stripeSession.amount_total).split('');

  const decimal = amountTotal.slice(amountTotal.length - 2).join('');
  const num = amountTotal.slice(0, amountTotal.length - 2).join('');

  return {
    props: {
      order,
      stripeSession: {
        stripeId: stripeSession.id,
        total: [num, decimal].join(','),
        paymentStatus: stripeSession.payment_status,
      },
      chocolates,
    },
  };
}
