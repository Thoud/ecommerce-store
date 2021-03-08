import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductInfo from '../components/ProductInfo';
import { getChocolateById } from '../util/database';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolateSelection: Chocolate[] | null;
  orderQuantity: number;
};

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>Home | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <div>
          <Image src="/background.jpg" alt="" width={1920} height={300} />
          <h1 className="text-5xl absolute left-2/4 -ml-72 -mt-48 bg-primary rounded-lg shadow-sm px-8 py-4">
            Welcome to Chocolate Heaven
          </h1>

          <div className="mx-10">
            <h2 className="text-3xl my-10">About us</h2>
            <p>...</p>
            <Link href="/about">
              <button className="bg-tertiary rounded-lg font-medium px-4 py-1.5">
                Read more
              </button>
            </Link>
          </div>

          <div className="mx-10">
            <h2 className="text-3xl my-10">Top Sellers</h2>

            <div className="flex flex-wrap justify-around mb-14">
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
                      <p className="font-semibold text-center">
                        {chocolate.name}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  const orderQuantity = orderArr.reduce(
    (acc: number, val: Order) => acc + val.quantity,
    0,
  );

  return {
    props: {
      chocolateSelection: chocolateSelection,
      orderQuantity: orderQuantity,
    },
  };
}
