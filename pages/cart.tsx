import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductInfo from '../components/ProductInfo';
import { changeOrder, removeItemFromOrder } from '../util/cookies';
import { getChocolates } from '../util/database';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolates: Chocolate[];
  orderArr: Order[];
};

export default function Cart(props: Props) {
  const [order, setOrder] = useState(props.orderArr);

  useEffect(() => {
    Cookies.set('order', order, { expires: 7 });
  }, [order]);

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Shopping Cart | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1 className="text-3xl">Cart</h1>
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
                    width={300}
                    height={300}
                    name={chocolate.name}
                  />

                  <button
                    onClick={() => {
                      if (singleOrder.quantity - 1 === 0) {
                        setOrder(removeItemFromOrder(order, chocolate.id));
                      } else {
                        setOrder(changeOrder(order, chocolate.id, -1));
                      }
                    }}
                  >
                    -
                  </button>
                  <p>Quantity: {singleOrder.quantity}</p>
                  <button
                    onClick={() => {
                      if (chocolate.id) {
                        setOrder(changeOrder(order, chocolate.id, 1));
                      }
                    }}
                  >
                    +
                  </button>

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

        <Link href="/checkout">
          <a>Go to Checkout</a>
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
