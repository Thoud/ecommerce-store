import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getChocolateById } from '../util/database';
import { Chocolate } from '../util/types';

type Props = {
  chocolateSelection: Chocolate[] | null;
};

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>Home | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Welcome to Chocolate Heaven</h1>

        <Image src="/background.jpg" alt="" width={1000} height={562.5} />

        <h2>About us</h2>
        <p>...</p>
        <Link href="/about">
          <a>Read more</a>
        </Link>

        <h2>Top Sellers</h2>
        {props.chocolateSelection &&
          props.chocolateSelection.map((chocolate: Chocolate) => {
            return (
              <Link key={chocolate.id} href={`/products/${chocolate.id}`}>
                <a>
                  <Image
                    src={chocolate.imgPath}
                    alt={chocolate.name}
                    width={200}
                    height={200}
                  />
                  <p>{chocolate.name}</p>
                </a>
              </Link>
            );
          })}
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const chocolateSelection: Chocolate[] = [];

  while (chocolateSelection.length < 5) {
    const randomNumber = String(Math.ceil(Math.random() * 16));
    const selection = await getChocolateById(randomNumber);

    if (
      !chocolateSelection.find((chocolate) => chocolate.id !== selection?.id) &&
      selection !== null
    ) {
      chocolateSelection.push(selection);
    }
  }

  console.log(chocolateSelection);

  return {
    props: {
      chocolateSelection: chocolateSelection,
    },
  };
}
