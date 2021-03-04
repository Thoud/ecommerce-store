import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';

export default function Confirmation() {
  return (
    <>
      <Head>
        <title>Thank you for your order | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Thank you for your order!</h1>
        <Image src="/background.jpg" alt="" width={1000} height={562.5} />
      </Layout>
    </>
  );
}
