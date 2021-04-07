import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { deleteSessionByToken } from '../util/database';

export default function Logout() {
  useEffect(() => {
    Cookies.remove('session');
  }, []);

  return (
    <>
      <Head>
        <title>Logged out successfully</title>
      </Head>

      <h1>Logged out successfully</h1>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await deleteSessionByToken(context.req.cookies.session);

  return {
    props: {},
  };
}
