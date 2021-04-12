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

      <header className="z-10 w-full fixed top-0 flex items-center justify-between bg-secondary py-2 pr-2 h-20">
        <div className="bg-primary cursor-pointer px-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Chocolate Heaven Logo"
              width={111}
              height={73}
            />
          </Link>
        </div>
        <nav className="flex items-center">
          <button
            className="btn-link-style py-1.5 mx-12"
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
            <a className="btn-link-style py-2.5 mx-12">Products</a>
          </Link>

          <Link href="/about">
            <a className="btn-link-style py-2.5 mx-12">About</a>
          </Link>

          <Link href="/cart">
            <a className="btn-link-style py-2.5 px-8 center-items mx-12 cursor-pointer">
              <Image src="/cart.svg" alt="Cart Icon" width={25} height={25} />
            </a>
          </Link>

          {orderQuantity !== 0 && (
            <div className="relative ml-2 font-semibold text-white right-20 -top-2 cursor-pointer">
              {orderQuantity}
            </div>
          )}
        </nav>
      </header>

      <main className="flex flex-wrap pt-20">{props.children}</main>

      <footer className="center-items bg-secondary py-3 h-14">
        <p className="text-primary text-lg text-center">
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
