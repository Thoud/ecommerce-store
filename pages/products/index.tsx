import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ProductInfo from '../../components/ProductInfo';
import { changeOrder } from '../../util/cookies';
import { getChocolates } from '../../util/database';
import { Chocolate, Order } from '../../util/types';

type Props = {
  chocolates: Chocolate[] | null;
  orderArr: Order[];
  orderQuantity: number;
};

export default function ProductPage(props: Props) {
  const [order, setOrder] = useState(props.orderArr);

  useEffect(() => {
    Cookies.set('order', order, { expires: 7 });
  }, [order]);

  if (props.chocolates === null) {
    return (
      <>
        <Head>
          <title>Products Not Found | Chocolate Heaven</title>
        </Head>

        <Layout orderQuantity={props.orderQuantity}>
          <h1 className="text-4xl">Product Not Found</h1>
          <p>Please try again!</p>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Products | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <h1 className="text-4xl mx-10 mt-10 h-5">Products</h1>

        <div className="flex flex-wrap justify-around mb-14">
          {props.chocolates.map((chocolate: Chocolate) => {
            return (
              <div
                key={chocolate.id}
                className="flex flex-col items-center justify-center w-72 mr-24 my-10"
              >
                <ProductInfo
                  id={chocolate.id}
                  src={chocolate.imgPath}
                  alt={chocolate.name}
                  width={300}
                  height={300}
                  name={chocolate.name}
                  price={chocolate.price}
                />

                <button
                  className="bg-tertiary rounded-lg font-medium px-4 py-1"
                  onClick={() => {
                    if (chocolate.id) {
                      setOrder(changeOrder(order, chocolate.id, 1));
                    }
                  }}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
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
