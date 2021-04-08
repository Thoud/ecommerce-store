import { GetServerSidePropsContext } from 'next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Layout from '../components/Layout';
import store from '../store/store';
import '../styles/globals.css';
import { deleteAllExpiredSessions } from '../util/database';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await deleteAllExpiredSessions();

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
    };
  }
}
