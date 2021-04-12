import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Chocolate } from '../util/types';

type Props = {
  chocolateSelection: Chocolate[] | null;
};

export default function Home({ chocolateSelection }: Props) {
  return (
    <>
      <Head>
        <title>Home | Chocolate Heaven</title>
      </Head>

      <div>
        <Image src="/background.jpg" alt="" width={1920} height={300} />
        <h1 className="text-5xl absolute left-2/4 -ml-72 -mt-48 bg-primary rounded-lg shadow-sm px-8 py-4">
          Welcome to Chocolate Heaven
        </h1>

        <div className="mx-10">
          <h2 className="text-3xl my-10">Top Sellers</h2>

          <div className="flex flex-wrap justify-around mb-14">
            {chocolateSelection &&
              chocolateSelection.map((chocolate: Chocolate) => {
                return (
                  <div key={chocolate.id}>
                    <Link href={`/products/${chocolate.urlPath}`}>
                      <a>
                        <Image
                          src={chocolate.imgPath}
                          alt={chocolate.name}
                          width={300}
                          height={300}
                        />
                      </a>
                    </Link>
                    <p className="font-bold text-center">{chocolate.name}</p>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex items-center justify-center my-40">
          <div className="mr-40">
            <h2 className="text-3xl my-10">About us</h2>
            <p className="max-w-xl mb-10">
              Being a chocolatier and confectioner with more than 50 years of
              experience in handcrafting fine pralines and chocolate, we give
              our absolute best to be purveyor and innovator in this special
              expertise. Perfection is our daily mission.
            </p>

            <Link href="/about">
              <button className="btn-link-style py-2">Read more</button>
            </Link>
          </div>

          <Image src="/about.png" alt="" width={500} height={372} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { deleteAllExpiredSessions, getRandomChocolates } = await import(
    '../util/database'
  );

  await deleteAllExpiredSessions();

  const chocolateSelection = await getRandomChocolates();

  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/`,
        permanent: true,
      },
      props: {
        chocolateSelection,
      },
    };
  }

  return {
    props: {
      chocolateSelection,
    },
  };
}
