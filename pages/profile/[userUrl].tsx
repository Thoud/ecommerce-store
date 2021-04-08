import { GetServerSidePropsContext } from 'next';
import { getSessionByToken, getUserByUrl } from '../../util/database';
import { User } from '../../util/types';

type Props = {
  user: User;
};

export default function UserSinglePage(props: Props) {
  return <h1>Welcome {props.user.username}!</h1>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionByToken(context.req.cookies.session);
  const user = await getUserByUrl(context.query.userUrl);

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
