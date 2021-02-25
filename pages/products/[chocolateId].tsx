import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { getChocolateById } from '../../util/database';
import { Chocolate } from '../../util/types';
type Props = {
  chocolate: Chocolate | null;
};

export default function chocolateSinglePage(props: Props) {
  if (props.chocolate === null) {
    return (
      <>
        <Head>
          <title>Product Not Found | Chocolate Heaven</title>
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
        <title>{props.chocolate.name} | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>{props.chocolate.name}</h1>
        <Image
          src={props.chocolate.imgPath}
          alt={props.chocolate.name}
          width={400}
          height={400}
        />
        <p>{props.chocolate.description}</p>
        <p>{props.chocolate.ingredients}</p>
        <p>{props.chocolate.allergens}</p>
        <p>€ {props.chocolate.price}</p>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolate = await getChocolateById(context.query.chocolateId);

  if (!chocolate) {
    context.res.statusCode = 404;
  }

  return {
    props: {
      chocolate: chocolate || null,
    },
  };
}
