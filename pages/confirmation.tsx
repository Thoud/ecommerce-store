import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';

export default function Confirmation() {
  return (
    <>
      <Head>
        <title>Thank you for your order | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={0}>
        <Image src="/confirmation.jpg" alt="" width={1920} height={800} />
        <h1 className="text-8xl fixed top-2/4 left-2/4 -ml-96 -mt-12">
          Thank you for your order!
        </h1>
      </Layout>
    </>
  );
}
