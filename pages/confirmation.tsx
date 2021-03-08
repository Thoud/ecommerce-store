import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { Order } from '../util/types';

type Props = {
  orderQuantity: number;
};

export default function Confirmation(props: Props) {
  return (
    <>
      <Head>
        <title>Thank you for your order | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <Image src="/confirmation.jpg" alt="" width={1920} height={800} />
        <h1 className="text-8xl fixed top-2/4 left-2/4 -ml-96 -mt-12">
          Thank you for your order!
        </h1>
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
