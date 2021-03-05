import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductInfo from '../components/ProductInfo';
import { getChocolates } from '../util/database';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolates: Chocolate[];
  orderArr: Order[];
};

export default function Checkout(props: Props) {
  const [order] = useState(props.orderArr);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (orderPlaced === true) {
      Cookies.remove('order');
      setOrderPlaced(false);
    }
  }, [orderPlaced]);

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Checkout | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Checkout</h1>

        <form>
          <h2>Shipping Information</h2>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" />

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" />

          <label htmlFor="address">Address</label>
          <input id="address" type="text" />

          <label htmlFor="city">City</label>
          <input id="city" type="text" />

          <label htmlFor="zip">ZIP Code</label>
          <input id="zip" type="text" />

          <h2>Contact information</h2>
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" />

          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" />

          <h2>Payment information</h2>
          <label htmlFor="card">Credit Card Number</label>
          <input id="card" type="text" />

          <label htmlFor="date">Expiration Date</label>
          <input id="date" type="month" />

          <label htmlFor="security">Security Code</label>
          <input id="security" type="text" />
        </form>

        <h2>Order Summary</h2>
        {props.chocolates.map((chocolate: Chocolate) => {
          return order.map((singleOrder: Order) => {
            let element;

            if (chocolate.id === singleOrder.id) {
              const amount =
                Number(chocolate.price.split(',').join('.')) *
                singleOrder.quantity;
              totalAmount += amount;

              element = (
                <div key={chocolate.id}>
                  <ProductInfo
                    id={chocolate.id}
                    src={chocolate.imgPath}
                    alt={chocolate.name}
                    width={200}
                    height={200}
                    name={chocolate.name}
                  />

                  <p>Quantity: {singleOrder.quantity}</p>
                  <p>Price: {chocolate.price} €</p>
                  <p>
                    Amount: {amount.toFixed(2).toString().split('.').join(',')}{' '}
                    €
                  </p>
                </div>
              );
            }

            return element;
          });
        })}
        <p>
          Total Amount: {totalAmount.toFixed(2).toString().split('.').join(',')}{' '}
          €
        </p>

        <Link href="/cart">
          <a>Back to cart</a>
        </Link>
        <Link href="/confirmation">
          <button onClick={() => setOrderPlaced(true)}>Place order</button>
        </Link>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  return {
    props: {
      chocolates: chocolates,
      orderArr: orderArr,
    },
  };
}
