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

        <Layout>
          <h1 className="text-3xl">Product Not Found</h1>
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

      <Layout>
        <h1 className="text-3xl">Products</h1>
        {props.chocolates.map((chocolate: Chocolate) => {
          return (
            <div key={chocolate.id}>
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
