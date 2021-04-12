import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { userSliceActions } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function Register() {
  const [error, setError] = useState('');
  const user = useAppSelector((state) => state.user.info);
  const dispatch = useAppDispatch();

  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Register | Chocolate Heaven</title>
      </Head>

      <h1 className="m-14 ml-24">Register</h1>

      <div className="text-red-700 font-bold ml-24 mb-10">{error}</div>

      <form
        className="ml-24 mb-20"
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

          if (errorMessage) {
            return setError(errorMessage);
          }

          dispatch(userSliceActions.unsetPasswords());
          router.push(`/profile/${profileUrl}`);
        }}
      >
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          type="text"
          required
          className="input-style"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserName(target.value))
          }
        />
        <br />

        <label htmlFor="firstName">First name</label>
        <br />
        <input
          id="firstName"
          type="text"
          required
          className="input-style"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeFirstName(target.value))
          }
        />
        <br />

        <label htmlFor="lastName">Last name</label>
        <br />
        <input
          id="lastName"
          type="text"
          required
          className="input-style"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeLastName(target.value))
          }
        />
        <br />

        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          required
          className="input-style"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeUserPassword(target.value))
          }
        />
        <br />

        <label htmlFor="repeatPassword">Re-enter password</label>
        <br />
        <input
          id="password"
          type="password"
          required
          className="input-style"
          onChange={({ target }) =>
            dispatch(userSliceActions.changeReEnteredPassword(target.value))
          }
        />
        <br />

        <button className="btn-link-style py-2 mt-10 ml-20" type="submit">
          Register
        </button>
      </form>

      <div className="absolute register-image right-0">
        <Image src="/register.jpg" alt="chocolate" width={1308} height={872} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getSessionByToken } = await import('../util/database');

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
