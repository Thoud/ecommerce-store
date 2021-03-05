import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductInfo from '../components/ProductInfo';
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
        <Image src="/background.jpg" alt="" width={1920} height={300} />
        <h1 className="text-3xl">Welcome to Chocolate Heaven</h1>

        <h2>About us</h2>
        <p>...</p>
        <Link href="/about">
          <a>Read more</a>
        </Link>

        <h2>Top Sellers</h2>
        {props.chocolateSelection &&
          props.chocolateSelection.map((chocolate: Chocolate) => {
            return (
              <div key={chocolate.id}>
                <ProductInfo
                  key={chocolate.id}
                  id={chocolate.id}
                  src={chocolate.imgPath}
                  alt={chocolate.name}
                  width={300}
                  height={300}
                />
                <p className="font-semibold">{chocolate.name}</p>
              </div>
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
      !chocolateSelection.find((chocolate) => chocolate.id === selection?.id) &&
      selection !== null
    ) {
      chocolateSelection.push(selection);
    }
  }

  return {
    props: {
      chocolateSelection: chocolateSelection,
    },
  };
}
