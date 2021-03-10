import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Overlay from '../../components/Overlay';
import ProductInfo from '../../components/ProductInfo';
import { changeOrder } from '../../util/cookies';
import { getChocolateById } from '../../util/database';
import { Chocolate, Order } from '../../util/types';

type Props = {
  chocolate: Chocolate | null;
  orderArr: Order[];
  orderQuantity: number;
};

export default function ChocolateSinglePage(props: Props) {
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState(props.orderArr);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    Cookies.set('order', order, { expires: 7 });
  }, [order]);

  if (props.chocolate === null) {
    return (
      <>
        <Head>
          <title>Product Not Found | Chocolate Heaven</title>
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
        <title>{props.chocolate.name} | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <div className="flex items-center justify-center w-full">
          <div>
            <Link href={`/products/${props.chocolate.id}`}>
              <a>
                <Image
                  src={props.chocolate.imgPath}
                  alt={props.chocolate.name}
                  width={600}
                  height={600}
                />
              </a>
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl mb-10">{props.chocolate.name}</h1>

            <ProductInfo
              description={props.chocolate.description}
              ingredients={props.chocolate.ingredients}
              allergens={props.chocolate.allergens}
              price={props.chocolate.price}
            />

            <div className="flex items-center mb-10">
              <button
                className="bg-tertiary rounded-lg font-medium px-3 py-1"
                onClick={() => {
                  if (!(quantity - 1 === 0)) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                -
              </button>

              <p className="mx-4 font-semibold">{quantity}</p>

              <button
                className="bg-tertiary rounded-lg font-medium px-3 py-1"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              className="bg-tertiary rounded-lg font-medium px-4 py-1"
              onClick={() => {
                setOverlay(true);

                if (props.chocolate?.id) {
                  setOrder(changeOrder(order, props.chocolate.id, quantity));
                }
              }}
            >
              Add to cart
            </button>
          </div>
        </div>

        {overlay && <Overlay setOverlay={setOverlay} />}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolate = await getChocolateById(context.query.chocolateId);

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  const orderQuantity = orderArr.reduce(
    (acc: number, val: Order) => acc + val.quantity,
    0,
  );

  return {
    props: {
      chocolate: chocolate,
      orderArr: orderArr,
      orderQuantity: orderQuantity,
    },
  };
}
