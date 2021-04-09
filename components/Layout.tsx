import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { profileOverlayActions } from '../store/profileOverlaySlice';
import { useAppDispatch, useAppSelector } from '../util/hooks';
import { Order } from '../util/types';
import ProfileOverlay from './ProfileOverlay';

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  const orderQuantity = useAppSelector((state) =>
    state.order.order.reduce(
      (acc: number, val: Order) => acc + val.quantity,
      0,
    ),
  );
  const overlay = useAppSelector((state) => state.profileOverlay.open);
  const dispatch = useAppDispatch();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#685454" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className="z-10 w-full fixed top-0 flex items-center justify-between bg-secondary p-2 h-20">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Chocolate Heaven Logo"
            width={100}
            height={65}
          />
        </Link>
        <nav className="flex items-center">
          <button
            className="bg-tertiary mx-12 px-10 py-2 rounded-lg font-medium lg:mx-8 lg:px-6 lg:py-1.5 lg:text-sm md:mx-4 md:px-2.5 md:py-1"
            onClick={() => {
              dispatch(profileOverlayActions.toggle());
            }}
          >
            <Image
              src="/profile.svg"
              alt="Profile section"
              width={25}
              height={25}
            />
          </button>

          {overlay && <ProfileOverlay />}

          <Link href="/products">
            <a className="bg-tertiary mx-12 px-10 py-2 rounded-lg font-medium lg:mx-8 lg:px-6 lg:py-1.5 lg:text-sm md:mx-4 md:px-2.5 md:py-1">
              Products
            </a>
          </Link>

          <Link href="/about">
            <a className="bg-tertiary mx-12 px-10 py-2 rounded-lg font-medium lg:mx-8 lg:px-6 lg:py-1.5 lg:text-sm md:mx-4 md:px-2.5 md:py-1">
              About
            </a>
          </Link>

          <Link href="/cart">
            <a className="bg-tertiary mx-12 px-4 py-2 rounded-lg flex items-center lg:mx-8 lg:px-2 lg:py-1.5 lg:text-sm md:mx-4 md:px-2.5 md:py-1">
              <Image src="/cart.svg" alt="Cart Icon" width={25} height={25} />
              {orderQuantity !== 0 && (
                <div className="ml-2 font-semibold">{orderQuantity}</div>
              )}
            </a>
          </Link>
        </nav>
      </header>

      <main className="flex flex-wrap mt-20">{props.children}</main>

      <footer className="flex place-content-center bg-secondary py-3 h-14">
        <p className="text-primary text-lg text-center lg:text-sm">
          Made with{' '}
          <span role="img" aria-label="Heart">
            ❤️
          </span>{' '}
          in Vienna © 2021 Chocolate Heaven
        </p>
      </footer>
    </>
  );
}
