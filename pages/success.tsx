import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { orderSliceActions } from '../store/orderSlice';
import { getChocolates, updatePaymentStatusOnOrder } from '../util/database';
import { useAppDispatch } from '../util/hooks';
import { Chocolate, Order, RecentOrder } from '../util/types';

type Props = {
  orderInformation: RecentOrder;
  chocolates: Chocolate[];
};

export default function Success({ orderInformation, chocolates }: Props) {
  const dispatch = useAppDispatch();
  let totalAmount = 0;

  useEffect(() => {
    dispatch(orderSliceActions.placeOrder());
  }, [dispatch]);

  if (!orderInformation.id) {
    return (
      <h1>You have not made a transaction. Please go to checkout first!</h1>
    );
  }

  return (
    <>
      <h1>Transaction successful</h1>

      <h2>Order details</h2>

      <div>
        <b>Transaction number</b>
        <p>First name</p>
        <p>Last name</p>
        <p>Email</p>
        <p>Phone number</p>
      </div>

      <div>
        <p>{orderInformation.stripeSessionId}</p>
        <p>{orderInformation.firstName}</p>
        <p>{orderInformation.lastName}</p>
        <p>{orderInformation.email}</p>
        <p>{orderInformation.phoneNumber}</p>
      </div>

      <h2>Shipping address</h2>

      <div>
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

      <h2>Product overview</h2>

      {orderInformation.orderInformation.map((item: Order) => {
        const chocolateInOrder = chocolates.find(
          (chocolate: Chocolate) => chocolate.id === item.id,
        );

        let element;

        if (chocolateInOrder) {
          const amount =
            Number(chocolateInOrder.price.split(',').join('.')) * item.quantity;

          totalAmount += amount;

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
                <p className="font-semibold mb-6">{chocolateInOrder.name}</p>
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
                    <p>{amount.toFixed(2).toString().split('.').join(',')} €</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return element;
      })}

      <div>
        <p className="font-semibold">Total Amount</p>
        <p className="mb-10">
          {totalAmount.toFixed(2).toString().split('.').join(',')} €
        </p>
      </div>

      <Link href="/">
        <a>Home</a>
      </Link>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const { session_id: sessionId } = context.query;

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

  const chocolates = await getChocolates();

  if (stripeSession.payment_status === 'paid') {
    const orderInformation = await updatePaymentStatusOnOrder(sessionId);

    return {
      props: {
        orderInformation,
        chocolates,
      },
    };
  }

  return {
    props: {
      orderInformation: null,
      chocolates: null,
    },
  };
}
