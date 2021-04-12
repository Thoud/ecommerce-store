import Head from 'next/head';
import Link from 'next/link';

export default function Canceled() {
  return (
    <div>
      <Head>
        <title>Transaction failed | Chocolate Heaven</title>
      </Head>

      <h1 className="m-10">Transaction failed</h1>
      <p className="text-xl font-semibold m-10 mb-20">Please try again!</p>

      <Link href="/">
        <a className="btn-link-style py-3 m-10">Home</a>
      </Link>
    </div>
  );
}
