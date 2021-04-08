import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import Link from 'next/link';
import { errorMessageActions } from '../store/errorMessageSlice';
import { profileOverlayActions } from '../store/profileOverlaySlice';
import { userSliceActions } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function ProfileOverlay() {
  const router = useRouter();
  const username = useAppSelector((state) => state.user.name);
  const password = useAppSelector((state) => state.user.password);
  const error = useAppSelector((state) => state.errorMessage.message);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bg-white top-0 right-0 bottom-0 z-15 flex justify-center items-center flex-col">
      <button onClick={() => dispatch(profileOverlayActions.toggle())}>
        <Image src="/close.svg" alt="close button" width={50} height={50} />
      </button>

      <h3>Login</h3>

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

          dispatch(profileOverlayActions.toggle());
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

        <button type="submit">Login</button>
      </form>

      <button
        onClick={async () => {
          const sessionToken = Cookies.get('session');

          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken }),
          });

          const deletedSession = await response.json();

          if (!deletedSession) {
            dispatch(
              errorMessageActions.addErrorMessage('You are not logged in!'),
            );
          }

          Cookies.remove('session');
          dispatch(profileOverlayActions.toggle());
          router.push('/');
        }}
      >
        Logout
      </button>

      <Link href="/register">
        <button
          onClick={() => {
            dispatch(profileOverlayActions.toggle());
          }}
        >
          Register
        </button>
      </Link>

      <div>{error}</div>
    </div>
  );
}
