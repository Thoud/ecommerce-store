import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AddItemOverlay from '../../components/AddItemOverlay';
import Layout from '../../components/Layout';
import { addItemOverlayActions } from '../../store/addItemOverlaySlice';
import { changeOrder, orderQuantityReducer } from '../../util/cookies';
import { getChocolateById } from '../../util/database';
import { useAppDispatch, useAppSelector } from '../../util/hooks';
import { Chocolate, Order } from '../../util/types';

type Props = {
  chocolate: Chocolate | null;
  orderArr: Order[];
  orderQuantity: number;
};

export default function ChocolateSinglePage(props: Props) {
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState(props.orderArr);

  const overlay = useAppSelector((state) => state.addItemOverlay.open);
  const dispatch = useAppDispatch();

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
            <p className="font-semibold">Description</p>
            <p className="mb-10">{props.chocolate.description}</p>

            <p className="font-semibold">Ingredients</p>
            <p className="mb-10">{props.chocolate.ingredients}</p>

            <p className="font-semibold">Allergens</p>
            <p className="mb-10">{props.chocolate.allergens}</p>

            <p className="font-semibold">Price</p>
            <p className="mb-10 font-medium">{props.chocolate.price} €</p>

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
                dispatch(addItemOverlayActions.toggle(true));

                if (props.chocolate?.id) {
                  setOrder(changeOrder(order, props.chocolate.id, quantity));
                }
              }}
            >
              Add to cart
            </button>
          </div>
        </div>

        {overlay && <AddItemOverlay />}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolate = await getChocolateById(context.query.chocolateId);

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];
  const orderQuantity = orderQuantityReducer(orderArr);

  return {
    props: {
      chocolate: chocolate,
      orderArr: orderArr,
      orderQuantity: orderQuantity,
    },
  };
}
