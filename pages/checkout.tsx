import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  getChocolates,
  getSessionByToken,
  getUserInformationById,
} from '../util/database';
import { useAppSelector } from '../util/hooks';
import { CheckoutInfo, Chocolate, Order, User } from '../util/types';

type Props = {
  chocolates: Chocolate[];
  stripeKey: string;
  user: User;
};

export default function Checkout({ chocolates, user, stripeKey }: Props) {
  const order = useAppSelector((state) => state.order.order);
  const [error, setError] = useState('');
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    zipCode: user.zipCode,
    differentShippingLocation: false,
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZipCode: '',
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  const stripePromise = loadStripe(stripeKey);

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Checkout | Chocolate Heaven</title>
      </Head>

      <h1 className="text-4xl ml-10 mt-10 h-5 w-full">Checkout</h1>

      <form
        className="w-full my-10 ml-10 mr-60 flex flex-wrap justify-between"
        onSubmit={async (event) => {
          event.preventDefault();

          const stripe = await stripePromise;

          const sessionResponse = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
          });

          const session = await sessionResponse.json();

          const dbResponse = await fetch('/api/order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user,
              order,
              checkoutInfo,
              stripeSessionId: session.sessionId,
            }),
          });

          const { errorMessage } = await dbResponse.json();

          if (errorMessage) {
            return setError(errorMessage);
          }

          if (stripe) {
            const result = await stripe.redirectToCheckout({
              sessionId: session.sessionId,
            });

            if (result.error.message) {
              return setError(result.error.message);
            }
          }
        }}
      >
        <div>
          <h2 className="text-3xl my-8">Billing information</h2>

          <label htmlFor="firstName">First Name</label>
          <br />
          <input
            id="firstName"
            type="text"
            required
            defaultValue={user.firstName}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                firstName: target.value,
              })
            }
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="lastName">Last Name</label>
          <br />
          <input
            id="lastName"
            type="text"
            required
            defaultValue={user.lastName}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                lastName: target.value,
              })
            }
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="address">Address</label>
          <br />
          <input
            id="address"
            type="text"
            required
            defaultValue={user.address}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                address: target.value,
              })
            }
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            required
            defaultValue={user.city}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                city: target.value,
              })
            }
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="zip">ZIP Code</label>
          <br />
          <input
            id="zip"
            type="text"
            required
            defaultValue={user.zipCode}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                zipCode: target.value,
              })
            }
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
        </div>

        <div>
          <h2 className="text-3xl my-8">Shipping information</h2>

          {checkoutInfo.differentShippingLocation && (
            <>
              <label htmlFor="firstName">First Name</label>
              <br />
              <input
                id="firstName"
                type="text"
                required
                onChange={({ target }) =>
                  setCheckoutInfo({
                    ...checkoutInfo,
                    shippingFirstName: target.value,
                  })
                }
                className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
              />
              <br />

              <label htmlFor="lastName">Last Name</label>
              <br />
              <input
                id="lastName"
                type="text"
                required
                onChange={({ target }) =>
                  setCheckoutInfo({
                    ...checkoutInfo,
                    shippingLastName: target.value,
                  })
                }
                className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
              />
              <br />
              <label htmlFor="address">Address</label>
              <br />
              <input
                id="address"
                type="text"
                required
                onChange={({ target }) =>
                  setCheckoutInfo({
                    ...checkoutInfo,
                    shippingAddress: target.value,
                  })
                }
                className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
              />
              <br />

              <label htmlFor="city">City</label>
              <br />
              <input
                id="city"
                type="text"
                required
                onChange={({ target }) =>
                  setCheckoutInfo({
                    ...checkoutInfo,
                    shippingCity: target.value,
                  })
                }
                className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
              />
              <br />

              <label htmlFor="zip">ZIP Code</label>
              <br />
              <input
                id="zip"
                type="text"
                required
                onChange={({ target }) =>
                  setCheckoutInfo({
                    ...checkoutInfo,
                    shippingZipCode: target.value,
                  })
                }
                className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
              />
              <br />
            </>
          )}

          <label htmlFor="billingInfo">Set different shipping location</label>
          <input
            id="billingInfo"
            type="checkbox"
            onClick={() =>
              setCheckoutInfo({
                ...checkoutInfo,
                differentShippingLocation: !checkoutInfo.differentShippingLocation,
              })
            }
          />
        </div>

        <div>
          <h2 className="text-3xl my-8">Contact information</h2>

          <label htmlFor="email">Email Address</label>
          <br />
          <input
            id="email"
            type="email"
            required
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                email: target.value,
              })
            }
            defaultValue={user.email}
            className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
          />
          <br />

          <label htmlFor="phone">Phone Number</label>
          <br />
          <input
            id="phone"
            type="tel"
            defaultValue={user.phoneNumber}
            onChange={({ target }) =>
              setCheckoutInfo({
                ...checkoutInfo,
                phoneNumber: target.value,
              })
            }
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

        <div className="w-full m-10 flex flex-wrap justify-evenly">
          <h2 className="text-3xl my-8 w-full">Order Summary</h2>

          {/* ! Change this logic */}
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

                        <div className="mr-20">
                          <p className="font-semibold">Quantity</p>
                          <p>{singleOrder.quantity}</p>
                        </div>

                        <div className="mr-20">
                          <p className="font-semibold">Amount</p>
                          <p>
                            {amount.toFixed(2).toString().split('.').join(',')}{' '}
                            €
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

          <button
            type="submit"
            className="bg-tertiary rounded-lg font-medium px-4 py-1.5 mr-20 w-52"
          >
            Place order
          </button>

          <Link href="/cart">
            <a className="bg-tertiary rounded-lg font-medium px-4 py-1.5 w-52">
              Back to cart
            </a>
          </Link>
        </div>

        <div>{error}</div>
      </form>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  const session = await getSessionByToken(context.req.cookies.session);

  const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;

  if (session) {
    const user = await getUserInformationById(session.userId);

    if (user) {
      return {
        props: {
          chocolates,
          stripeKey,
          user,
        },
      };
    }
  }

  return {
    props: {
      chocolates,
      stripeKey,
      user: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        email: '',
        phoneNumber: '',
      },
    },
  };
}
