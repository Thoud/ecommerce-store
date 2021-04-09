import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useState } from 'react';
import { userSliceActions } from '../store/userSlice';
import { getSessionByToken } from '../util/database';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function Register() {
  const [error, setError] = useState('');
  const user = useAppSelector((state) => state.user.info);
  const dispatch = useAppDispatch();

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Register | Chocolate Heaven</title>
      </Head>

      <h1>Register</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (user.password !== user.reEnteredPassword) {
            return setError('Passwords do not match!');
          }

          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });

          const { profileUrl, errorMessage } = await response.json();

          setError(errorMessage);

          if (errorMessage) {
            return;
          }

          dispatch(userSliceActions.unsetPasswords());
          router.push(`/profile/${profileUrl}`);
        }}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          required
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserName(target.value))
          }
        />

        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          type="text"
          required
          onChange={({ target }) =>
            dispatch(userSliceActions.changeFirstName(target.value))
          }
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          type="text"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeLastName(target.value))
          }
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserPassword(target.value))
          }
        />

        <label htmlFor="repeatPassword">Re-enter password</label>
        <input
          id="password"
          type="password"
          required
          onChange={({ target }) =>
            dispatch(userSliceActions.changeReEnteredPassword(target.value))
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
