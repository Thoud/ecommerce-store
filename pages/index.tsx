import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Welcome to Chocolate Heaven</h1>
      </Layout>
    </>
  );
}
