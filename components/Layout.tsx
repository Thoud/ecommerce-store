import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#685454" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className="flex items-center justify-between bg-secondary p-2 h-20">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Chocolate Heaven Logo"
            width={142.4}
            height={64}
          />
        </Link>
        <nav className="flex items-center">
          <Link href="/">
            <a className="bg-tertiary mx-12 px-10 py-2 rounded-lg font-medium lg:mx-8 lg:px-6 lg:py-1.5 lg:text-sm md:mx-4 md:px-2.5 md:py-1">
              Home
            </a>
          </Link>

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
            </a>
          </Link>
        </nav>
      </header>

      <main>{props.children}</main>

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
