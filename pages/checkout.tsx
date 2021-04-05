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

export default function Checkout({ chocolates }: Props) {
  const order = useAppSelector((state) => state.order.order);
  const dispatch = useAppDispatch();

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Checkout | Chocolate Heaven</title>
      </Head>

      <h1 className="text-4xl ml-10 mt-10 h-5 w-full">Checkout</h1>

      <form className="w-full my-10 ml-10 mr-60 flex flex-wrap justify-between">
        <div>
          <h2 className="text-3xl my-8">Shipping Information</h2>

          <label htmlFor="firstName">First Name</label>
          <br />
          <input
            id="firstName"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="lastName">Last Name</label>
          <br />
          <input
            id="lastName"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="address">Address</label>
          <br />
          <input
            id="address"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="zip">ZIP Code</label>
          <br />
          <input
            id="zip"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
        </div>

        <div>
          <h2 className="text-3xl my-8">Contact information</h2>

          <label htmlFor="email">Email Address</label>
          <br />
          <input
            id="email"
            type="email"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="phone">Phone Number</label>
          <br />
          <input
            id="phone"
            type="tel"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
        </div>

        <div>
          <h2 className="text-3xl my-8">Payment information</h2>

          <label htmlFor="card">Credit Card Number</label>
          <br />
          <input
            id="card"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="date">Expiration Date</label>
          <br />
          <input
            id="date"
            type="month"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="security">Security Code</label>
          <br />
          <input
            id="security"
            type="text"
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
        </div>
      </form>

      <div className="w-full m-10 flex flex-wrap justify-evenly">
        <h2 className="text-3xl my-8 w-full">Order Summary</h2>
        {chocolates.map((chocolate: Chocolate) => {
          return order.map((singleOrder: Order) => {
            let element;

            if (chocolate.id === singleOrder.id) {
              const amount =
                Number(chocolate.price.split(',').join('.')) *
                singleOrder.quantity;
              totalAmount += amount;

              element = (
                <div key={chocolate.id} className="flex items-center">
                  <Link href={`/products/${chocolate.id}`}>
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

                      <div className="mr-20">
                        <p className="font-semibold">Quantity</p>
                        <p>{singleOrder.quantity}</p>
                      </div>

                      <div className="mr-20">
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

        <Link href="/confirmation">
          <button
            className="bg-tertiary rounded-lg font-medium px-4 py-1.5 mr-20 w-52"
            onClick={() => dispatch(orderSliceActions.placeOrder())}
          >
            Place order
          </button>
        </Link>

        <Link href="/cart">
          <button className="bg-tertiary rounded-lg font-medium px-4 py-1.5 w-52">
            Back to cart
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
