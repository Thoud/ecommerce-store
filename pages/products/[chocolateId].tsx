import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { changeOrder } from '../../util/cookies';
import { getChocolateById } from '../../util/database';
import { Chocolate, Order } from '../../util/types';

type Props = {
  chocolate: Chocolate | null;
  orderArr: Order[];
};

export default function ChocolateSinglePage(props: Props) {
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState(props.orderArr);

  useEffect(() => {
    Cookies.set('order', order, { expires: 7 });
  }, [order]);

  if (props.chocolate === null) {
    return (
      <>
        <Head>
          <title>Product Not Found | Chocolate Heaven</title>
        </Head>

        <Layout>
          <h1>Product Not Found</h1>
          <p>Please try again!</p>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{props.chocolate.name} | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>{props.chocolate.name}</h1>
        <Image
          src={props.chocolate.imgPath}
          alt={props.chocolate.name}
          width={400}
          height={400}
        />

        <p>Description</p>
        <p>{props.chocolate.description}</p>

        <p>Ingredients</p>
        <p>{props.chocolate.ingredients}</p>

        <p>Allergens</p>
        <p>{props.chocolate.allergens}</p>

        <p>{props.chocolate.price} €</p>

        <button
          onClick={() => {
            if (!(quantity - 1 === 0)) {
              setQuantity(quantity - 1);
            }
          }}
        >
          -
        </button>

        <p>{quantity}</p>

        <button onClick={() => setQuantity(quantity + 1)}>+</button>

        <button
          onClick={() => {
            if (props.chocolate?.id) {
              setOrder(changeOrder(order, props.chocolate.id, quantity));
            }
          }}
        >
          Add to cart
        </button>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolate = await getChocolateById(context.query.chocolateId);

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  return {
    props: {
      chocolate: chocolate,
      orderArr: orderArr,
    },
  };
}
