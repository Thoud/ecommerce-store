import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AddItemOverlay from '../../components/AddItemOverlay';
import { addItemOverlayActions } from '../../store/addItemOverlaySlice';
import { orderSliceActions } from '../../store/orderSlice';
import { useAppDispatch, useAppSelector } from '../../util/hooks';
import { Chocolate } from '../../util/types';

type Props = {
  chocolates: Chocolate[] | null;
};

export default function ProductPage({ chocolates }: Props) {
  const overlay = useAppSelector((state) => state.itemOverlay.open);
  const dispatch = useAppDispatch();

  if (chocolates === null) {
    return (
      <div className="m-10">
        <Head>
          <title>Products Not Found | Chocolate Heaven</title>
        </Head>

        <h1>Product Not Found</h1>
        <p>Please try again!</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Products | Chocolate Heaven</title>
      </Head>

      <h1 className="mx-10 mt-10 h-5">Products</h1>

      <div className="flex flex-wrap justify-around mb-14">
        {chocolates.map((chocolate: Chocolate) => {
          return (
            <div
              key={chocolate.id}
              className="flex flex-col items-center justify-center w-72 mr-24 my-10"
            >
              <Link href={`/products/${chocolate.urlPath}`}>
                <a>
                  <Image
                    src={chocolate.imgPath}
                    alt={chocolate.name}
                    width={300}
                    height={300}
                  />
                </a>
              </Link>

              <p className="font-bold text-center mb-10">{chocolate.name}</p>

              <p className="font-semibold">Price</p>
              <p className="mb-10 font-medium">{chocolate.price} €</p>

              <button
                className="btn-link-style py-2"
                onClick={() => {
                  dispatch(addItemOverlayActions.toggle(true));

                  if (chocolate.id) {
                    dispatch(
                      orderSliceActions.changeItem({
                        chocolateId: chocolate.id,
                        quantity: 1,
                      }),
                    );
                  }
                }}
              >
                Add to cart
              </button>
            </div>
          );
        })}
      </div>

      {overlay && <AddItemOverlay />}
    </>
  );
}

export async function getServerSideProps() {
  const { getChocolates } = await import('../../util/database');

  const chocolates = await getChocolates();

  return {
    props: {
      chocolates,
    },
  };
}
