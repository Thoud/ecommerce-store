import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { orderSliceActions } from '../store/orderSlice';
import { useAppDispatch } from '../util/hooks';
import { Chocolate, Order, RecentOrder } from '../util/types';

type Props = {
  orderInformation: RecentOrder | null;
  chocolates: Chocolate[];
  stripeTotalAmount: string;
};

export default function Success({
  orderInformation,
  chocolates,
  stripeTotalAmount,
}: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(orderSliceActions.placeOrder());
  }, [dispatch]);

  if (!orderInformation) {
    return (
      <div>
        <Head>
          <title>No transaction made | Chocolate Heaven</title>
        </Head>

        <h1 className="m-10">You have not made a transaction!</h1>
        <h3 className="m-10">Please go to checkout first.</h3>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Transaction successful | Chocolate Heaven</title>
      </Head>

      <h1 className="m-10">Thank you for your order!</h1>

      <h2 className="m-10">Transaction successful</h2>

      <div className="flex">
        <div className="m-10 mr-32">
          <h2 className="mb-5">Order details</h2>

          <div className="flex mb-20">
            <div className="mr-14 w-max">
              <p className="font-semibold">Order number</p>
              <p>First name</p>
              <p>Last name</p>
              <p>Email</p>
              <p>Phone number</p>
              <p className="font-semibold">Total Amount</p>
            </div>

            <div>
              <p className="font-semibold">
                {orderInformation.stripeSessionId.split('').slice(33).join('')}
              </p>
              <p>{orderInformation.firstName}</p>
              <p>{orderInformation.lastName}</p>
              <p>{orderInformation.email}</p>
              <p>{orderInformation.phoneNumber || '/'}</p>
              <p className="mb-10 font-semibold">{stripeTotalAmount} €</p>
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
              {orderInformation.shippingAddress && (
                <>
                  <p>{orderInformation.shippingAddress}</p>
                  <p>{orderInformation.shippingCity}</p>
                  <p>{orderInformation.shippingZipCode}</p>
                </>
              )}
              {!orderInformation.shippingAddress && (
                <>
                  <p>{orderInformation.address}</p>
                  <p>{orderInformation.city}</p>
                  <p>{orderInformation.zipCode}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mt-10">Product overview</h2>

          <div className="flex flex-wrap">
            {orderInformation.orderInformation.map((item: Order) => {
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
  const { getChocolates, updatePaymentStatusOnOrder } = await import(
    '../util/database'
  );

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const { session_id: sessionId } = context.query;

  if (sessionId) {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    const chocolates = await getChocolates();

    if (stripeSession.payment_status === 'paid') {
      const orderInformation = await updatePaymentStatusOnOrder(sessionId);

      const amountTotal = String(stripeSession.amount_total).split('');

      const decimal = amountTotal.slice(amountTotal.length - 2).join('');
      const num = amountTotal.slice(0, amountTotal.length - 2).join('');

      return {
        props: {
          orderInformation,
          chocolates,
          stripeTotalAmount: [num, decimal].join(','),
        },
      };
    }
  }

  return {
    props: {
      orderInformation: null,
      chocolates: null,
    },
  };
}
