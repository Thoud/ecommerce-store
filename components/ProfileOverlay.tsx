import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { profileOverlayActions } from '../store/profileOverlaySlice';
import { userSliceActions } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../util/hooks';

export default function ProfileOverlay() {
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const user = useAppSelector((state) => state.user.info);
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/user');
      const { userInfo, sessionValid } = await response.json();

      if (sessionValid) {
        dispatch(userSliceActions.setUserInfo(userInfo));
        setFetching(false);
        return;
      }

      dispatch(userSliceActions.resetUserInfo());
      setFetching(false);
    }

    fetchData();
  }, [dispatch]);

  return (
    <div className="fixed bg-white top-0 right-0 bottom-0 z-15 flex justify-center items-center flex-col">
      <button onClick={() => dispatch(profileOverlayActions.toggle())}>
        <Image src="/close.svg" alt="close button" width={50} height={50} />
      </button>

      {fetching && <div>Loading...</div>}

      {!fetching && !user.isSessionValid && (
        <>
          <h3>Login</h3>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              const response = await fetch('/api/login', {
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
              dispatch(profileOverlayActions.toggle());
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

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              onChange={({ target }) =>
                dispatch(userSliceActions.changeUserPassword(target.value))
              }
            />

            <button type="submit">Login</button>

            {error && <div>{error}</div>}
          </form>

          <Link href="/register">
            <button
              onClick={() => {
                dispatch(profileOverlayActions.toggle());
              }}
            >
              Register
            </button>
          </Link>
        </>
      )}

      {!fetching && user.isSessionValid && (
        <>
          <h3>Hello, {user.firstName}</h3>

          <Link href={`/profile/${user.profileUrl}`}>
            <a>Profile</a>
          </Link>

          <Link href={`/order-history/${user.profileUrl}`}>
            <a>Order history</a>
          </Link>

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
                setError('You are not logged in!');
              }

              dispatch(userSliceActions.resetUserInfo());
              dispatch(profileOverlayActions.toggle());
              router.push('/');
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
