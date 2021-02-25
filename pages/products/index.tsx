import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getChocolates } from '../../util/database';
import { Chocolate } from '../../util/types';

type Props = {
  chocolates: Chocolate[] | null;
};

export default function About(props: Props) {
  if (props.chocolates === null) {
    return (
      <>
        <Head>
          <title>Products | Chocolate Heaven</title>
        </Head>

        <Layout>Loading...</Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Products | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Products</h1>
        {props.chocolates.map((chocolate: Chocolate) => {
          return (
            <Link href={`/products/${chocolate.id}`} key={chocolate.id}>
              <div>
                <Image
                  src={chocolate.imgPath}
                  alt={chocolate.name}
                  width={200}
                  height={200}
                />
                <p>{chocolate.name}</p>
                <p>€ {chocolate.price}</p>
              </div>
            </Link>
          );
        })}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  if (!chocolates) {
    context.res.statusCode = 404;
  }

  return {
    props: {
      chocolates: chocolates || null,
    },
  };
}
