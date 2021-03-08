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
  orderQuantity: number;
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

      <Layout orderQuantity={props.orderQuantity}>
        <h1 className="text-4xl m-10 h-5 w-full">Cart</h1>
        <div className="flex flex-wrap justify-evenly">
          {props.chocolates.map((chocolate: Chocolate) => {
            return order.map((singleOrder: Order) => {
              let element;

              if (chocolate.id === singleOrder.id) {
                const amount =
                  Number(chocolate.price.split(',').join('.')) *
                  singleOrder.quantity;
                totalAmount += amount;

                element = (
                  <div key={chocolate.id} className="flex items-center mx-36">
                    <ProductInfo
                      id={chocolate.id}
                      src={chocolate.imgPath}
                      alt={chocolate.name}
                      width={200}
                      height={200}
                    />

                    <div>
                      <p className="font-semibold mb-6">{chocolate.name}</p>

                      <div className="flex">
                        <div className="mr-20">
                          <p className="font-semibold">Price</p>
                          <p>{chocolate.price} €</p>
                        </div>

                        <div className="flex items-center mr-20">
                          <button
                            className="bg-tertiary rounded-lg font-medium px-3 py-1"
                            onClick={() => {
                              if (singleOrder.quantity - 1 === 0) {
                                setOrder(
                                  removeItemFromOrder(order, chocolate.id),
                                );
                              } else {
                                setOrder(changeOrder(order, chocolate.id, -1));
                              }
                            }}
                          >
                            -
                          </button>

                          <p className="mx-4 font-semibold">
                            Quantity: {singleOrder.quantity}
                          </p>

                          <button
                            className="bg-tertiary rounded-lg font-medium px-3 py-1"
                            onClick={() => {
                              if (chocolate.id) {
                                setOrder(changeOrder(order, chocolate.id, 1));
                              }
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div>
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
            });
          })}
        </div>

        <div className="mx-10 mt-10 mb-24 w-full">
          <p className="font-semibold">Total Amount</p>
          <p className="mb-10">
            {totalAmount.toFixed(2).toString().split('.').join(',')} €
          </p>

          <Link href="/checkout">
            <button className="bg-tertiary rounded-lg font-medium px-4 py-1.5">
              Go to Checkout
            </button>
          </Link>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  const orderQuantity = orderArr.reduce(
    (acc: number, val: Order) => acc + val.quantity,
    0,
  );

  return {
    props: {
      chocolates: chocolates,
      orderArr: orderArr,
      orderQuantity: orderQuantity,
    },
  };
}
