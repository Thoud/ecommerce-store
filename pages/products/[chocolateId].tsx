import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AddItemOverlay from '../../components/AddItemOverlay';
import { addItemOverlayActions } from '../../store/addItemOverlaySlice';
import { orderSliceActions } from '../../store/orderSlice';
import { getChocolateById } from '../../util/database';
import { useAppDispatch, useAppSelector } from '../../util/hooks';
import { Chocolate } from '../../util/types';

type Props = {
  chocolate: Chocolate | null;
};

export default function ChocolateSinglePage({ chocolate }: Props) {
  const [quantity, setQuantity] = useState(1);

  const overlay = useAppSelector((state) => state.addItemOverlay.open);
  const dispatch = useAppDispatch();

  if (chocolate === null) {
    return (
      <>
        <Head>
          <title>Product Not Found | Chocolate Heaven</title>
        </Head>

        <h1 className="text-4xl">Product Not Found</h1>
        <p>Please try again!</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{chocolate.name} | Chocolate Heaven</title>
      </Head>

      <div className="flex items-center justify-center w-full">
        <div>
          <Link href={`/products/${chocolate.id}`}>
            <a>
              <Image
                src={chocolate.imgPath}
                alt={chocolate.name}
                width={600}
                height={600}
              />
            </a>
          </Link>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl mb-10">{chocolate.name}</h1>
          <p className="font-semibold">Description</p>
          <p className="mb-10">{chocolate.description}</p>

          <p className="font-semibold">Ingredients</p>
          <p className="mb-10">{chocolate.ingredients}</p>

          <p className="font-semibold">Allergens</p>
          <p className="mb-10">{chocolate.allergens}</p>

          <p className="font-semibold">Price</p>
          <p className="mb-10 font-medium">{chocolate.price} €</p>

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

              if (chocolate.id) {
                dispatch(
                  orderSliceActions.changeItem({
                    chocolateId: chocolate.id,
                    quantity: quantity,
                  }),
                );
              }
            }}
          >
            Add to cart
          </button>
        </div>
      </div>

      {overlay && <AddItemOverlay />}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolate = await getChocolateById(context.query.chocolateId);

  return {
    props: {
      chocolate: chocolate,
    },
  };
}
