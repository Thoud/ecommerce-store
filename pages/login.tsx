import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { errorMessageActions } from '../store/errorMessageSlice';
import { userSliceActions } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function Login() {
  const router = useRouter();
  const username = useAppSelector((state) => state.user.name);
  const password = useAppSelector((state) => state.user.password);
  const error = useAppSelector((state) => state.errorMessage.message);
  const dispatch = useAppDispatch();

  return (
    <>
      <Head>
        <title>Login | Chocolate Heaven</title>
      </Head>

      <h1>Login</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await fetch('/api/login', {
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

          router.push(`/profile/${user.id}`);
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

        <button type="submit">Login</button>
      </form>

      <div>{error}</div>
    </>
  );
}
