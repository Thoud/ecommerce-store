import { GetServerSidePropsContext } from 'next';
import { getSessionByToken, getUserById } from '../../util/database';
import { User } from '../../util/types';

type Props = {
  user: User;
};

export default function UserSinglePage(props: Props) {
  return <h1>Welcome {props.user.username}!</h1>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionByToken(context.req.cookies.session);

  if (!session || session.userId !== Number(context.query.userId)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await getUserById(Number(context.query.userId));

  return {
    props: {
      user: user,
    },
  };
}
