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
    <div className="fixed bg-primary top-0 right-0 bottom-0 z-30 flex flex-wrap place-items-center flex-col w-96 shadow-2xl">
      <button
        className="ml-auto mr-10 mb-56 mt-12"
        onClick={() => dispatch(profileOverlayActions.toggle())}
      >
        <Image src="/close.svg" alt="close button" width={40} height={40} />
      </button>

      {fetching && <div>Loading...</div>}

      {!fetching && !user.isSessionValid && (
        <>
          <h3 className="text-center mb-14">Login</h3>

          <form
            className="center-items flex-col"
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
              className="input-style w-56 mb-5"
              onChange={({ target }) =>
                dispatch(userSliceActions.changeUserName(target.value))
              }
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="input-style w-56 mb-8"
              onChange={({ target }) =>
                dispatch(userSliceActions.changeUserPassword(target.value))
              }
            />

            <button className="btn-link-style py-2 mb-14" type="submit">
              Login
            </button>

            {error && (
              <div className="text-red-700 font-bold text-center mb-10">
                {error}
              </div>
            )}
          </form>

          <Link href="/register">
            <button
              className="font-bold underline"
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
          <h3 className="text-center mb-14">Hello, {user.firstName}</h3>

          <Link href={`/profile/${user.profileUrl}`}>
            <a className="mb-2">Profile</a>
          </Link>

          <Link href={`/order-history/${user.profileUrl}`}>
            <a className="mb-14">Order history</a>
          </Link>

          <button
            className="btn-link-style py-2"
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
