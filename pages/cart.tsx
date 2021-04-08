import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { orderSliceActions } from '../store/orderSlice';
import { getChocolates } from '../util/database';
import { useAppDispatch, useAppSelector } from '../util/hooks';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolates: Chocolate[];
};

export default function Cart({ chocolates }: Props) {
  const order = useAppSelector((state) => state.order.order);
  const dispatch = useAppDispatch();

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Shopping Cart | Chocolate Heaven</title>
      </Head>

      <h1 className="text-4xl m-10 h-5 w-full">Cart</h1>
      <div className="flex flex-wrap justify-evenly">
        {chocolates.map((chocolate: Chocolate) => {
          return order.map((singleOrder: Order) => {
            let element;

            if (chocolate.id === singleOrder.id) {
              const amount =
                Number(chocolate.price.split(',').join('.')) *
                singleOrder.quantity;
              totalAmount += amount;

              element = (
                <div key={chocolate.id} className="flex items-center mx-36">
                  <Link href={`/products/${chocolate.urlPath}`}>
                    <a>
                      <Image
                        src={chocolate.imgPath}
                        alt={chocolate.name}
                        width={200}
                        height={200}
                      />
                    </a>
                  </Link>
                  <div>
                    <p className="font-semibold mb-6">{chocolate.name}</p>

                    <div className="flex">
                      <div className="mr-20">
                        <p className="font-semibold">Price</p>
                        <p>{chocolate.price} €</p>
                      </div>

                      <div className="flex items-center mr-20">
                        <button
                          className="bg-tertiary rounded-lg font-medium px-3 py-1"
                          onClick={() => {
                            if (singleOrder.quantity - 1 === 0) {
                              dispatch(
                                orderSliceActions.removeItem(chocolate.id),
                              );
                            } else {
                              dispatch(
                                orderSliceActions.changeItem({
                                  chocolateId: chocolate.id,
                                  quantity: -1,
                                }),
                              );
                            }
                          }}
                        >
                          -
                        </button>

                        <p className="mx-4 font-semibold">
                          Quantity: {singleOrder.quantity}
                        </p>

                        <button
                          className="bg-tertiary rounded-lg font-medium px-3 py-1"
                          onClick={() => {
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
                          +
                        </button>
                      </div>

                      <div>
                        <p className="font-semibold">Amount</p>
                        <p>
                          {amount.toFixed(2).toString().split('.').join(',')} €
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return element;
          });
        })}
      </div>

      <div className="mx-10 mt-10 mb-24 w-full">
        <p className="font-semibold">Total Amount</p>
        <p className="mb-10">
          {totalAmount.toFixed(2).toString().split('.').join(',')} €
        </p>

        <Link href="/checkout">
          <button className="bg-tertiary rounded-lg font-medium px-4 py-1.5">
            Go to Checkout
          </button>
        </Link>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const chocolates = await getChocolates();

  return {
    props: {
      chocolates: chocolates,
    },
  };
}
