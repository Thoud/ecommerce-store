import Head from 'next/head';
import Layout from '../components/Layout';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1 className="text-3xl">About</h1>
      </Layout>
    </>
  );
}
