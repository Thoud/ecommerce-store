import Head from 'next/head';
import Link from 'next/link';

export default function Canceled() {
  return (
    <>
      <Head>
        <title>Transaction failed | Chocolate Heaven</title>
      </Head>

      <h1>Transaction failed</h1>
      <p>Please try again!</p>

      <Link href="/">
        <a>Home</a>
      </Link>
    </>
  );
}
