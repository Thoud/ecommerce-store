import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// ! Change the type of props
export default function Layout(props: any) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#685454" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header>
        <Image
          src="/logo.png"
          alt="Chocolate Heaven Logo"
          width={178}
          height={80}
        />
        <nav>
          <Link href="/login">
            <a>Login</a>
          </Link>

          <Link href="/products">
            <a>Products</a>
          </Link>

          <Link href="/about">
            <a>About</a>
          </Link>

          <Link href="/cart">
            <a>
              <Image src="/cart.svg" alt="Cart Icon" width={25} height={25} />
            </a>
          </Link>
        </nav>
      </header>

      <main>{props.children}</main>

      <footer>
        <p>
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
