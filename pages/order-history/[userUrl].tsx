import { GetServerSidePropsContext } from 'next';
import {
  getSessionByToken,
  getUserInformationByUrl,
} from '../../util/database';

export default function OrderHistory() {}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionByToken(context.req.cookies.session);
  const user = await getUserInformationByUrl(context.query.userUrl);

  if (!user || !session || session.userId !== user.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
