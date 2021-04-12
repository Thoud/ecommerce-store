import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import AddItemOverlay from '../../components/AddItemOverlay';
import { addItemOverlayActions } from '../../store/addItemOverlaySlice';
import { orderSliceActions } from '../../store/orderSlice';
import { quantityActions } from '../../store/quantitySlice';
import { useAppDispatch, useAppSelector } from '../../util/hooks';
import { Chocolate } from '../../util/types';

type Props = {
  chocolate: Chocolate | null;
};

export default function ChocolateSinglePage({ chocolate }: Props) {
  const quantity = useAppSelector((state) => state.quantity.quantity);
  const overlay = useAppSelector((state) => state.itemOverlay.open);
  const dispatch = useAppDispatch();

  if (chocolate === null) {
    return (
      <div>
        <Head>
          <title>Product Not Found | Chocolate Heaven</title>
        </Head>

        <h1 className="m-10">Product Not Found</h1>
        <p className="m-10">Please try again!</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{chocolate.name} | Chocolate Heaven</title>
      </Head>

      <div className="flex items-center justify-center w-full">
        <Image
          src={chocolate.imgPath}
          alt={chocolate.name}
          width={600}
          height={600}
        />

        <div className="max-w-3xl">
          <h1 className="mb-10">{chocolate.name}</h1>
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
              className="text-white bg-tertiary rounded-lg font-medium px-3 py-1"
              onClick={() => {
                if (!(quantity - 1 === 0)) {
                  dispatch(quantityActions.decrement());
                }
              }}
            >
              -
            </button>

            <p className="mx-4 font-semibold">{quantity}</p>

            <button
              className="bg-tertiary text-white rounded-lg font-medium px-3 py-1"
              onClick={() => dispatch(quantityActions.increment())}
            >
              +
            </button>
          </div>
          <button
            className="btn-link-style py-2"
            onClick={() => {
              dispatch(addItemOverlayActions.toggle(true));

              if (chocolate.id) {
                dispatch(
                  orderSliceActions.changeItem({
                    chocolateId: chocolate.id,
                    quantity: quantity,
                  }),
                );
                dispatch(quantityActions.reset());
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
  const { getChocolateByUrl } = await import('../../util/database');

  const chocolate = await getChocolateByUrl(context.query.chocolateUrl);

  return {
    props: {
      chocolate,
    },
  };
}
