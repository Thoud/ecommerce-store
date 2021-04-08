import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { errorMessageActions } from '../store/errorMessageSlice';
import { userSliceActions } from '../store/userSlice';
import { getSessionByToken } from '../util/database';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function Register() {
  const router = useRouter();
  const username = useAppSelector((state) => state.user.name);
  const password = useAppSelector((state) => state.user.password);
  const error = useAppSelector((state) => state.errorMessage.message);
  const dispatch = useAppDispatch();

  return (
    <>
      <Head>
        <title>Register | Chocolate Heaven</title>
      </Head>

      <h1>Register</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          const { user, errorMessage } = await response.json();

          if (errorMessage) {
            dispatch(errorMessageActions.addErrorMessage(errorMessage));
            return;
          }

          router.push(`/profile/${user.profileUrl}`);
        }}
      >
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserName(target.value))
          }
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserPassword(target.value))
          }
        />

        <button type="submit">Register</button>
      </form>

      <div>{error}</div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionByToken(context.req.cookies.session);

  if (session?.userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
