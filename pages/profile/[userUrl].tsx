import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { User } from '../../util/types';

type Props = {
  user: User;
};

export default function UserSinglePage(props: Props) {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User>(props.user);

  return (
    <div>
      <Head>
        <title>Profile | Chocolate Heaven</title>
      </Head>

      <h1 className="m-10 mb-20">Welcome {user.firstName}!</h1>

      {!edit && (
        <div className="flex flex-wrap m-10">
          <div className="mr-96 mb-10">
            <h2 className="mb-10">Personal information</h2>

            <div className="flex flex-wrap">
              <div className="mr-14">
                <p>First name</p>
                <p>Last name</p>
                <p>Birthday</p>
                <p>Email</p>
                <p>Phone number</p>
              </div>
              <div>
                <p>{user.firstName || '/'}</p>
                <p>{user.lastName || '/'}</p>
                <p>{user.birthday || '/'}</p>
                <p>{user.email || '/'}</p>
                <p>{user.phoneNumber || '/'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-10">Address</h2>

            <div className="flex flex-wrap">
              <div className="mr-14">
                <p>Street and house number</p>
                <p>City</p>
                <p>ZIP code</p>
              </div>
              <div>
                <p>{user.address || '/'}</p>
                <p>{user.city || '/'}</p>
                <p>{user.zipCode || '/'}</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <button
              className="btn-link-style py-2"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {edit && (
        <form
          className="flex flex-wrap m-10"
          onSubmit={async (event) => {
            event.preventDefault();

            const response = await fetch('/api/update-user-information', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(user),
            });

            const { errorMessage } = await response.json();

            if (errorMessage) {
              return setError(errorMessage);
            }

            setEdit(false);
          }}
        >
          <div className="mr-80 mb-10">
            <h2 className="mb-10">Personal information</h2>

            <div>
              <label htmlFor="firstName">First name</label>
              <br />
              <input
                id="firstName"
                type="text"
                className="input-style"
                defaultValue={user.firstName}
                onChange={({ target }) =>
                  setUser({ ...user, firstName: target.value })
                }
              />
              <br />

              <label htmlFor="lastName">Last name</label>
              <br />
              <input
                id="lastName"
                type="text"
                className="input-style"
                defaultValue={user.lastName}
                onChange={({ target }) =>
                  setUser({ ...user, lastName: target.value })
                }
              />
              <br />

              <label htmlFor="birthday">Birthday</label>
              <br />
              <input
                id="birthday"
                type="date"
                className="input-style"
                defaultValue={user.birthday}
                onChange={({ target }) =>
                  setUser({ ...user, birthday: target.value })
                }
              />
              <br />

              <label htmlFor="email">Email</label>
              <br />
              <input
                id="email"
                type="email"
                className="input-style"
                defaultValue={user.email}
                onChange={({ target }) =>
                  setUser({ ...user, email: target.value })
                }
              />
              <br />

              <label htmlFor="phoneNumber">Phone number</label>
              <br />
              <input
                id="phoneNumber"
                type="tel"
                className="input-style"
                defaultValue={user.phoneNumber}
                onChange={({ target }) =>
                  setUser({ ...user, phoneNumber: target.value })
                }
              />
            </div>
          </div>

          <div>
            <h2 className="mb-10">Address</h2>

            <label htmlFor="address">Street and house number</label>
            <br />
            <input
              id="address"
              type="text"
              className="input-style"
              defaultValue={user.address}
              onChange={({ target }) =>
                setUser({ ...user, address: target.value })
              }
            />
            <br />

            <label htmlFor="city">City</label>
            <br />
            <input
              id="city"
              type="text"
              className="input-style"
              defaultValue={user.city}
              onChange={({ target }) =>
                setUser({ ...user, city: target.value })
              }
            />
            <br />

            <label htmlFor="zipCode">ZIP code</label>
            <br />
            <input
              id="zipCode"
              type="text"
              className="input-style"
              defaultValue={user.zipCode}
              onChange={({ target }) =>
                setUser({ ...user, zipCode: target.value })
              }
            />
          </div>

          <div className="w-full">
            <button className="btn-link-style py-2" type="submit">
              Save changes
            </button>
          </div>
        </form>
      )}

      <div className="text-red-700 font-bold m-10">{error}</div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getSessionByToken, getUserInformationByUrl } = await import(
    '../../util/database'
  );

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
      user,
    },
  };
}
