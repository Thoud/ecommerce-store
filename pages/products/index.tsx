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
          <title>Products Not Found | Chocolate Heaven</title>
        </Head>

        <Layout>
          <h1>Product Not Found</h1>
          <p>Please try again!</p>
        </Layout>
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
            <div key={chocolate.id}>
              <Link href={`/products/${chocolate.id}`}>
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

              <button>Add to cart</button>
            </div>
          );
        })}
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const chocolates = await getChocolates();

  return {
    props: {
      chocolates: chocolates,
    },
  };
}
