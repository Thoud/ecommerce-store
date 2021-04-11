import Link from 'next/link';

export default function Canceled() {
  return (
    <>
      <h1>Transaction failed</h1>
      <p>Please try again!</p>

      <Link href="/">
        <a>Home</a>
      </Link>
    </>
  );
}
