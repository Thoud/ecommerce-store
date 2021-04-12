import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

      <h1 className="ml-10 mt-10 h-5 w-full">Checkout</h1>

      <form
        className="w-full my-10 ml-10 mr-20 flex flex-wrap justify-between"
        onSubmit={async (event) => {
          event.preventDefault();

          const stripe = await stripePromise;

          const url = window.location.href.split('/');
          const domainUrl = [url[0], '//', url[2]].join('');

          const sessionResponse = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order,
              domainUrl,
              email: checkoutInfo.email,
            }),
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
        <div className="mb-20">
          <h2 className="my-8">Billing information</h2>

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
            className="input-style"
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
            className="input-style"
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
            className="input-style"
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
            className="input-style"
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
            className="input-style"
          />
        </div>

        <div>
          <h2 className="w-96 my-8">Shipping information</h2>

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
                className="input-style"
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
                className="input-style"
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
                className="input-style"
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
                className="input-style"
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
                className="input-style"
              />
              <br />
            </>
          )}

          <label htmlFor="billingInfo">Different shipping location?</label>
          <input
            id="billingInfo"
            type="checkbox"
            onClick={() =>
              setCheckoutInfo({
                ...checkoutInfo,
                differentShippingLocation: !checkoutInfo.differentShippingLocation,
              })
            }
            className="input-style inline-block w-5 h-5 mt-0 ml-5"
          />
        </div>

        <div>
          <h2 className="my-8">Contact information</h2>

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
            className="input-style"
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
            className="input-style"
          />
        </div>

        <h2 className="mb-8 w-full">Order Summary</h2>
        <div className="w-full m-10 flex flex-wrap justify-evenly">
          {order.map((singleOrder: Order) => {
            const chocolateInOrder = chocolates.find(
              (chocolate: Chocolate) => chocolate.id === singleOrder.id,
            );

            let element;

            if (chocolateInOrder && chocolateInOrder.id === singleOrder.id) {
              const amount =
                Number(chocolateInOrder.price.split(',').join('.')) *
                singleOrder.quantity;
              totalAmount += amount;

              element = (
                <div key={chocolateInOrder.id} className="flex items-center">
                  <Link href={`/products/${chocolateInOrder.urlPath}`}>
                    <a>
                      <Image
                        src={chocolateInOrder.imgPath}
                        alt={chocolateInOrder.name}
                        width={200}
                        height={200}
                      />
                    </a>
                  </Link>
                  <div>
                    <p className="font-bold mb-6">{chocolateInOrder.name}</p>
                    <div className="flex">
                      <div className="mr-20">
                        <p className="font-semibold">Price</p>
                        <p>{chocolateInOrder.price} €</p>
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
          })}
        </div>

        <div className="mr-10 mt-10 mb-24 w-full">
          <p className="font-semibold">Total Amount</p>
          <p className="mb-10">
            {totalAmount.toFixed(2).toString().split('.').join(',')} €
          </p>

          <button type="submit" className="btn-link-style py-2 mr-20">
            Place order
          </button>

          <Link href="/cart">
            <a className="btn-link-style py-3">Back to cart</a>
          </Link>
        </div>

        <div className="text-red-700 font-bold text-center mb-10">{error}</div>
      </form>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getChocolates,
    getSessionByToken,
    getUserInformationById,
  } = await import('../util/database');

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
