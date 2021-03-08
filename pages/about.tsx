import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Order } from '../util/types';

type Props = {
  orderQuantity: number;
};

export default function About(props: Props) {
  return (
    <>
      <Head>
        <title>About | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <h1 className="text-4xl mx-10 mt-10 h-5">About</h1>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  const orderQuantity = orderArr.reduce(
    (acc: number, val: Order) => acc + val.quantity,
    0,
  );

  return {
    props: {
      orderQuantity: orderQuantity,
    },
  };
}
